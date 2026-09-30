import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Heart,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-left pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Campus Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline inverted />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mt-2">
              CanteenBites is the official next-generation smart canteen food ordering platform for Swami Vivekanand Institute of Engineering & Technology. Skip physical lines, track live kitchen prep queues, and get food delivered straight to your hostel room.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>Central Campus Food Court, Swami Vivekanand Institute of Engineering & Technology</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>Service Hours: 7:30 AM – 10:30 PM (All 7 Days)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>PCI-DSS & Campus Certified Secure Payment Processing</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  About CanteenBites
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/canteens" className="hover:text-brand-400 transition-colors">
                  Campus Canteens
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-brand-400 transition-colors">
                  Explore Menu
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-brand-400 transition-colors">
                  Coupons & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Campus Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-brand-400 transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-400 transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link href="/bites-ai" className="hover:text-brand-400 transition-colors flex items-center gap-1.5 text-brand-400 font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Bites AI Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Canteen Staff Access
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Hostel Delivery Partner
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Admin Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Help & Contact Us
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Hostel Delivery Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Refund & Cancellation</span>
              </li>
              <li>
                <span className="text-slate-400">Platform Terms & Conditions</span>
              </li>
              <li>
                <span className="text-slate-400">Campus Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} CanteenBites. All rights reserved.</span>
            <span>•</span>
            <span className="text-slate-400 font-medium">Order. Track. Enjoy.</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for college campus food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
