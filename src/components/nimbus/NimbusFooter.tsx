'use client';

import React from 'react';
import Link from 'next/link';
import { Cloud, Github, Twitter, Disc as Discord, Shield, ExternalLink } from 'lucide-react';

export const NimbusFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#03040a] relative z-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
              aria-label="Nimbus AI Home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-[#05060f] rounded-[11px] flex items-center justify-center">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Nimbus AI
              </span>
            </Link>

            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              The developer-first API that reads, summarises, and answers complex questions about PDFs, scans, and technical documents with exact citations.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-mono text-emerald-400 font-semibold">All systems operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Product
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#developers" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Developers Links */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Developers
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#developers" className="hover:text-white transition-colors">
                  Python SDK
                </a>
              </li>
              <li>
                <a href="#developers" className="hover:text-white transition-colors">
                  TypeScript / Node
                </a>
              </li>
              <li>
                <a href="#developers" className="hover:text-white transition-colors">
                  cURL Examples
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Rate Limits & SLAs
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Company
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#use-cases" className="hover:text-white transition-colors">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Security & SOC-2
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500">
            © 2026 Nimbus AI, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
              aria-label="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
