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
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { INITIAL_COUPONS } from '@/lib/constants';
import { ScrollReveal } from '@/components/common/ScrollReveal';

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
      canteen: 'Main Campus Canteen',
      canteenId: 'canteen-main',
      price: 90,
      prepTime: 10,
      rating: 4.9,
      image: '/images/paneer-butter-roll.jpg',
      badge: 'Best Seller ⭐',
      isVeg: true,
      category: 'FAST_FOOD' as const,
      description: 'Char-grilled fresh paneer cubes tossed in rich makhani gravy wrapped in flaky paratha.',
    },
    {
      id: 'pop-2',
      name: 'Crispy Veg Cheesy Burger',
      canteen: 'Main Campus Canteen',
      canteenId: 'canteen-main',
      price: 70,
      prepTime: 8,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80',
      badge: 'Trending 🔥',
      isVeg: true,
      category: 'FAST_FOOD' as const,
      description: 'Golden spiced potato & corn patty layered with melted cheese, crunchy lettuce and herb mayo.',
    },
    {
      id: 'pop-3',
      name: 'South Indian Masala Dosa',
      canteen: 'Main Campus Canteen',
      canteenId: 'canteen-main',
      price: 80,
      prepTime: 12,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      badge: 'Campus Favorite',
      isVeg: true,
      category: 'MEALS' as const,
      description: 'Crispy golden fermented crepe stuffed with seasoned potato masala, served with 2 chutneys & hot sambar.',
    },
    {
      id: 'pop-4',
      name: 'Punjabi Samosa with Chutney (2 Pcs)',
      canteen: 'Main Campus Canteen',
      canteenId: 'canteen-main',
      price: 30,
      prepTime: 5,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      badge: 'All-Time Hit ⭐',
      isVeg: true,
      category: 'SNACKS' as const,
      description: 'Golden-fried flaky crust pastry filled with spiced potatoes, peas, served with sweet tamarind and mint chutney.',
    },
    {
      id: 'pop-5',
      name: 'Hyderabadi Dum Chicken Biryani',
      canteen: 'Engineering Food Court',
      canteenId: 'canteen-foodcourt',
      price: 165,
      prepTime: 14,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      badge: 'Chef Special 👑',
      isVeg: false,
      category: 'MEALS' as const,
      description: 'Slow-cooked aromatic long grain basmati rice layered with marinated chicken, saffron, fried onions & boondi raita.',
    },
    {
      id: 'pop-6',
      name: 'Chilled Thick Cold Coffee',
      canteen: 'Main Campus Canteen',
      canteenId: 'canteen-main',
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
      id: 'pop-7',
      name: 'Farmhouse Loaded Pizza',
      canteen: 'Engineering Food Court',
      canteenId: 'canteen-foodcourt',
      price: 150,
      prepTime: 15,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=80',
      badge: 'Party Pick 🍕',
      isVeg: true,
      category: 'PIZZA' as const,
      description: 'Freshly baked thin-crust pizza topped with bell peppers, sweet corn, mushrooms, olives and 100% mozzarella.',
    },
    {
      id: 'pop-8',
      name: 'Oreo Chocolate Overload Shake',
      canteen: 'Hostel Night Canteen',
      canteenId: 'canteen-night',
      price: 80,
      prepTime: 5,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      badge: 'Night Cravings 🌙',
      isVeg: true,
      category: 'BEVERAGES' as const,
      description: 'Ultra-creamy rich vanilla and chocolate ice cream churned with crushed Oreo cookies, chocolate ganache, and crunchies.',
    },
  ];

  const handleQuickAdd = (food: (typeof popularFoods)[0]) => {
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
    <div className="space-y-24 pb-20 text-left">
      {/* 1. HERO SECTION (Dark Navy with Animated Ambient Blobs & Staggered Reveal) */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20 bg-[#0B1220] rounded-3xl border border-white/10 shadow-2xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10 lg:px-12">
        {/* Decorative Pure-CSS Background Glowing Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none animate-drift-1" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#FFB454]/12 blur-3xl pointer-events-none animate-drift-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headline, Supporting Text, Action Buttons, Flow & Live Kitchen Status */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Campus Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151F32] border border-white/10 text-slate-300 text-xs font-bold shadow-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB454] animate-pulse-subtle" />
              <span>Swami Vivekanand Institute of Engineering & Technology</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] animate-slide-up">
              Your Campus Cravings,{' '}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#FFB454] via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Without the Queue.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal animate-fade-in">
              Order your favourite campus food, track preparation, and enjoy a smarter canteen experience.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 animate-scale-in">
              <button
                onClick={handleOrderFoodClick}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Order Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/menu"
                className="px-6 py-3.5 rounded-2xl bg-[#151F32] border border-white/15 text-white hover:bg-[#1E2B45] hover:border-[#FFB454]/40 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <ChefHat className="w-4 h-4 text-[#FFB454]" />
                <span>Explore Menu</span>
              </Link>

              <Link
                href="/bites-ai"
                className="px-5 py-3.5 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-purple-300 hover:bg-purple-900/80 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Ask Bites AI 🤖</span>
              </Link>
            </div>

            {/* Core Communication Flow Pill: ORDER -> TRACK -> ENJOY */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-2xl bg-[#151F32] border border-white/10 text-white text-xs font-black tracking-wider uppercase shadow-md">
                <span className="flex items-center gap-1.5 text-brand-300">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  ORDER
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1.5 text-[#FFB454]">
                  <span className="w-2 h-2 rounded-full bg-[#FFB454]" />
                  TRACK
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ENJOY
                </span>
              </div>
            </div>

            {/* Real-time Live Kitchen Status Component */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#151F32]/95 backdrop-blur-md border border-white/10 shadow-xl flex items-center justify-between gap-4 max-w-lg">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>Kitchen Open</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400 font-bold">Orders being prepared</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Estimated preparation: <strong className="text-white">8–12 min</strong> across campus canteens
                  </div>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-xl bg-[#0B1220] font-extrabold text-[#FFB454] border border-white/10 hidden sm:inline-block">
                Live Status
              </span>
            </div>
          </div>

          {/* Right Column: Animated Visual Showcase with Floating Food Micro-Cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-4 lg:py-0">
            {/* Ambient Background Glow behind Showcase */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 via-purple-500/15 to-[#FFB454]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Central Showcase Card */}
            <div className="relative w-full max-w-sm sm:max-w-md bg-[#151F32] rounded-3xl p-4 shadow-2xl border border-white/15 space-y-3 z-10 hover:border-[#FFB454]/40 transition-all duration-300 group">
              <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=700&q=80"
                  alt="Crispy Paneer Burger"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
                    Campus #1
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                    Veg
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-[#0B1220]/90 backdrop-blur-sm text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-[#FFB454]" />
                  <span>~8m</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="font-black text-base text-white group-hover:text-[#FFB454] transition-colors">
                    Crispy Paneer Burger
                  </h3>
                  <p className="text-xs text-brand-300 font-semibold">Central Food Court</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white">₹70</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#FFB454]">
                    <Star className="w-3 h-3 fill-[#FFB454] text-[#FFB454]" />
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
                    image:
                      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80',
                    badge: 'Trending 🔥',
                    isVeg: true,
                    category: 'FAST_FOOD',
                    description:
                      'Golden spiced potato & corn patty layered with melted cheese, crunchy lettuce and herb mayo.',
                  })
                }
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add to Plate</span>
              </button>
            </div>

            {/* Floating Micro-Card 1: Farmhouse Pizza (Top-Right) */}
            <div className="hidden sm:flex absolute -top-5 -right-4 bg-[#151F32]/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-white/15 items-center gap-2.5 z-20 animate-float-gentle">
              <img
                src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=120&q=80"
                alt="Pizza"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left pr-2">
                <div className="text-xs font-black text-white flex items-center gap-1">
                  <span>Farmhouse Pizza</span>
                  <span className="text-[10px] text-[#FFB454] font-bold">★ 4.8</span>
                </div>
                <div className="text-[11px] text-slate-300 font-bold">₹150 • 15m</div>
              </div>
            </div>

            {/* Floating Micro-Card 2: Cold Coffee (Bottom-Left) */}
            <div
              className="hidden sm:flex absolute -bottom-5 -left-4 bg-[#151F32]/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-white/15 items-center gap-2.5 z-20 animate-float-gentle"
              style={{ animationDelay: '1.5s' }}
            >
              <img
                src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=120&q=80"
                alt="Cold Coffee"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left pr-2">
                <div className="text-xs font-black text-white flex items-center gap-1">
                  <span>Cold Coffee ☕</span>
                  <span className="text-[10px] text-[#FFB454] font-bold">★ 4.9</span>
                </div>
                <div className="text-[11px] text-slate-300 font-bold">₹60 • 5m prep</div>
              </div>
            </div>

            {/* Floating Micro-Card 3: Masala Dosa (Bottom-Right) */}
            <div
              className="hidden md:flex absolute -bottom-8 -right-2 bg-[#151F32]/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-white/15 items-center gap-2.5 z-20 animate-float-gentle"
              style={{ animationDelay: '2.5s' }}
            >
              <img
                src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=120&q=80"
                alt="Dosa"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left pr-2">
                <div className="text-xs font-black text-white">Masala Dosa</div>
                <div className="text-[11px] text-slate-300 font-bold">₹80 • Crispy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (Visual 4-Step Animated Flow) */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151F32] text-[#FFB454] text-xs font-bold border border-white/10">
            <Zap className="w-3.5 h-3.5 text-[#FFB454]" />
            <span>Effortless 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How CanteenBites Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            No more pushing through physical crowds or waiting blindly in long canteen queues.
          </p>
        </div>

        {/* 4 Connected Step Cards with Staggered Hover Effect */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#FFB454]/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 text-brand-300 flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 group-hover:text-[#FFB454] transition-all">
              01
            </div>
            <h3 className="font-black text-base text-white">Choose Food</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Browse live menus from SVIET Main Canteen, Food Court & Hostel Canteen with real-time stock.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#FFB454]/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-brand-950/70 border border-brand-500/30 text-brand-300 flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 group-hover:text-[#FFB454] transition-all">
              02
            </div>
            <h3 className="font-black text-base text-white">Place Order</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Add food to cart, select Canteen Pickup or Hostel Room Delivery, and pay with UPI or Cash.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#FFB454]/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-500/30 text-[#FFB454] flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 transition-all">
              03
            </div>
            <h3 className="font-black text-base text-white">Track Preparation</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Watch real-time queue position count down (#7 → #4 → READY) with live estimated preparation times.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-[#FFB454]/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-base mb-4 group-hover:scale-110 transition-all">
              04
            </div>
            <h3 className="font-black text-base text-white">Pickup or Delivery</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pick up at the express counter with zero wait, or have it delivered right to your hostel door!
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. MOST POPULAR BITES (Animated Food Cards with Hover Lift & Stepper) */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 text-rose-300 text-xs font-bold border border-rose-500/30 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span>Campus Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Most Popular Bites
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Handpicked top-rated delicacies ordered hundreds of times daily by SVIET students.
            </p>
          </div>

          <Link
            href="/menu"
            className="text-xs font-bold text-[#FFB454] hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto hover:underline transition-colors"
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
                className="bg-[#151F32] rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#FFB454]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#0B1220]/80 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm border border-white/10">
                        {food.badge}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
                        Veg
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-xl bg-[#0B1220]/80 backdrop-blur-sm text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
                      <Clock className="w-3 h-3 text-[#FFB454]" />
                      <span>~{food.prepTime}m</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-base text-white group-hover:text-[#FFB454] transition-colors">
                        {food.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#FFB454]">
                        <Star className="w-3.5 h-3.5 fill-[#FFB454] text-[#FFB454]" />
                        <span>{food.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-300 font-semibold mt-0.5">{food.canteen}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Price</span>
                    <span className="text-lg font-black text-white">₹{food.price}</span>
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-1.5 bg-[#0B1220] border border-white/15 rounded-xl p-1 shadow-sm animate-scale-in">
                      <button
                        onClick={() => {
                          if (inCart.quantity <= 1) {
                            removeFromCart(food.id);
                          } else {
                            updateCartQuantity(food.id, inCart.quantity - 1);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-[#151F32] border border-white/10 text-white hover:bg-[#1E2B45] flex items-center justify-center font-black text-xs active:scale-90 transition-transform shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-black text-[#FFB454] text-xs">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(food.id, inCart.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-brand-600 text-white hover:bg-brand-500 flex items-center justify-center font-black text-xs active:scale-90 transition-transform shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleQuickAdd(food)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
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
      </ScrollReveal>

      {/* 4. POPULAR CANTEENS SHOWCASE (LIVE QUEUE, TIMINGS, DISTANCE) */}
      <ScrollReveal id="popular-canteens" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-[#FFB454] text-xs font-bold border border-amber-500/30">
            <ChefHat className="w-3.5 h-3.5 text-[#FFB454]" />
            <span>Campus Food Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Popular College Canteens
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Check live queue loads, campus walking distances, and hostel delivery support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canteens.map((canteen) => (
            <div
              key={canteen.id}
              className="bg-[#151F32] rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#FFB454]/40 hover:-translate-y-1.5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={canteen.image}
                    alt={canteen.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-xl bg-[#0B1220]/80 backdrop-blur-sm text-[11px] font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
                    <MapPin className="w-3 h-3 text-[#FFB454]" />
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
                      <h3 className="font-black text-lg text-white group-hover:text-[#FFB454] transition-colors">
                        {canteen.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{canteen.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-xs text-[#FFB454]">
                      <Star className="w-3.5 h-3.5 fill-[#FFB454] text-[#FFB454]" />
                      <span>{canteen.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-300">
                    <div className="p-2.5 rounded-xl bg-[#0B1220] border border-white/10">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Average Prep</div>
                      <div className="font-bold text-white mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FFB454]" />
                        <span>~{canteen.avgPrepTimeMinutes} mins</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/20">
                      <div className="text-[10px] text-brand-300 font-bold uppercase">Live Queue</div>
                      <div className="font-black text-white mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-brand-400" />
                        <span>{canteen.currentQueueCount} orders</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
                    <Bike
                      className={`w-3.5 h-3.5 ${
                        canteen.hostelDeliveryEnabled ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <span className={canteen.hostelDeliveryEnabled ? 'text-emerald-400' : 'text-slate-500'}>
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
                  className="w-full py-2.5 rounded-xl bg-[#0B1220] hover:bg-[#1E2B45] text-white hover:text-[#FFB454] border border-white/10 hover:border-[#FFB454]/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>View Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 5. HOSTEL ROOM DELIVERY SECTION (DEDICATED PREMIUM SHOWCASE) */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#151F32] via-[#1E2B45] to-[#151F32] p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-white/15 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
                <Bike className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hostel Doorstep Service</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Your Food. Your Hostel.{' '}
                <span className="text-[#FFB454]">Your Door.</span>
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
                    <span className="text-xs font-bold text-white block">Select Your Hostel</span>
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
                  className="px-6 py-3.5 rounded-2xl bg-[#FFB454] text-slate-950 font-black text-sm hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Bike className="w-4 h-4 text-slate-950" />
                  <span>Order for Delivery</span>
                </button>
              </div>
            </div>

            {/* Visual Delivery Badge Card */}
            <div className="lg:col-span-5 bg-[#0B1220]/80 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-[#FFB454] uppercase tracking-wider">Hostel Delivery Active</span>
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
      </ScrollReveal>

      {/* 6. BITES AI SHOWCASE (WITH INTERACTIVE PROMPT CHIPS) */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#151F32] border border-purple-500/30 shadow-xl space-y-6 relative overflow-hidden text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xl shadow-sm">
                🤖
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 text-[10px] font-bold border border-purple-500/40 mb-0.5">
                  <Sparkles className="w-3 h-3 text-[#FFB454]" />
                  <span>Powered by Gemini AI</span>
                </div>
                <h3 className="font-black text-xl text-white">Bites AI Assistant</h3>
                <p className="text-xs text-slate-400">&quot;What are you hungry for?&quot;</p>
              </div>
            </div>

            <Link
              href="/bites-ai"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center gap-2 self-start md:self-auto active:scale-95"
            >
              <span>Open AI Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Not sure what to eat between classes? Bites AI knows real-time canteen menus, current queue times, vegetarian options, and student budgets. Click any prompt below to ask:
          </p>

          {/* Interactive AI Prompt Chips with Hover Scale Feedback */}
          <div className="flex flex-wrap gap-2.5">
            {aiPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => router.push(`/bites-ai?prompt=${encodeURIComponent(prompt)}`)}
                className="px-3.5 py-2 rounded-xl bg-[#0B1220] hover:bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-sm transition-all active:scale-95 hover:scale-105 flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 7. OFFERS & COUPONS SHOWCASE */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl bg-[#151F32] border border-white/10 p-6 sm:p-10 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFB454] text-xs font-bold border border-white/10">
                <Tag className="w-3.5 h-3.5 text-[#FFB454]" />
                <span>Save on Campus Food</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
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
                    className="p-4 rounded-2xl bg-[#0B1220] border border-white/15 space-y-1.5 text-left transition-all hover:border-[#FFB454]/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-sm tracking-wider text-[#FFB454]">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                          isCopied
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-white/10 hover:bg-white/20 text-white'
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
                    <p className="text-xs text-slate-300">{coupon.description}</p>
                    <span className="text-[10px] text-slate-500 block">Min order: ₹{coupon.minOrderAmount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 8. CAMPUS PORTALS SELECTOR */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151F32] text-slate-300 text-xs font-bold border border-white/10">
            <Building className="w-3.5 h-3.5 text-[#FFB454]" />
            <span>Campus Roles & Portals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Designed for Every Campus Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Switch your role with one click or sign in to your dedicated college portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Student Portal */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-brand-500/50 hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 text-brand-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-white">Student Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hostellers & Day Scholars can browse live menus, skip physical counter lines, track live kitchen queues, and request room delivery.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-student-hosteller');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 text-brand-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Enter Student App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Canteen Staff Portal */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-amber-500/50 hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-500/30 text-[#FFB454] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-white">Canteen Kitchen</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kitchen display screen for canteen managers to accept orders, manage preparation queues, adjust prep time, and update menu item stock.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-canteen-staff');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 text-[#FFB454] border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Kitchen Screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Delivery Staff Portal */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-white">Hostel Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Delivery partner portal to accept ready orders from canteens, see exact hostel block & room details, and complete deliveries with OTP.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-delivery-staff');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Delivery Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Administrator Portal */}
          <div className="p-6 rounded-3xl bg-[#151F32] border border-white/10 shadow-xl hover:shadow-2xl hover:border-purple-500/50 hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-white">Platform Admin</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus administration led by Yash Vardhan to manage all canteens, monitor daily revenues, verify coupons, and resolve student inquiries.
              </p>
            </div>
            <button
              onClick={() => {
                switchRole('user-admin');
                handleOrderFoodClick();
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <ScrollReveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151F32] text-[#FFB454] text-xs font-bold border border-white/10">
            <HelpCircle className="w-3.5 h-3.5 text-[#FFB454]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Essential information about ordering, payment, kitchen queues, and hostel delivery.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#151F32] border border-white/10 shadow-xl">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB454]" />
              Who can use CanteenBites on campus?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 pl-4 leading-relaxed">
              All SVIET students (both Hostellers and Day Scholars), faculty members, and campus staff can use CanteenBites to browse live menus, track food preparation queues, and order without waiting in physical counter lines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F32] border border-white/10 shadow-xl">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB454]" />
              How does hostel room delivery work?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 pl-4 leading-relaxed">
              Verified Hostellers residing in J-Block, D-Block, or Girls Hostel I-block can select &quot;Hostel Room Delivery&quot; at checkout. Once your food is prepared, a delivery partner brings it to your hostel floor and will call your registered phone number.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F32] border border-white/10 shadow-xl">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB454]" />
              Can Day Scholars request hostel room delivery?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 pl-4 leading-relaxed">
              No, room delivery is strictly reserved for verified hostellers with assigned hostel rooms. Day Scholars can choose &quot;Canteen Pickup&quot; to collect their freshly prepared meal directly from the express counter.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F32] border border-white/10 shadow-xl">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB454]" />
              What payment options are supported?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 pl-4 leading-relaxed">
              We support fast online payments via Paytm UPI, Google Pay, PhonePe, and BHIM UPI with instant transaction status, as well as Cash on Counter when collecting your food.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F32] border border-white/10 shadow-xl">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB454]" />
              What happens if a canteen cannot fulfill hostel room delivery?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 pl-4 leading-relaxed">
              If canteen staff reject the room delivery portion due to high kitchen rush or bad weather, the order automatically switches to express counter pickup, and the ₹15 delivery fee is immediately refunded to your account.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
