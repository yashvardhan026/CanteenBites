import { AppSettings, Coupon, DeliveryPricingRule, Order, PlatformFeeConfig } from "@/types";

/**
 * Calculates delivery charge based on subtotal and admin configured pricing rules.
 * Default rule example:
 * ₹0-99 -> ₹20
 * ₹100-199 -> ₹15
 * ₹200-299 -> ₹10
 * ₹300+ -> Free
 */
export function calculateDeliveryCharge(
  subtotal: number,
  rules: DeliveryPricingRule[],
  isHostelDelivery: boolean
): number {
  if (!isHostelDelivery) return 0;
  if (!rules || rules.length === 0) return 15; // default fallback

  for (const rule of rules) {
    if (rule.maxAmount === null) {
      // e.g. 300 and above
      if (subtotal >= rule.minAmount) {
        return rule.charge;
      }
    } else {
      if (subtotal >= rule.minAmount && subtotal <= rule.maxAmount) {
        return rule.charge;
      }
    }
  }

  return 15; // fallback
}

/**
 * Calculates platform fee based on admin configured model (FIXED, PERCENTAGE, HYBRID)
 */
export function calculatePlatformFee(subtotal: number, config: PlatformFeeConfig): number {
  if (!config) return 5;

  switch (config.model) {
    case 'FIXED':
      return Math.round(config.fixedFee);
    case 'PERCENTAGE':
      return Math.max(1, Math.round((subtotal * config.percentage) / 100));
    case 'HYBRID':
      return Math.max(1, Math.round(config.fixedBase + (subtotal * config.percentage) / 100));
    default:
      return 5;
  }
}

/**
 * Validates and applies coupon discount
 */
export function calculateCouponDiscount(
  subtotal: number,
  coupon: Coupon | null | undefined
): { discount: number; error?: string } {
  if (!coupon) return { discount: 0 };

  if (!coupon.isActive) {
    return { discount: 0, error: 'This coupon is no longer active.' };
  }

  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { discount: 0, error: 'This coupon has expired.' };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      discount: 0,
      error: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}.`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = coupon.discountValue;
  }

  return { discount: Math.min(discount, subtotal) };
}

/**
 * Smart Dynamic ETA and Queue position calculator
 * Considers active orders ahead in queue, prep times, and average throughput.
 */
export function calculateSmartEstimatedTime(
  queueIndex: number,
  itemCount: number,
  avgPrepMinutes: number,
  delayMinutes: number = 0
): { minutesRemaining: number; readyTimestamp: string } {
  // Base item preparation time (e.g. 10 mins) + 2 mins per extra item
  const itemPrepFactor = Math.max(avgPrepMinutes, 8) + Math.max(0, itemCount - 1) * 2;
  
  // Pipeline processing: Canteens typically have 2-3 parallel cooking stations
  const parallelStations = 2;
  const queueWaitMinutes = Math.ceil((queueIndex * itemPrepFactor) / parallelStations);
  
  const totalMinutes = Math.max(3, queueWaitMinutes + itemPrepFactor + delayMinutes);
  const readyDate = new Date(Date.now() + totalMinutes * 60000);

  return {
    minutesRemaining: totalMinutes,
    readyTimestamp: readyDate.toISOString(),
  };
}

/**
 * Recalculate queue positions for active orders of a canteen
 */
export function recalculateQueuePositions(canteenOrders: Order[]): Order[] {
  // Active orders are those in PENDING_ACCEPTANCE, ACCEPTED, or PREPARING
  const activeOrders = canteenOrders
    .filter((o) => ['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING'].includes(o.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const activeIdsMap = new Map<string, number>();
  activeOrders.forEach((order, idx) => {
    activeIdsMap.set(order.id, idx + 1);
  });

  return canteenOrders.map((order) => {
    if (activeIdsMap.has(order.id)) {
      return {
        ...order,
        queuePosition: activeIdsMap.get(order.id)!,
      };
    }
    return {
      ...order,
      queuePosition: 0,
    };
  });
}
