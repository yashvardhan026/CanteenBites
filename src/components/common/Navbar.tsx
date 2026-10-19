'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Logo } from './Logo';
import {
  Bell,
  ShoppingBag,
  UserCheck,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  LogOut,
  Sliders,
  CheckCircle2,
  Menu as MenuIcon,
  X,
  Bot,
  Compass,
} from 'lucide-react';
import { RoleSwitcherModal } from './RoleSwitcherModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    user,
    cart,
    notifications,
    unreadNotifsCount,
    markNotificationRead,
    setActiveNavTab,
    canteens,
    selectedCanteen,
  } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case 'STUDENT':
        return {
          label: user.studentType === 'HOSTELLER' ? 'Hosteller' : 'Day Scholar',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'CANTEEN_STAFF':
        return { label: 'Canteen Staff', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'DELIVERY_STAFF':
        return { label: 'Delivery Staff', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'ADMIN':
        return { label: 'Campus Admin', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  const badge = getRoleBadge();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Canteens', href: '/canteens' },
    { label: 'Menu', href: '/menu' },
    { label: 'Offers', href: '/offers' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B1220]/95 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/30'
            : 'bg-[#0B1220]/80 backdrop-blur-sm border-b border-white/5'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}
        >
          {/* Logo & Campus Pill */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-left flex items-center">
              <Logo size="sm" showTagline={false} inverted={true} />
            </Link>
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151F32]/80 border border-white/10 text-slate-300 text-xs font-medium hover:bg-[#1E2B45] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#FFB454]" />
              <span>Swami Vivekanand Institute of Engg. & Tech</span>
            </div>
          </div>

          {/* Desktop Navigation Links with Animated Underline */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative group px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-[#FFB454] font-black'
                      : 'text-[#A8B3C7] hover:text-white'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-2 right-2 h-0.5 bg-[#FFB454] rounded-full transition-all duration-300 ${
                      isActive ? 'w-[calc(100%-16px)]' : 'w-0 group-hover:w-[calc(100%-16px)]'
                    }`}
                  />
                </Link>
              );
            })}

            <Link
              href="/bites-ai"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 transition-all duration-200 flex items-center gap-1.5 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-xs active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400 animate-pulse-subtle" />
              <span>Bites AI 🤖</span>
            </Link>
          </nav>

          {/* Quick Info & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 bg-[#151F32] hover:bg-[#1E2B45] hover:border-[#FFB454]/40 transition-all shadow-sm group active:scale-95"
              title="Switch user role or test other accounts"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {user?.name || 'Guest User'}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${badge?.bg || 'bg-slate-800 text-slate-300 border-slate-700'}`}
                  >
                    {badge?.label}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:translate-y-0.5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#151F32] transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFB454] text-[10px] font-black text-[#0B1220] shadow-sm ring-2 ring-[#0B1220]">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#151F32] p-4 shadow-2xl ring-1 ring-white/10 z-50 border border-white/10 animate-scale-in duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#FFB454]" />
                      <span className="font-bold text-sm text-white">Notifications</span>
                    </div>
                    <span className="text-xs text-[#A8B3C7] font-medium">
                      {notifications.length} recent
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5 mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-[#A8B3C7] text-xs">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`py-3 px-2 rounded-xl cursor-pointer transition-colors ${
                            notif.isRead ? 'opacity-65 hover:bg-white/5' : 'bg-brand-500/10 hover:bg-brand-500/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-white leading-snug">
                              {notif.title}
                            </span>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#FFB454] flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button with Animated Bounce Badge */}
            {(user?.role === 'STUDENT' || cartItemsCount > 0) && (
              <button
                onClick={() => {
                  if (user?.role === 'STUDENT') {
                    setActiveNavTab('cart');
                  } else {
                    window.location.href = '/menu';
                  }
                }}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 hover:shadow-brand-600/50 transition-all active:scale-95"
                title="View your plate/cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span
                    key={cartItemsCount}
                    className="px-1.5 py-0.5 rounded-full bg-[#FFB454] text-[#0B1220] text-[11px] font-black animate-badge-bounce"
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-[#151F32]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Blurred Navy Backdrop */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0B1220]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 animate-scale-in">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    pathname === link.href
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-[#151F32] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/bites-ai"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-950/70 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Ask Bites AI Assistant 🤖</span>
            </Link>
          </div>
        )}
      </header>

      {/* Role Switcher & Registration Modal */}
      <RoleSwitcherModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
    </>
  );
};
