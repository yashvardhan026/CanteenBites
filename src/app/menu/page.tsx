'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MenuItem, FoodCategory } from '@/types';
import { FOOD_CATEGORIES } from '@/lib/constants';
import {
  Search,
  Filter,
  Star,
  Clock,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Utensils,
  Check,
} from 'lucide-react';
import { Footer } from '@/components/common/Footer';

export default function MenuPage() {
  const {
    canteens,
    selectedCanteen,
    setSelectedCanteen,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    setActiveNavTab,
    showToast,
  } = useApp();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(300);

  useEffect(() => {
    setLoading(true);
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items) {
          setMenuItems(data.items);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (item.price > maxPrice) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCanteen = item.canteenName?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCanteen) return false;
    }
    return true;
  });

  const handleAddFood = (item: MenuItem) => {
    addToCart(item);
    showToast('Added to Cart', `${item.name} added!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
              <Utensils className="w-3.5 h-3.5 text-brand-600" />
              <span>Campus Culinary Delights</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Explore Canteen Menus
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Browse freshly cooked meals, quick snacks, hot beverages, and desserts available across campus canteens today.
            </p>
          </div>

          <Link
            href="/"
            onClick={() => setActiveNavTab('cart')}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-md hover:bg-brand-700 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <span>View Active Cart</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food by name, e.g. Paneer roll, Dosa, Burger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${
                  vegOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Veg Only</span>
                {vegOnly && <Check className="w-3 h-3 text-emerald-600" />}
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>Max: ₹{maxPrice}</span>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-brand-600"
                />
              </div>
            </div>
          </div>

          {/* Quick suggestions chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs text-slate-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Popular:</span>
            {['Paneer Roll', 'Cold Coffee', 'Veg Burger', 'Masala Dosa', 'Brownie'].map((quickTerm) => (
              <button
                key={quickTerm}
                onClick={() => setSearchQuery(quickTerm)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex-shrink-0 active:scale-95 ${
                  searchQuery.toLowerCase() === quickTerm.toLowerCase()
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {quickTerm}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 text-[11px] text-rose-600 font-bold hover:underline flex-shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {FOOD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden p-0 flex flex-col justify-between"
              >
                <div className="h-44 w-full skeleton-shimmer" />
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 rounded-lg skeleton-shimmer" />
                    <div className="h-4 w-10 rounded-lg skeleton-shimmer" />
                  </div>
                  <div className="h-3 w-20 rounded-md skeleton-shimmer" />
                  <div className="h-8 w-full rounded-md skeleton-shimmer" />
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-between items-center">
                  <div className="h-5 w-16 rounded-md skeleton-shimmer" />
                  <div className="h-8 w-20 rounded-xl skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 animate-scale-in">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto animate-float-gentle" />
            <h3 className="font-bold text-slate-800 text-sm">No items found matching your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms, resetting category selection or increasing the maximum price filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setVegOnly(false);
                setMaxPrice(300);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredItems.map((item) => {
              const inCart = cart.find((c) => c.menuItem.id === item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                            item.isVeg ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                        {!item.isAvailable && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-xl bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>~{item.prepTimeMinutes}m</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-brand-600 font-semibold mt-0.5">
                        {item.canteenName || 'Campus Canteen'}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.description || 'Deliciously prepared using fresh campus kitchen ingredients.'}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Price</span>
                      <span className="text-lg font-black text-slate-900">₹{item.price}</span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-xl p-1 shadow-2xs animate-scale-in">
                        <button
                          onClick={() => {
                            if (inCart.quantity <= 1) {
                              removeFromCart(item.id);
                            } else {
                              updateCartQuantity(item.id, inCart.quantity - 1);
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
                          onClick={() => updateCartQuantity(item.id, inCart.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center font-black text-xs active:scale-90 transition-transform shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!item.isAvailable}
                        onClick={() => handleAddFood(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95 ${
                          item.isAvailable
                            ? 'bg-brand-600 hover:bg-brand-700 text-white'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{item.isAvailable ? 'Add' : 'Sold Out'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
