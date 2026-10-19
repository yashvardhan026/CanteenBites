'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Copy, Check, Terminal, ShieldCheck } from 'lucide-react';

export const NimbusCta: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const command = 'npm install @nimbus-ai/sdk';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10" aria-label="Call to Action">
      <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#0e122b]/90 to-[#070919]/90 border border-white/[0.1] backdrop-blur-2xl shadow-2xl shadow-violet-950/40 text-center overflow-hidden">
        {/* Soft background glow bloblets */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[240px] bg-gradient-to-r from-violet-600/30 to-cyan-500/30 blur-[90px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto">
          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Start building in 5 minutes
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Generate your free API key, upload a sample document, and receive your first streamed query in seconds. Free tier includes 500 requests every month with zero commitment.
          </p>

          {/* Action Button & Command */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-cyan-500 shadow-xl shadow-violet-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Get your API key</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Terminal snippet */}
            <div className="w-full sm:w-auto px-4 py-3 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-between sm:justify-start gap-3 font-mono text-xs text-slate-300">
              <span className="text-violet-400">$</span>
              <span>{command}</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                title="Copy install command"
                aria-label="Copy install command"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Micro trust cues */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              No credit card required
            </span>
            <span>•</span>
            <span>500 free requests/mo</span>
            <span>•</span>
            <span>Instant API key access</span>
          </div>
        </div>
      </div>
    </section>
  );
};
