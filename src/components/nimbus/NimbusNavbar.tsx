'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cloud, Sparkles, Menu, X, ArrowRight, Github } from 'lucide-react';

export const NimbusNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05060f]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/50 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label="Nimbus AI Home"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              <div className="w-full h-full bg-[#05060f] rounded-[11px] flex items-center justify-center">
                <Cloud className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Nimbus
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#demo"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-1.5 py-0.5"
            >
              Demo
            </a>
            <a
              href="#capabilities"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-1.5 py-0.5"
            >
              Capabilities
            </a>
            <a
              href="#developers"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-1.5 py-0.5"
            >
              Docs
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-1.5 py-0.5"
            >
              Pricing
            </a>
            <a
              href="#use-cases"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-1.5 py-0.5"
            >
              Blog
            </a>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#developers"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-white/[0.04]"
            >
              <Github className="w-4 h-4" />
              <span>v1.4.0</span>
            </a>
            <a
              href="#pricing"
              className="relative inline-flex items-center justify-center p-[1px] rounded-xl font-semibold text-xs text-white overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl transition-all duration-300 group-hover:opacity-100 opacity-90 blur-[1px]"></span>
              <span className="relative px-4 py-2 rounded-[11px] bg-[#05060f] transition-all duration-200 group-hover:bg-[#05060f]/80 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Get API key</span>
              </span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#05060f]/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              Demo
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#developers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              Blog
            </a>
          </nav>
          <div className="pt-2 border-t border-white/[0.06]">
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get API key</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
