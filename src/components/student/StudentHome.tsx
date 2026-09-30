'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { FOOD_CATEGORIES, INITIAL_COUPONS } from '@/lib/constants';
import { Canteen, FoodCategory, MenuItem } from '@/types';
import {
  Clock,
  Star,
  Users,
  Bike,
  Plus,
  Minus,
  Check,
  ArrowRight,
  Sparkles,
  Search,
  Tag,
  Flame,
  CheckCircle,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { ItemInstructionModal } from './ItemInstructionModal';

export const StudentHome: React.FC = () => {
  const {
    user,
    canteens,
    selectedCanteen,
    setSelectedCanteen,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    setActiveNavTab,
    orders,
    setActiveOrder,
    showToast,
  } = useApp();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Fetch Menu for selected canteen
  useEffect(() => {
    if (!selectedCanteen) return;
    setIsLoadingMenu(true);
    fetch(`/api/menu?canteenId=${selectedCanteen.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items) {
          setMenuItems(data.items);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingMenu(false));
  }, [selectedCanteen]);

  // Find active in-progress order for live tracker banner
  const activeOrder = orders.find((o) =>
    ['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status)
  );

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const featuredItems = menuItems.filter((item) => item.isFeatured);
  const popularItems = menuItems.filter((item) => item.isPopular);

  const handleAddItem = (item: MenuItem) => {
    if (!item.isAvailable) {
      showToast('Item Unavailable', 'This food item is currently out of stock.', 'warning');
      return;
    }
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmAdd = (item: MenuItem, instruction: string) => {
    addToCart(item, instruction);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Student Greeting & College Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-violet-800 p-5 sm:p-7 text-white shadow-xl shadow-brand-900/10 relative overflow-hidden transition-all">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse-subtle" />
        <div className="relative z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-2 border border-white/10 animate-slide-down">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{user?.collegeName || 'Swami Vivekanand Institute of Engineering & Technology'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight animate-slide-up">
            Craving something good, {user?.name ? user.name.split(' ')[0] : 'Student'}? 🍔
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-md leading-relaxed animate-fade-in">
            Skip the physical crowd. Pick from college canteens and track live preparation in real time!
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <button
              onClick={() => setActiveNavTab('search')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-700 hover:bg-slate-50 text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 animate-scale-in"
            >
              <Search className="w-3.5 h-3.5 text-brand-600" />
              <span>Search Food or Canteen</span>
            </button>
            <div className="px-3 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-[11px] font-bold text-white border border-white/20">
              {user?.studentType === 'HOSTELLER'
                ? `Hosteller • ${user.hostelDetails?.roomNumber || 'Room'}`
                : 'Day Scholar • Pickup'}
            </div>
          </div>
        </div>
      </div>

      {/* Active Order Quick Live Tracker Card */}
      {activeOrder && (
        <div
          onClick={() => {
            setActiveOrder(activeOrder);
            setActiveNavTab('orders');
          }}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/90 to-amber-50 border border-amber-200 shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex items-center justify-between gap-3 animate-slide-up group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                🍳
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-amber-900">
                  Live Order: {activeOrder.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  {activeOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 font-medium">
                {activeOrder.queuePosition > 0
                  ? `Queue Position #${activeOrder.queuePosition} • Ready approx ${new Date(
                      activeOrder.estimatedReadyTime
                    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Ready for Collection / Dispatch'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 flex-shrink-0 group-hover:text-amber-950 transition-colors">
            <span>Track</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>
        </div>
      )}

      {/* Available Canteens Selector */}
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-slate-900 tracking-tight">College Canteens</h3>
          <span className="text-xs text-slate-500">{canteens.length} Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {canteens.map((canteen) => {
            const isSelected = selectedCanteen?.id === canteen.id;
            return (
              <div
                key={canteen.id}
                onClick={() => setSelectedCanteen(canteen)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden flex flex-col justify-between card-interactive ${
                  isSelected
                    ? 'border-brand-600 bg-white ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-brand-200 hover:shadow-card-hover'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{canteen.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{canteen.tagline}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        canteen.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : canteen.status === 'BUSY'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {canteen.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{canteen.rating}</span>
                      <span className="text-[10px] text-slate-400">({canteen.totalReviews})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>~{canteen.avgPrepTimeMinutes}m prep</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{canteen.currentQueueCount} in queue</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      canteen.hostelDeliveryEnabled ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    {canteen.hostelDeliveryEnabled ? 'Hostel Delivery ON' : 'Pickup Only'}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {canteen.openTime} - {canteen.closeTime}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offers & Coupons Carousel */}
      <div className="space-y-2.5 text-left">
        <div className="flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-brand-600" />
          <h3 className="font-black text-sm text-slate-900 tracking-tight">Active Student Offers</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {INITIAL_COUPONS.map((coupon) => {
            const isCopied = copiedCoupon === coupon.code;
            return (
              <div
                key={coupon.code}
                className="flex-shrink-0 w-64 p-3 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 border border-indigo-100 text-left shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between"
              >
                <div>
                  <span className="font-black text-xs text-brand-700 tracking-wider">
                    {coupon.code}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{coupon.description}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Min order: ₹{coupon.minOrderAmount}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    setCopiedCoupon(coupon.code);
                    showToast('Coupon Copied', `${coupon.code} copied! Apply it at checkout.`, 'info');
                    setTimeout(() => setCopiedCoupon(null), 2000);
                  }}
                  className={`p-1.5 rounded-xl transition-all active:scale-90 flex items-center gap-1 text-[11px] font-bold ${
                    isCopied
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-white shadow-2xs text-brand-600 hover:bg-brand-50 border border-slate-200/60'
                  }`}
                  title="Copy code"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Copied</span>
                    </>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Food Categories Horizontal Chips */}
      <div className="space-y-3 text-left">
        <h3 className="font-black text-base text-slate-900 tracking-tight">Explore Menu</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'ALL'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-brand-50/50 hover:text-brand-600 hover:border-brand-200'
            }`}
          >
            <span>🍽️</span>
            <span>All Items</span>
          </button>
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-brand-50/50 hover:text-brand-600 hover:border-brand-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-800">
            {selectedCategory === 'ALL'
              ? `${selectedCanteen?.name || 'Canteen'} Menu`
              : FOOD_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </h4>
          <span className="text-xs text-slate-400 font-medium">{filteredItems.length} items</span>
        </div>

        {isLoadingMenu ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex gap-3 animate-pulse"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl skeleton-shimmer flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
                    <div className="h-3 w-full rounded-md skeleton-shimmer" />
                    <div className="h-3 w-1/2 rounded-md skeleton-shimmer" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-12 rounded-md skeleton-shimmer" />
                    <div className="h-7 w-16 rounded-xl skeleton-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-14 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <span className="text-3xl block">🍲</span>
            <p className="font-bold text-slate-700">No items found in this category.</p>
            <p className="text-slate-400">Try selecting another category or exploring other canteens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const cartItem = cart.find((c) => c.menuItem.id === item.id);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 flex gap-3 text-left relative overflow-hidden group card-interactive ${
                    !item.isAvailable ? 'opacity-70 bg-slate-50' : ''
                  }`}
                >
                  {/* Left Food Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
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
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] font-black uppercase text-rose-200 leading-tight">
                          Currently Unavailable
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-black text-slate-900 text-base">₹{item.price}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>⏱️ {item.prepTimeMinutes}m</span>
                          {item.rating && <span>⭐ {item.rating}</span>}
                        </div>
                      </div>

                      {cartItem ? (
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-brand-50 border border-brand-200 animate-scale-in">
                          <button
                            onClick={() => {
                              if (cartItem.quantity <= 1) {
                                removeFromCart(item.id);
                                showToast('Removed', `${item.name} removed from cart`, 'info');
                              } else {
                                updateCartQuantity(item.id, cartItem.quantity - 1);
                              }
                            }}
                            className="w-6 h-6 rounded-lg bg-white text-brand-700 hover:bg-brand-600 hover:text-white flex items-center justify-center transition-colors shadow-2xs text-xs font-bold active:scale-90"
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            key={cartItem.quantity}
                            className="w-5 text-center font-black text-xs text-brand-700 animate-scale-in"
                          >
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, cartItem.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center transition-colors shadow-2xs text-xs font-bold active:scale-90"
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddItem(item)}
                          disabled={!item.isAvailable}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs ${
                            item.isAvailable
                              ? 'bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white border border-brand-200/90 hover:shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
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
      </div>

      {/* Special Instruction Modal */}
      <ItemInstructionModal
        item={modalItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
        onConfirm={handleConfirmAdd}
      />
    </div>
  );
};
