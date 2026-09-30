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
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm'
            : 'bg-white/90 backdrop-blur-xs border-b border-slate-200/60'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}
        >
          {/* Logo & Campus Pill */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-left hover:opacity-90 transition-opacity flex items-center">
              <Logo size="sm" showTagline={false} />
            </Link>
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/50 text-slate-600 text-xs font-medium hover:bg-slate-100 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Swami Vivekanand Institute of Engg. & Tech</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50/80 font-black shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-brand-600 rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/bites-ai"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50/90 hover:bg-purple-100 transition-all duration-200 flex items-center gap-1.5 border border-purple-200/80 hover:shadow-2xs active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-purple-600 animate-pulse-subtle" />
              <span>Bites AI 🤖</span>
            </Link>
          </nav>

          {/* Quick Info & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors shadow-2xs group"
              title="Switch user role or test other accounts"
            >
              <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Guest User'}
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${badge?.bg || ''}`}
                  >
                    {badge?.label}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white shadow-2xs ring-2 ring-white">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-600" />
                      <span className="font-bold text-sm text-slate-800">Notifications</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {notifications.length} recent
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`py-3 px-2 rounded-xl cursor-pointer transition-colors ${
                            notif.isRead ? 'opacity-70 hover:bg-slate-50' : 'bg-brand-50/40 hover:bg-brand-50/70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-800 leading-snug">
                              {notif.title}
                            </span>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
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

            {/* Cart Button */}
            {(user?.role === 'STUDENT' || cartItemsCount > 0) && (
              <button
                onClick={() => {
                  if (user?.role === 'STUDENT') {
                    setActiveNavTab('cart');
                  } else {
                    window.location.href = '/menu';
                  }
                }}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/25 transition-all active:scale-95"
                title="View your plate/cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span
                    key={cartItemsCount}
                    className="px-1.5 py-0.5 rounded-full bg-white text-brand-600 text-[11px] font-black animate-badge-bounce"
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
                    pathname === link.href
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/bites-ai"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-600" />
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
