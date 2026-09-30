'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MenuItem } from '@/types';
import { Search, Filter, Clock, Plus, Minus, Flame, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ItemInstructionModal } from './ItemInstructionModal';

export const StudentSearch: React.FC = () => {
  const { canteens, cart, addToCart, updateCartQuantity, removeFromCart, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [selectedCanteenId, setSelectedCanteenId] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const popularSuggestions = [
    'Paneer Roll',
    'Cold Coffee',
    'Veg Burger',
    'Aloo Paratha',
    'Hakka Noodles',
    'Masala Dosa',
  ];

  useEffect(() => {
    setLoading(true);
    let url = `/api/menu?`;
    if (selectedCanteenId !== 'ALL') url += `canteenId=${selectedCanteenId}&`;
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items) {
          let list: MenuItem[] = data.items;
          if (isVegOnly) {
            list = list.filter((i) => i.isVeg);
          }
          list = list.filter((i) => i.price <= maxPrice);
          setSearchResults(list);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchTerm, selectedCanteenId, isVegOnly, maxPrice]);

  const handleAddItem = (item: MenuItem) => {
    if (!item.isAvailable) {
      showToast('Item Unavailable', 'This food item is currently out of stock.', 'warning');
      return;
    }
    setModalItem(item);
    setIsModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setIsVegOnly(false);
    setSelectedCanteenId('ALL');
    setMaxPrice(300);
  };

  return (
    <div className="space-y-5 pb-24 text-left animate-fade-in">
      {/* Search Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Search Food & Canteens</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Find your favorite roll, burger, dosa, coffee or meal counter across campus
        </p>
      </div>

      {/* Input bar with focus animation */}
      <div className="relative group">
        <Search
          className={`absolute left-4 top-3.5 w-4 h-4 transition-colors duration-200 ${
            isSearchFocused ? 'text-brand-600' : 'text-slate-400'
          }`}
        />
        <input
          type="text"
          placeholder="Search burger, chai, paneer, pizza, noodles..."
          value={searchTerm}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:shadow-glow-sm shadow-xs transition-all duration-200"
        />
      </div>

      {/* Quick Search Suggestions */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-brand-500" />
          Popular:
        </span>
        {popularSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setSearchTerm(suggestion)}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 transition-all text-[11px] font-medium whitespace-nowrap shadow-2xs active:scale-95 flex-shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Filter controls panel */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Veg Only toggle */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isVegOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="veg-indicator"></span>
              <span>Veg Only</span>
            </button>

            {/* Canteen Selector */}
            <select
              value={selectedCanteenId}
              onChange={(e) => setSelectedCanteenId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 hover:border-slate-300 transition-colors"
            >
              <option value="ALL">All Canteens</option>
              {canteens.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
          </span>
        </div>

        {/* Max Price Slider */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
            Max Price: <strong className="text-slate-900 font-black">₹{maxPrice}</strong>
          </span>
          <input
            type="range"
            min={40}
            max={350}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 transition-all"
          />
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-card flex gap-3 animate-pulse">
              <div className="w-24 h-24 rounded-xl skeleton-shimmer flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
                  <div className="h-3 w-1/2 rounded-md skeleton-shimmer" />
                  <div className="h-3 w-full rounded-md skeleton-shimmer" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 w-12 rounded-md skeleton-shimmer" />
                  <div className="h-6 w-14 rounded-lg skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto text-2xl shadow-inner">
            🔍
          </div>
          <h4 className="font-extrabold text-base text-slate-800">Nothing tasty found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn&apos;t find any items matching your filters. Try adjusting price or clearing the search terms.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {searchResults.map((item) => {
            const cartItem = cart.find((c) => c.menuItem.id === item.id);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl bg-white border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-200 flex gap-3 text-left relative overflow-hidden group card-interactive ${
                  !item.isAvailable ? 'opacity-70 bg-slate-50' : ''
                }`}
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
                  </div>
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                      <span className="text-[9px] font-black uppercase text-rose-200">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-brand-600 block mt-0.5">
                      {item.canteenName || 'Campus Canteen'}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <span className="font-black text-slate-900 text-sm">₹{item.price}</span>

                    {cartItem ? (
                      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-brand-50 border border-brand-200 animate-scale-in">
                        <button
                          onClick={() => {
                            if (cartItem.quantity <= 1) {
                              removeFromCart(item.id);
                              showToast('Removed', `${item.name} removed`, 'info');
                            } else {
                              updateCartQuantity(item.id, cartItem.quantity - 1);
                            }
                          }}
                          className="w-5 h-5 rounded-md bg-white text-brand-700 hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors text-xs font-bold active:scale-90"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          key={cartItem.quantity}
                          className="w-4 text-center font-black text-xs text-brand-700 animate-scale-in"
                        >
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                          className="w-5 h-5 rounded-md bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center transition-colors text-xs font-bold active:scale-90"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddItem(item)}
                        disabled={!item.isAvailable}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition-all active:scale-95 shadow-2xs ${
                          item.isAvailable
                            ? 'bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white border border-brand-200'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Special Instruction Modal */}
      <ItemInstructionModal
        item={modalItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
        onConfirm={(item, instruction) => addToCart(item, instruction)}
      />
    </div>
  );
};
