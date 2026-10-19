'use client';

import React from 'react';
import {
  Headphones,
  FlaskConical,
  Scale,
  ArrowRight,
  CheckCircle,
  FileSearch,
} from 'lucide-react';

interface UseCase {
  id: string;
  badge: string;
  title: string;
  team: string;
  description: string;
  samplePrompt: string;
  metric: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  hoverBorder: string;
}

export const NimbusUseCases: React.FC = () => {
  const useCases: UseCase[] = [
    {
      id: 'support',
      team: 'Support Teams',
      badge: 'Deflection & Triage',
      title: 'Autonomous Ticket Resolution',
      description:
        'Empower customer support reps and automated bots to answer complex technical inquiries by pulling exact steps directly from product manuals, warranty handbooks, and schematic diagrams.',
      samplePrompt: '“How do I resolve firmware fault code #E-94 on Series 7 hardware?”',
      metric: '65% faster ticket handle time',
      icon: Headphones,
      accentColor: 'text-cyan-400',
      hoverBorder: 'hover:border-cyan-500/50',
    },
    {
      id: 'research',
      team: 'Research Teams',
      badge: 'Deep R&D Analysis',
      title: 'Systematic Literature Review',
      description:
        'Synthesize clinical trials, patent filings, and academic journals into comparative matrices with transparent page citations, zero hallucinations, and instant tabular data extraction.',
      samplePrompt: '“Compare secondary endpoint efficacy across all 2025 Phase-III trials”',
      metric: '10x faster literature reviews',
      icon: FlaskConical,
      accentColor: 'text-violet-400',
      hoverBorder: 'hover:border-violet-500/50',
    },
    {
      id: 'legal',
      team: 'Legal Teams',
      badge: 'M&A & Compliance',
      title: 'Contract Auditing & Diligence',
      description:
        'Audit vendor agreements and deal rooms in minutes by redlining non-standard indemnification clauses, governing law stipulations, and uncapped liability limits with exact paragraph anchors.',
      samplePrompt: '“Surface all agreements with uncapped liability or auto-renewal within 60 days”',
      metric: '92% reduction in manual review time',
      icon: Scale,
      accentColor: 'text-indigo-400',
      hoverBorder: 'hover:border-indigo-500/50',
    },
  ];

  return (
    <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10" aria-label="Target Use Cases">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">
          Proven Solutions
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineered for mission-critical document workflows
        </p>
        <p className="mt-3.5 text-sm sm:text-base text-slate-300">
          From customer support desks to legal war rooms, Nimbus transforms passive archives into real-time operational intelligence.
        </p>
      </div>

      {/* 3 Larger Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {useCases.map((uc) => {
          const Icon = uc.icon;
          return (
            <div
              key={uc.id}
              className={`group relative p-7 sm:p-8 rounded-3xl bg-[#080a18]/70 border border-white/[0.08] ${uc.hoverBorder} backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-950/20 flex flex-col justify-between`}
            >
              {/* Soft corner illumination */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-tr-3xl pointer-events-none" />

              <div>
                {/* Team Tag & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.08] transition-all">
                    <Icon className={`w-6 h-6 ${uc.accentColor}`} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                    {uc.team}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {uc.title}
                </h3>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {uc.description}
                </p>

                {/* Sample Query Box */}
                <div className="mt-6 p-3.5 rounded-xl bg-black/40 border border-white/[0.05] text-xs font-mono text-slate-300">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-sans font-bold mb-1">
                    Sample Query
                  </div>
                  <span className="text-cyan-200/90">{uc.samplePrompt}</span>
                </div>
              </div>

              {/* Bottom Metric */}
              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>{uc.metric}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
