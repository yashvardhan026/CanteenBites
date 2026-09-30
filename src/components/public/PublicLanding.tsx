'use client';

import React from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { INITIAL_COUPONS } from '@/lib/constants';

interface PublicLandingProps {
  onEnterApp?: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onEnterApp }) => {
  const { canteens, setSelectedCanteen, setActiveNavTab, addToCart, showToast } = useApp();

  const handleOrderFoodClick = () => {
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
    handleOrderFoodClick();
  };

  return (
    <div className="space-y-16 pb-12 text-left">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-14 sm:pt-10 sm:pb-20 bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-transparent rounded-3xl border border-indigo-100/50 shadow-sm mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Official Smart Food Platform for Swami Vivekanand Institute of Engineering & Technology</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
            Your College Food, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Just a Click Away.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Order from your college canteen, skip the queue and track your food in real time.
            Experience live kitchen queue positions, transparent pricing, and room delivery for hostellers!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleOrderFoodClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Order Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleExploreCanteens}
              className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm sm:text-base shadow-sm hover:border-slate-400 transition-all flex items-center gap-2"
            >
              <ChefHat className="w-4 h-4 text-brand-600" />
              <span>Explore Canteens</span>
            </button>

            <Link
              href="/bites-ai"
              className="px-5 py-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span>Ask Bites AI 🤖</span>
            </Link>
          </div>

          {/* Live Trust Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-200/60">
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-slate-900">3 Canteens</div>
              <div className="text-xs text-slate-500 font-medium">Main, Hostel & Food Court</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-emerald-600">~12 min</div>
              <div className="text-xs text-slate-500 font-medium">Average Prep Time</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-brand-600">Zero Queue</div>
              <div className="text-xs text-slate-500 font-medium">Live Queue Tracking</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-black text-indigo-600">Hostel Delivery</div>
              <div className="text-xs text-slate-500 font-medium">Door-to-Door Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="font-black text-base text-slate-900">Browse</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Choose your college canteen and browse real-time menus with live item stock and pricing.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-black text-base text-slate-900">Order</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Add food to cart, customize instructions, choose Canteen Pickup or Hostel Room Delivery, and pay securely.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-black text-base text-slate-900">Track</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Watch real-time queue position count down (#7 → #4 → READY) with live estimated preparation times.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              4
            </div>
            <h3 className="font-black text-base text-slate-900">Enjoy</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Pick up your fresh piping-hot food at the counter or receive it right in your hostel room if delivery was accepted!
            </p>
          </div>
        </div>
      </section>

      {/* Popular Campus Foods */}
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

          <button
            onClick={handleOrderFoodClick}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
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
                  <span className="text-[10px] text-slate-400 font-semibold block">Price</span>
                  <span className="text-lg font-black text-slate-900">₹{food.price}</span>
                </div>

                <button
                  onClick={() => handleQuickAdd(food)}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>+ Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Canteens Showcase */}
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
            Check live queue loads, open timings, and hostel delivery support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canteens.map((canteen) => (
            <div
              key={canteen.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={canteen.image}
                    alt={canteen.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                        canteen.status === 'OPEN'
                          ? 'bg-emerald-500 text-white'
                          : canteen.status === 'BUSY'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {canteen.status}
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
                      <div className="text-[10px] text-slate-400 font-semibold">Average Prep</div>
                      <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>~{canteen.avgPrepTimeMinutes} mins</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-semibold">Current Queue</div>
                      <div className="font-bold text-indigo-700 mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-indigo-500" />
                        <span>{canteen.currentQueueCount} orders</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
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
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Built Specifically For College Campuses</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Features Designed for Campus Life
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tailored specifically for college breaks, hostel schedules, and canteen kitchen workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900">Live Kitchen Queue Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Know your exact place in queue in real-time (#3 in line, 2 ahead of you) and smart estimated ready times so you arrive exactly when it is hot.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900">Hostel Room Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Studying late night for exams? Hostellers can request food delivery directly to their hostel block, floor, and room number with canteen confirmation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900">Bites AI Food Assistant 🤖</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask &quot;What can I get under ₹100 that is ready fast?&quot; or &quot;Where is my order?&quot;. Bites AI queries the live database and adds items to cart safely!
            </p>
          </div>
        </div>
      </section>

      {/* Offers & Coupons Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Save on Campus Food</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Exclusive Student Promo Codes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Use verified coupon codes at checkout for instant discounts on all canteens!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {INITIAL_COUPONS.slice(0, 2).map((coupon) => (
                <div
                  key={coupon.code}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-sm tracking-wider text-amber-300">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        showToast('Copied!', `Coupon code ${coupon.code} copied to clipboard`, 'success');
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-slate-200">{coupon.description}</p>
                  <span className="text-[10px] text-slate-400 block">Min order: ₹{coupon.minOrderAmount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
            Real feedback from day scholars, hostellers, and canteen kitchen staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
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

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
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
              <span className="text-slate-400">ECE, 2nd Year • Day Scholar</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
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
