'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Users,
  Bike,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ChefHat,
  Search,
  Zap,
  MapPin,
  TrendingUp,
  HeartHandshake,
  Bot,
  Plus,
  Minus,
  Check,
  Building,
  GraduationCap,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_COUPONS } from '@/lib/constants';

interface PublicLandingProps {
  onEnterApp?: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onEnterApp }) => {
  const router = useRouter();
  const {
    canteens,
    setSelectedCanteen,
    setActiveNavTab,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    showToast,
    switchRole,
    setOrderType,
  } = useApp();

  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleOrderFoodClick = () => {
    if (onEnterApp) {
      onEnterApp();
    } else {
      setActiveNavTab('home');
    }
  };

  const handleHostelDeliveryOrder = () => {
    setOrderType('HOSTEL_DELIVERY');
    if (onEnterApp) {
      onEnterApp();
    } else {
      setActiveNavTab('home');
    }
  };

  const handleExploreCanteens = () => {
    const el = document.getElementById('popular-canteens');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast('Coupon Copied!', `Promo code ${code} copied to clipboard`, 'success');
    setTimeout(() => {
      setCopiedCoupon(null);
    }, 2500);
  };

  const popularFoods = [
    {
      id: 'pop-1',
      name: 'Paneer Butter Roll',
      canteen: 'Main Canteen',
      canteenId: 'canteen-main',
      price: 90,
      prepTime: 10,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      badge: 'Best Seller',
      isVeg: true,
      category: 'FAST_FOOD' as const,
      description: 'Char-grilled fresh paneer cubes tossed in rich makhani gravy wrapped in flaky paratha.',
    },
    {
      id: 'pop-2',
      name: 'Crispy Veg Cheesy Burger',
      canteen: 'Food Court',
      canteenId: 'canteen-food-court',
      price: 70,
      prepTime: 8,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Trending 🔥',
      isVeg: true,
      category: 'FAST_FOOD' as const,
      description: 'Golden spiced potato & corn patty layered with melted cheese, crunchy lettuce and herb mayo.',
    },
    {
      id: 'pop-3',
      name: 'South Indian Masala Dosa',
      canteen: 'Main Canteen',
      canteenId: 'canteen-main',
      price: 80,
      prepTime: 12,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      badge: 'Campus Favorite',
      isVeg: true,
      category: 'MEALS' as const,
      description: 'Crispy golden fermented crepe stuffed with seasoned potato masala, served with 2 chutneys & hot sambar.',
    },
    {
      id: 'pop-4',
      name: 'Punjabi Chole Bhature',
      canteen: 'Hostel Canteen',
      canteenId: 'canteen-hostel',
      price: 100,
      prepTime: 14,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
      badge: 'Hostel Star',
      isVeg: true,
      category: 'MEALS' as const,
      description: 'Two fluffy balloon bhaturas paired with authentic spicy Amritsari chole, pickled onions and green chili.',
    },
    {
      id: 'pop-5',
      name: 'Chilled Thick Cold Coffee',
      canteen: 'Food Court',
      canteenId: 'canteen-food-court',
      price: 60,
      prepTime: 5,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      badge: 'Exam Fuel ☕',
      isVeg: true,
      category: 'BEVERAGES' as const,
      description: 'Double brewed artisanal espresso blended with chilled milk, vanilla bean and decadent chocolate syrup.',
    },
    {
      id: 'pop-6',
      name: 'Farmhouse Loaded Pizza',
      canteen: 'Food Court',
      canteenId: 'canteen-food-court',
      price: 150,
      prepTime: 15,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      badge: 'Party Pick 🍕',
      isVeg: true,
      category: 'PIZZA' as const,
      description: 'Freshly baked thin-crust pizza topped with bell peppers, sweet corn, mushrooms, olives and 100% mozzarella.',
    },
  ];

  const handleQuickAdd = (food: typeof popularFoods[0]) => {
    addToCart({
      id: food.id,
      name: food.name,
      canteenId: food.canteenId,
      canteenName: food.canteen,
      price: food.price,
      prepTimeMinutes: food.prepTime,
      category: food.category,
      isVeg: food.isVeg,
      isAvailable: true,
      image: food.image,
      rating: food.rating,
      description: food.description,
    });
    showToast('Added to Cart', `${food.name} added to your order!`, 'success');
  };

  const aiPrompts = [
    'Find something under ₹100',
    "What's popular today?",
    'Suggest a high-protein meal',
    'Best food for a quick break',
    'Show vegetarian options',
  ];

  return (
    <div className="space-y-20 pb-16 text-left">
      {/* 1. HERO SECTION (2-Column Desktop, Stacked Mobile) */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-transparent rounded-3xl border border-indigo-100/60 shadow-sm mx-4 sm:mx-6 lg:mx-8 px-5 sm:px-10 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, CTAs, Flow & Live Kitchen Status */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Campus Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse-subtle" />
              <span>Swami Vivekanand Institute of Engineering & Technology</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Skip the Queue.{' '}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Enjoy Your Food.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              Order from your campus canteen, track your food live, and get it delivered straight to your hostel.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={handleOrderFoodClick}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Order Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/menu"
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm sm:text-base shadow-2xs hover:border-slate-400 transition-all flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-brand-600" />
                <span>Explore Menu</span>
              </Link>

              <Link
                href="/bites-ai"
                className="px-5 py-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 font-bold text-sm sm:text-base shadow-2xs transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-purple-600" />
                <span>Ask Bites AI 🤖</span>
              </Link>
            </div>

            {/* Core Communication Flow Pill: ORDER -> TRACK -> ENJOY */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-black tracking-wider uppercase shadow-md">
                <span className="flex items-center gap-1.5 text-brand-300">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  ORDER
                </span>
                <span className="text-slate-500">→</span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  TRACK
                </span>
                <span className="text-slate-500">→</span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ENJOY
                </span>
              </div>
            </div>

            {/* Real-time Live Kitchen Status Component */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-card flex items-center justify-between gap-4 max-w-lg">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>Kitchen Open</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-600 font-bold">Orders being prepared</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Estimated preparation: <strong className="text-slate-700">8–12 min</strong> across canteens
                  </div>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 font-extrabold text-slate-700 border border-slate-200 hidden sm:inline-block">
                Live Status
              </span>
            </div>
          </div>

          {/* Right Column: Animated Visual Showcase with Floating Food Micro-Cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-4 lg:py-0">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/15 via-purple-500/10 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Central Showcase Card */}
            <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-4 shadow-elevated border border-slate-200/90 space-y-3 z-10 transition-all">
              <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
                  alt="Crispy Paneer Burger"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold shadow-2xs">
                    Campus #1
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-2xs">
                    Veg
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>~8m</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="font-black text-base text-slate-900">Crispy Paneer Burger</h3>
                  <p className="text-xs text-brand-600 font-semibold">Central Food Court</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">₹70</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleQuickAdd({
                    id: 'pop-2',
                    name: 'Crispy Veg Cheesy Burger',
                    canteen: 'Food Court',
                    canteenId: 'canteen-food-court',
                    price: 70,
                    prepTime: 8,
                    rating: 4.8,
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
                    badge: 'Trending 🔥',
                    isVeg: true,
                    category: 'FAST_FOOD',
                    description: 'Golden spiced potato & corn patty layered with melted cheese, crunchy lettuce and herb mayo.',
                  })
                }
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add to Plate</span>
              </button>
            </div>

            {/* Floating Micro-Card 1: Farmhouse Pizza (Top-Right) */}
            <div className="hidden sm:flex absolute -top-5 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-slate-200/90 items-center gap-2.5 z-20 animate-float-gentle">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&q=80"
                alt="Pizza"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left pr-2">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <span>Farmhouse Pizza</span>
                  <span className="text-[10px] text-amber-500 font-bold">★ 4.8</span>
                </div>
                <div className="text-[11px] text-slate-500 font-bold">₹150 • 15m</div>
              </div>
            </div>

            {/* Floating Micro-Card 2: Cold Coffee (Bottom-Left) */}
            <div
              className="hidden sm:flex absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-slate-200/90 items-center gap-2.5 z-20 animate-float-gentle"
              style={{ animationDelay: '1.5s' }}
            >
              <img
                src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=120&q=80"
                alt="Cold Coffee"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left pr-2">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <span>Cold Coffee ☕</span>
                  <span className="text-[10px] text-amber-500 font-bold">★ 4.9</span>
                </div>
                <div className="text-[11px] text-slate-500 font-bold">₹60 • 5m prep</div>
              </div>
            </div>

            {/* Floating Micro-Card 3: Masala Dosa (Bottom-Right) */}
            <div
              className="hidden md:flex absolute -bottom-8 -right-2 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-slate-200/90 items-center gap-2.5 z-20 animate-float-gentle"
              style={{ animationDelay: '2.5s' }}
            >
              <img
                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=120&q=80"
                alt="Dosa"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left pr-2">
                <div className="text-xs font-black text-slate-900">Masala Dosa</div>
                <div className="text-[11px] text-slate-500 font-bold">₹80 • Crispy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (Visual 4-Step Animated Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
            <Zap className="w-3 h-3 text-indigo-600" />
            <span>Effortless 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How CanteenBites Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            No more pushing through physical crowds or waiting blindly in long canteen queues.
          </p>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="font-black text-base text-slate-900">Choose Food</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Browse live menus from SVIET Main Canteen, Food Court & Hostel Canteen with real-time stock.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="font-black text-base text-slate-900">Place Order</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Add food to cart, select Canteen Pickup or Hostel Room Delivery, and pay with UPI or Cash.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="font-black text-base text-slate-900">Track Preparation</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Watch real-time queue position count down (#7 → #4 → READY) with live estimated preparation times.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 transition-transform">
              04
            </div>
            <h3 className="font-black text-base text-slate-900">Pickup or Delivery</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Pick up at the express counter with zero wait, or have it delivered right to your hostel door!
            </p>
          </div>
        </div>
      </section>

      {/* 3. MOST POPULAR BITES (FOOD CARD DESIGN WITH INLINE STEPPER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
              <span>Campus Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Most Popular Bites
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Handpicked top-rated delicacies ordered hundreds of times daily by SVIET students.
            </p>
          </div>

          <Link
            href="/menu"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto hover:underline"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFoods.map((food) => {
            const inCart = cart.find((c) => c.menuItem.id === food.id);

            return (
              <div
                key={food.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
                        {food.badge}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                        Veg
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-xl bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>~{food.prepTime}m</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                        {food.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{food.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-600 font-semibold mt-0.5">{food.canteen}</p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Price</span>
                    <span className="text-lg font-black text-slate-900">₹{food.price}</span>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-xl p-1 shadow-2xs animate-scale-in">
                      <button
                        onClick={() => {
                          if (inCart.quantity <= 1) {
                            removeFromCart(food.id);
                          } else {
                            updateCartQuantity(food.id, inCart.quantity - 1);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-white border border-brand-200 text-brand-700 hover:bg-brand-100 flex items-center justify-center font-black text-xs active:scale-90 transition-transform shadow-2xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-brand-900 text-xs">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(food.id, inCart.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center font-black text-xs active:scale-90 transition-transform shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleQuickAdd(food)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. POPULAR CANTEENS SHOWCASE (LIVE QUEUE, TIMINGS, DISTANCE) */}
      <section id="popular-canteens" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Food Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Popular College Canteens
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Check live queue loads, campus walking distances, and hostel delivery support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canteens.map((canteen) => (
            <div
              key={canteen.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={canteen.image}
                    alt={canteen.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${
                        canteen.status === 'OPEN'
                          ? 'bg-emerald-500 text-white'
                          : canteen.status === 'BUSY'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{canteen.status}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-xl bg-slate-900/80 backdrop-blur-sm text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-400" />
                    <span>
                      {canteen.id === 'canteen-main'
                        ? 'Central Academic Hub'
                        : canteen.id === 'canteen-food-court'
                        ? 'Academic Block 1'
                        : 'Hostel Quad'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-lg text-slate-900">{canteen.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{canteen.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-xs text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{canteen.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Average Prep</div>
                      <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>~{canteen.avgPrepTimeMinutes} mins</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                      <div className="text-[10px] text-indigo-400 font-bold uppercase">Live Queue</div>
                      <div className="font-black text-indigo-700 mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-indigo-500" />
                        <span>{canteen.currentQueueCount} orders</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
                    <Bike className={`w-3.5 h-3.5 ${canteen.hostelDeliveryEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={canteen.hostelDeliveryEnabled ? 'text-emerald-600' : 'text-slate-400'}>
                      {canteen.hostelDeliveryEnabled ? 'Hostel Room Delivery Available' : 'Pickup Only'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedCanteen(canteen);
                    handleOrderFoodClick();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>View Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOSTEL ROOM DELIVERY SECTION (DEDICATED PREMIUM SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-brand-900 to-purple-950 p-6 sm:p-10 lg:p-12 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
                <Bike className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hostel Doorstep Service</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Your Food. Your Hostel.{' '}
                <span className="text-amber-300">Your Door.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Exam season or late-night assignments? Order hot meals, snacks and cold beverages straight to your room in <strong>J-Block Boys Hostel</strong>, <strong>D-Block Boys Hostel</strong>, or <strong>Girls Hostel I-block</strong>.
              </p>

              {/* 4 Steps Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Select Hostel & Block</span>
                    <span className="text-[11px] text-slate-400">J-Block, D-Block or Girls I-Block</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Add Floor & Room Number</span>
                    <span className="text-[11px] text-slate-400">Exact room details for swift arrival</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Track Delivery Partner</span>
                    <span className="text-[11px] text-slate-400">Live order status from kitchen to door</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Receive Your Food</span>
                    <span className="text-[11px] text-slate-400">Enjoy fresh food without leaving study desk</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleHostelDeliveryOrder}
                  className="px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Bike className="w-4 h-4 text-slate-950" />
                  <span>Order for Delivery</span>
                </button>
              </div>
            </div>

            {/* Visual Delivery Badge Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Hostel Delivery Active</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Open Now
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hostels Covered:</span>
                  <span className="font-bold text-white">J-Block, D-Block & Girls I-Block</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Delivery Fee:</span>
                  <span className="font-bold text-emerald-300">₹15 Flat per Order</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <span className="font-bold text-white">15–20 mins</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
                💡 <em>&quot;Delivery agents will call your registered phone once they arrive at your hostel floor.&quot;</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BITES AI SHOWCASE (WITH INTERACTIVE PROMPT CHIPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-purple-200/80 shadow-card space-y-6 relative overflow-hidden text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-xl shadow-2xs">
                🤖
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 mb-0.5">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Powered by Gemini AI</span>
                </div>
                <h3 className="font-black text-xl text-slate-900">Bites AI Assistant</h3>
                <p className="text-xs text-slate-500">&quot;What are you hungry for?&quot;</p>
              </div>
            </div>

            <Link
              href="/bites-ai"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <span>Open AI Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Not sure what to eat between classes? Bites AI knows real-time canteen menus, current queue times, vegetarian options, and student budgets. Click any prompt below to ask:
          </p>

          {/* Interactive AI Prompt Chips */}
          <div className="flex flex-wrap gap-2.5">
            {aiPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => router.push(`/bites-ai?prompt=${encodeURIComponent(prompt)}`)}
                className="px-3.5 py-2 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold shadow-2xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-purple-600" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OFFERS & COUPONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-10 text-white shadow-elevated">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Save on Campus Food</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Exclusive Student Promo Codes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Use verified coupon codes at checkout for instant discounts on all campus canteens!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {INITIAL_COUPONS.slice(0, 2).map((coupon) => {
                const isCopied = copiedCoupon === coupon.code;

                return (
                  <div
                    key={coupon.code}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 text-left transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-sm tracking-wider text-amber-300">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                          isCopied
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <span>Copy Code</span>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200">{coupon.description}</p>
                    <span className="text-[10px] text-slate-400 block">Min order: ₹{coupon.minOrderAmount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CAMPUS PORTALS SELECTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            <Building className="w-3.5 h-3.5 text-slate-600" />
            <span>Campus Roles & Portals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Designed for Every Campus Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Switch your role with one click or sign in to your dedicated college portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Student Portal */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Student Portal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hostellers & Day Scholars can browse live menus, skip physical counter lines, track live kitchen queues, and request room delivery.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-student-hosteller');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Enter Student App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Canteen Staff Portal */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Canteen Kitchen</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kitchen display screen for canteen managers to accept orders, manage preparation queues, adjust prep time, and update menu item stock.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-canteen-staff');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Kitchen Screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Delivery Staff Portal */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Hostel Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Delivery partner portal to accept ready orders from canteens, see exact hostel block & room details, and complete deliveries with OTP.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-delivery-staff');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Delivery Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Administrator Portal */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Platform Admin</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Campus administration led by Yash Vardhan to manage all canteens, monitor daily revenues, verify coupons, and resolve student inquiries.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-admin');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. CAMPUS TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Loved by Campus Students</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            What SVIET Students Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real feedback from hostellers, day scholars, and college canteen managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &quot;Between lectures, we only have a 15-minute recess. With CanteenBites, I order right at the end of class and walk in to pick up my hot Paneer Roll immediately without standing in that chaotic 50-person crowd!&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Aarav Sharma</span>
              <span className="text-slate-400">CSE, 3rd Year • J-Block Boys Hostel</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &quot;Late night study sessions before midterms were painful before room delivery. Now we order pizzas and cold coffee from the hostel canteen, and the delivery staff brings it right to our floor. Absolute lifesaver.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Priya Patel</span>
              <span className="text-slate-400">ECE, 2nd Year • Girls Hostel I-block</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &quot;As canteen kitchen managers, our counter panic has completely vanished. The live queue screen organizes orders systematically, students arrive on time when their food is marked ready, and our daily revenue grew 35%.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Ramesh Kumar</span>
              <span className="text-slate-400">Manager • Main College Canteen</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
