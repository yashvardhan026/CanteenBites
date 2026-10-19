'use client';

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Bot,
  User,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
  Terminal,
} from 'lucide-react';

export const NimbusDemo: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `Net Operating Cash Flow: $412.8M (28.4% YoY increase, p. 19). Warranty Liabilities: $14.2M accrued for EMEA hardware revisions with zero pending class actions (p. 62, Note 14.b).`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10" aria-label="Interactive Product Demo">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4 backdrop-blur-sm">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive API Demo</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ask questions. Get cited, verifiable answers.
        </h2>
        <p className="mt-3.5 text-sm sm:text-base text-slate-300">
          Nimbus parses raw vector text, parsed tables, and scanned diagrams simultaneously—streaming back structured answers with precise coordinate bounding boxes.
        </p>
      </div>

      {/* Main Glass Card Chat Interface */}
      <div className="relative group">
        {/* Soft Ambient Glow behind the card */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600/20 via-indigo-600/10 to-cyan-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />

        <div className="rounded-2xl sm:rounded-3xl bg-[#080a18]/80 border border-white/[0.08] group-hover:border-violet-500/40 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden transition-all duration-300">
          {/* Card Top Window Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-white/[0.02] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            {/* Window dots & Active Document */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-rose-500/40 border border-rose-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/60 inline-block" />
              </div>

              <div className="h-4 w-[1px] bg-white/[0.1] hidden sm:block" />

              {/* Document Pill */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
                <FileText className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                <span className="truncate max-w-[180px] sm:max-w-none">Q3_Financial_Filing_ApexCorp.pdf</span>
                <span className="text-[10px] text-slate-500 bg-white/[0.05] px-1.5 py-0.2 rounded font-sans">
                  84 pages
                </span>
              </div>
            </div>

            {/* Performance telemetry */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                <Clock className="w-3 h-3" />
                118ms
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-[11px] text-cyan-300 hidden sm:flex">
                <ShieldCheck className="w-3.5 h-3.5" />
                99.4% Match
              </span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 sm:p-7 space-y-6">
            {/* User Message */}
            <div className="flex items-start gap-3.5 max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-slate-300 shadow-md">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-300">Developer</span>
                  <span className="text-[11px] text-slate-500">10:42 AM</span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 leading-relaxed">
                  What was our net operating cash flow in Q3, and are there any undisclosed warranty liabilities mentioned in Note 14?
                </div>
              </div>
            </div>

            {/* Nimbus AI Response with Streamed-looking format */}
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px] flex-shrink-0 shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-[#080a18] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      Nimbus AI
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        STREAMING
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500">Response #req_8f20b</span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    title="Copy Answer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl rounded-tl-sm bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] text-sm text-slate-200 leading-relaxed space-y-3.5">
                  <p className="text-slate-300">
                    Based on Section 3 (<em className="text-slate-200 not-italic font-medium">Consolidated Statements of Cash Flows</em>) and Note 14 of <code className="text-xs font-mono text-cyan-300 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-500/20">Q3_Financial_Filing_ApexCorp.pdf</code>:
                  </p>

                  <div className="space-y-3 pl-1">
                    {/* Bullet 1 */}
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-white">Net Operating Cash Flow:</span>{' '}
                        <span>
                          Totaled <strong className="text-cyan-300 font-semibold">$412.8M</strong> for Q3 2026, marking a 28.4% year-over-year increase primarily attributable to Enterprise subscription billings and improved DSO.
                        </span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-violet-300 bg-violet-950/40 border border-violet-500/30 px-2 py-0.5 rounded-md hover:border-violet-400 cursor-pointer transition-colors">
                            <Layers className="w-2.5 h-2.5 text-cyan-400" />
                            [Page 19, Table 3.2, ¶4]
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bullet 2 */}
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-white">Warranty Liability Assessment:</span>{' '}
                        <span>
                          In Note 14 (<em className="text-slate-300 not-italic">Commitments and Contingencies</em>), management recorded an accrued warranty liability of <strong className="text-violet-300 font-semibold">$14.2M</strong> relating to EMEA hardware components. The report explicitly confirms <span className="underline decoration-cyan-400/40 underline-offset-4">no unrecorded class-action liabilities or product recalls</span> are pending.
                        </span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-violet-300 bg-violet-950/40 border border-violet-500/30 px-2 py-0.5 rounded-md hover:border-violet-400 cursor-pointer transition-colors">
                            <Layers className="w-2.5 h-2.5 text-cyan-400" />
                            [Page 62, Note 14.b, Lines 12-28]
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pulsing Stream Indicator */}
                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 border-t border-white/[0.05]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-mono text-[11px]">Stream completed • 194 tokens generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
