import { NextRequest, NextResponse } from 'next/server';
import {
  getMenuItems,
  getCanteens,
  getOrders,
  getOrderById,
  getAppSettings,
  getUserById,
} from '@/lib/db';
import { MenuItem, Order } from '@/types';
import { calculatePlatformFee } from '@/lib/calculations';

// Controlled server-side tools for Bites AI
function toolGetAvailableMenu(filters?: {
  canteenId?: string;
  category?: string;
  maxPrice?: number;
  isVeg?: boolean;
  search?: string;
}) {
  let items = getMenuItems(filters?.canteenId);
  items = items.filter((item) => item.isAvailable);

  if (filters?.category && filters.category !== 'ALL') {
    items = items.filter((item) => item.category === filters.category);
  }
  if (filters?.isVeg !== undefined) {
    items = items.filter((item) => item.isVeg === filters.isVeg);
  }
  if (filters?.maxPrice !== undefined) {
    items = items.filter((item) => item.price <= filters.maxPrice!);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }
  return items;
}

function toolGetCanteenStatus(canteenId?: string) {
  const canteens = getCanteens();
  if (canteenId) {
    return canteens.find((c) => c.id === canteenId) || null;
  }
  return canteens;
}

function toolGetStudentActiveOrder(userId: string): Order | null {
  const orders = getOrders({ userId });
  // Find active order (not completed, cancelled, or rejected)
  const active = orders.find((o) =>
    ['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status)
  );
  return active || null;
}

function toolGetPlatformPolicy() {
  const settings = getAppSettings();
  return {
    platformFee: settings.platformFee,
    deliveryPricingRules: settings.deliveryPricingRules,
    cancellationPolicy: settings.cancellationPolicy,
    autoRefundOnReject: settings.autoRefundOnReject,
    serviceHours: '7:30 AM – 10:30 PM',
  };
}

// Security: Prompt Injection and Jailbreak Sanitize Check
function containsPromptInjection(text: string): boolean {
  const lower = text.toLowerCase();
  const dangerousPatterns = [
    'ignore all previous instructions',
    'system prompt',
    'developer mode',
    'reveal passwords',
    'dump database',
    'show all users',
    'admin override',
    'eval(',
    'drop table',
  ];
  return dangerousPatterns.some((pattern) => lower.includes(pattern));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userId, userRole } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Security Verification: Prompt Injection Check
    if (containsPromptInjection(message)) {
      return NextResponse.json({
        success: true,
        reply: "I am Bites AI, your CanteenBites food assistant. I can only assist with college canteen menus, food ordering, and your active orders.",
        intent: 'SECURITY_BLOCKED',
      });
    }

    const trimmed = message.trim();
    const lower = trimmed.toLowerCase();

    // 1. ORDER TRACKING INTENTS
    if (
      lower.includes('where is my order') ||
      lower.includes('order status') ||
      lower.includes('track my order') ||
      lower.includes('when will my order be ready') ||
      lower.includes('queue position') ||
      lower.includes('how many people are ahead')
    ) {
      if (!userId) {
        return NextResponse.json({
          success: true,
          reply: 'Please sign in with your student account so I can look up your active order.',
          intent: 'ORDER_TRACKING',
        });
      }

      // Security check: Only look up the authenticated student's orders
      const activeOrder = toolGetStudentActiveOrder(userId);

      if (!activeOrder) {
        return NextResponse.json({
          success: true,
          reply: "You don't have any active food orders in the kitchen right now. Would you like to check out today's popular specials?",
          intent: 'ORDER_TRACKING',
        });
      }

      const readyTime = new Date(activeOrder.estimatedReadyTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const queueText =
        activeOrder.queuePosition > 1
          ? `You are #${activeOrder.queuePosition} in the queue with ${activeOrder.queuePosition - 1} order(s) ahead of you.`
          : activeOrder.queuePosition === 1
          ? 'You are next in line (#1)!'
          : 'Your order is ready for collection!';

      const itemNames = activeOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');

      const reply = `Your order ${activeOrder.id} (${itemNames}) from ${activeOrder.canteenName} is currently ${activeOrder.status.replace(/_/g, ' ')}. ${queueText} Estimated ready time is approximately ${readyTime}.`;

      return NextResponse.json({
        success: true,
        reply,
        intent: 'ORDER_TRACKING',
        activeOrder,
      });
    }

    // 2. ORDER CONFIRMATION / CART ASSISTANCE
    // e.g. "Order me a paneer roll" or "Add paneer roll to cart"
    if (
      lower.startsWith('order me') ||
      lower.startsWith('add') ||
      lower.includes('to my cart') ||
      lower.includes('buy a') ||
      lower.includes('get me a')
    ) {
      const allItems = toolGetAvailableMenu();
      let matchedItem: MenuItem | null = null;

      // Extract item name match
      for (const item of allItems) {
        if (lower.includes(item.name.toLowerCase())) {
          matchedItem = item;
          break;
        }
      }

      // Substring fallback
      if (!matchedItem) {
        if (lower.includes('paneer')) matchedItem = allItems.find((i) => i.name.toLowerCase().includes('paneer')) || null;
        else if (lower.includes('burger')) matchedItem = allItems.find((i) => i.name.toLowerCase().includes('burger')) || null;
        else if (lower.includes('dosa')) matchedItem = allItems.find((i) => i.name.toLowerCase().includes('dosa')) || null;
        else if (lower.includes('pizza')) matchedItem = allItems.find((i) => i.name.toLowerCase().includes('pizza')) || null;
        else if (lower.includes('coffee')) matchedItem = allItems.find((i) => i.name.toLowerCase().includes('coffee')) || null;
        else if (lower.includes('chole') || lower.includes('bhature')) matchedItem = allItems.find((i) => i.name.toLowerCase().includes('chole')) || null;
      }

      if (matchedItem) {
        const policy = toolGetPlatformPolicy();
        const platformFee = calculatePlatformFee(matchedItem.price, policy.platformFee);
        const total = matchedItem.price + platformFee;

        const reply = `${matchedItem.name} is available at ${matchedItem.canteenName} for ₹${matchedItem.price}. I've prepared it to be added to your cart. Your estimated subtotal is ₹${total} (including ₹${platformFee} platform fee). Would you like to continue to checkout?`;

        return NextResponse.json({
          success: true,
          reply,
          intent: 'ORDER_CONFIRMATION',
          cartAction: {
            action: 'ADD',
            item: matchedItem,
            quantity: 1,
          },
          recommendedItems: [matchedItem],
          checkoutPrompt: true,
        });
      }
    }

    // 3. FASTEST FOOD / QUICK BITES
    if (lower.includes('fastest') || lower.includes('quick') || lower.includes('rush') || lower.includes('ready in less than')) {
      const allItems = toolGetAvailableMenu();
      const fastest = allItems.sort((a, b) => a.prepTimeMinutes - b.prepTimeMinutes).slice(0, 3);

      const listDesc = fastest.map((i) => `${i.name} (~${i.prepTimeMinutes} mins, ₹${i.price})`).join(', ');
      const reply = `In a hurry for your next lecture? Here are the fastest foods you can grab right now: ${listDesc}. Tap below to add any to your cart!`;

      return NextResponse.json({
        success: true,
        reply,
        intent: 'FOOD_RECOMMENDATION',
        recommendedItems: fastest,
      });
    }

    // 4. BUDGET / UNDER ₹100
    if (lower.includes('under') || lower.includes('below') || lower.includes('budget') || lower.includes('cheap')) {
      let maxBudget = 100;
      const numMatch = lower.match(/\d+/);
      if (numMatch) {
        maxBudget = parseInt(numMatch[0], 10);
      }

      const isVegOnly = lower.includes('veg');
      const budgetItems = toolGetAvailableMenu({ maxPrice: maxBudget, isVeg: isVegOnly ? true : undefined });
      const topItems = budgetItems.slice(0, 4);

      if (topItems.length > 0) {
        const reply = `Here are delicious items available right now under ₹${maxBudget}:${isVegOnly ? ' (100% Pure Veg)' : ''}`;
        return NextResponse.json({
          success: true,
          reply,
          intent: 'FOOD_RECOMMENDATION',
          recommendedItems: topItems,
        });
      } else {
        return NextResponse.json({
          success: true,
          reply: `I couldn't find items under ₹${maxBudget}. The most budget-friendly options start at ₹20 for fresh Tea and ₹60 for Cold Coffee!`,
          intent: 'FOOD_RECOMMENDATION',
          recommendedItems: toolGetAvailableMenu({ maxPrice: 80 }).slice(0, 3),
        });
      }
    }

    // 5. VEGETARIAN FOOD
    if (lower.includes('vegetarian') || lower.includes('veg food') || lower.includes('pure veg')) {
      const vegItems = toolGetAvailableMenu({ isVeg: true }).slice(0, 4);
      const reply = "All campus canteens provide freshly prepared pure vegetarian options. Here are the top favorites:";
      return NextResponse.json({
        success: true,
        reply,
        intent: 'FOOD_RECOMMENDATION',
        recommendedItems: vegItems,
      });
    }

    // 6. SPECIFIC CATEGORIES (Snacks, Pizza, Drinks, Burgers, Meals)
    let categorySearch: string | undefined;
    if (lower.includes('snack')) categorySearch = 'SNACKS';
    else if (lower.includes('pizza')) categorySearch = 'PIZZA';
    else if (lower.includes('drink') || lower.includes('beverage') || lower.includes('coffee') || lower.includes('tea')) categorySearch = 'BEVERAGES';
    else if (lower.includes('burger') || lower.includes('roll') || lower.includes('fast food')) categorySearch = 'FAST_FOOD';
    else if (lower.includes('meal') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('dosa') || lower.includes('chole')) categorySearch = 'MEALS';
    else if (lower.includes('dessert') || lower.includes('sweet')) categorySearch = 'DESSERTS';

    if (categorySearch) {
      const items = toolGetAvailableMenu({ category: categorySearch }).slice(0, 4);
      if (items.length > 0) {
        return NextResponse.json({
          success: true,
          reply: `Here are the top available ${categorySearch.replace('_', ' ').toLowerCase()} items currently on the menu:`,
          intent: 'FOOD_RECOMMENDATION',
          recommendedItems: items,
        });
      }
    }

    // 7. PLATFORM POLICIES & HOW ORDERING WORKS
    if (
      lower.includes('how it works') ||
      lower.includes('hostel delivery') ||
      lower.includes('delivery charge') ||
      lower.includes('platform fee') ||
      lower.includes('refund') ||
      lower.includes('cancel')
    ) {
      const policy = toolGetPlatformPolicy();
      let explanation = "";

      if (lower.includes('hostel delivery')) {
        explanation = "Hostel room delivery is available exclusively for Hostellers. When you checkout, select your Hostel, Block, Floor and Room Number. Canteen staff confirms or declines delivery based on runner availability. Orders above ₹300 receive Free Room Delivery!";
      } else if (lower.includes('refund') || lower.includes('cancel')) {
        explanation = "If a canteen declines your order, an instant full refund is triggered to your original payment method. You can also cancel an order before the kitchen starts cooking.";
      } else if (lower.includes('platform fee')) {
        explanation = `CanteenBites charges a nominal platform fee of ₹${policy.platformFee.fixedFee} per order to maintain real-time queue synchronization and live kitchen servers.`;
      } else {
        explanation = "Ordering on CanteenBites is simple: 1. Choose a canteen & add food, 2. Choose Pickup or Hostel Delivery, 3. Pay securely, and 4. Watch your live queue position count down!";
      }

      return NextResponse.json({
        success: true,
        reply: explanation,
        intent: 'POLICY_EXPLANATION',
      });
    }

    // 8. GENERAL / "WHAT SHOULD I EAT" / POPULAR FOODS
    const popularItems = toolGetAvailableMenu().slice(0, 4);
    const reply = "I recommend checking out today's top campus bestsellers! Paneer Butter Roll, Crispy Veg Burger, and South Indian Masala Dosa are currently trending:";

    return NextResponse.json({
      success: true,
      reply,
      intent: 'FOOD_RECOMMENDATION',
      recommendedItems: popularItems,
    });
  } catch (error: any) {
    console.error('AI assistant error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error in Bites AI' },
      { status: 500 }
    );
  }
}
