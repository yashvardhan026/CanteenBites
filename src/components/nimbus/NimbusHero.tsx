'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, BookOpen, Terminal, CheckCircle2 } from 'lucide-react';

export const NimbusHero: React.FC = () => {
  // Cursor spotlight tracking state
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#05060f]"
      aria-labelledby="hero-heading"
    >
      {/* Pure CSS Animated Aurora Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Blob 1: Deep Violet glow */}
        <div className="absolute -top-[15%] left-[20%] w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full bg-violet-600/20 blur-[130px] animate-aurora-blob-1" />
        
        {/* Blob 2: Vibrant Cyan glow */}
        <div className="absolute top-[25%] -right-[10%] w-[450px] h-[450px] sm:w-[620px] sm:h-[620px] rounded-full bg-cyan-500/15 blur-[140px] animate-aurora-blob-2" />
        
        {/* Blob 3: Soft Indigo depth */}
        <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full bg-indigo-600/15 blur-[120px] animate-aurora-blob-3" />

        {/* Ambient subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      {/* Interactive Cursor Spotlight Glow */}
      {mousePosition && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.06), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Beta Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-lg shadow-violet-950/30 hover:border-violet-500/50 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span>Now in public beta</span>
          <span className="text-violet-400/60">•</span>
          <span className="text-cyan-300 font-mono text-[11px]">v1.4 API</span>
        </div>

        {/* Main Headline (Exactly one h1 on page) */}
        <h1
          id="hero-heading"
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] text-balance"
        >
          Turn complex documents into{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
            instant intelligence.
          </span>
        </h1>

        {/* Supporting Sentence */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed text-balance">
          Summarise 1,000-page PDFs, extract key contract clauses, and query enterprise documents with a single API call. Grounded with exact coordinate citations and zero hallucinations.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA */}
          <a
            href="#pricing"
            className="w-full sm:w-auto relative group inline-flex items-center justify-center p-[1px] rounded-2xl font-bold text-sm text-white overflow-hidden shadow-2xl shadow-violet-600/30 hover:shadow-cyan-500/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 transition-all duration-300 group-hover:scale-105"></span>
            <span className="relative w-full sm:w-auto px-7 py-3.5 rounded-[15px] bg-[#05060f]/60 backdrop-blur-sm group-hover:bg-transparent transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Get API key</span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          {/* Secondary CTA */}
          <a
            href="#developers"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold text-sm text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] backdrop-blur-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Read Documentation</span>
          </a>
        </div>

        {/* Micro feature badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sub-120ms latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero prompt engineering</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Page coordinate citations</span>
          </div>
        </div>
      </div>
    </section>
  );
};
