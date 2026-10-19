'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Home, Search, ShoppingBag, Package, User, ArrowRight } from 'lucide-react';

interface NavItem {
  id: 'home' | 'search' | 'cart' | 'orders' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  pulse?: boolean;
}

export const StudentBottomNav: React.FC = () => {
  const { activeNavTab, setActiveNavTab, cart, orders, selectedCanteen } = useApp();

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);

  const hasActiveOrder = orders.some((o) =>
    ['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status)
  );

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'orders', label: 'Orders', icon: Package, pulse: hasActiveOrder },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Floating Quick-Cart Bar (Mobile & Tablet) */}
      {cartCount > 0 && activeNavTab !== 'cart' && (
        <div className="fixed bottom-16 sm:bottom-[4.5rem] left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-40 animate-slide-up pointer-events-auto">
          <div
            onClick={() => setActiveNavTab('cart')}
            className="p-3 px-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl shadow-indigo-950/40 border border-slate-700/80 flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-400 font-extrabold">₹{cartTotal}</span>
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-1">
                  {selectedCanteen?.name || 'Campus Canteen'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 group-hover:bg-brand-500 font-extrabold text-xs text-white shadow-sm transition-colors flex-shrink-0">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#151F32]/95 backdrop-blur-xl border-t border-white/10 px-3 py-1.5 shadow-2xl sm:max-w-md sm:mx-auto sm:rounded-t-2xl sm:bottom-0 transition-all">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNavTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3.5 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#FFB454] bg-[#0B1220] font-black shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    key={item.badge}
                    className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FFB454] px-1 text-[9px] font-black text-[#0B1220] shadow-sm ring-1 ring-[#0B1220] animate-badge-bounce"
                  >
                    {item.badge}
                  </span>
                )}
                {item.pulse && (
                  <span className="absolute -top-0.5 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-[#FFB454]' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
    </>
  );
};
