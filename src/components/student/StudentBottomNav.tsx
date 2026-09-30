'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Home, Search, ShoppingBag, Package, User } from 'lucide-react';

interface NavItem {
  id: 'home' | 'search' | 'cart' | 'orders' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  pulse?: boolean;
}

export const StudentBottomNav: React.FC = () => {
  const { activeNavTab, setActiveNavTab, cart, orders } = useApp();

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 shadow-lg sm:max-w-md sm:mx-auto sm:rounded-t-2xl sm:bottom-0 transition-all">
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
                  ? 'text-brand-600 bg-brand-50/80 font-black shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
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
                    className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-black text-white shadow-sm ring-1 ring-white animate-badge-bounce"
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
                  isActive ? 'text-brand-600' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
