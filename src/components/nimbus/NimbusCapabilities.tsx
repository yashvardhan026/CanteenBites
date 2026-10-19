'use client';

import React from 'react';
import {
  FileText,
  Database,
  Tags,
  Languages,
  Search,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

interface Capability {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderColor: string;
}

export const NimbusCapabilities: React.FC = () => {
  const capabilities: Capability[] = [
    {
      id: 'summarise',
      title: 'Summarise',
      description: 'Condense 500-page filings and technical reports into executive briefings in under 2 seconds.',
      icon: FileText,
      accentColor: 'text-violet-400 group-hover:text-violet-300',
      borderColor: 'group-hover:border-violet-500/50',
    },
    {
      id: 'extract',
      title: 'Extract',
      description: 'Transform complex tables, scanned receipts, and unstructured forms into strictly typed JSON schemas.',
      icon: Database,
      accentColor: 'text-cyan-400 group-hover:text-cyan-300',
      borderColor: 'group-hover:border-cyan-500/50',
    },
    {
      id: 'classify',
      title: 'Classify',
      description: 'Automatically tag, route, and categorize inbound documents with 99.4% benchmarked accuracy.',
      icon: Tags,
      accentColor: 'text-indigo-400 group-hover:text-indigo-300',
      borderColor: 'group-hover:border-indigo-500/50',
    },
    {
      id: 'translate',
      title: 'Translate',
      description: 'Cross-lingual semantic question answering across 95+ languages while preserving technical nuances.',
      icon: Languages,
      accentColor: 'text-cyan-400 group-hover:text-cyan-300',
      borderColor: 'group-hover:border-cyan-500/50',
    },
    {
      id: 'search',
      title: 'Search',
      description: 'Hybrid vector and BM25 lexical retrieval that pinpoints exact needle-in-haystack clauses across millions of files.',
      icon: Search,
      accentColor: 'text-violet-400 group-hover:text-violet-300',
      borderColor: 'group-hover:border-violet-500/50',
    },
    {
      id: 'cite',
      title: 'Cite sources',
      description: 'Every generated claim is tethered to verifiable page numbers, paragraph indices, and bounding-box coordinates.',
      icon: CheckCircle2,
      accentColor: 'text-emerald-400 group-hover:text-emerald-300',
      borderColor: 'group-hover:border-emerald-500/50',
    },
  ];

  return (
    <section id="capabilities" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10" aria-label="API Capabilities">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">
          Core Capabilities
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Everything you need to build document intelligence
        </p>
        <p className="mt-3.5 text-sm sm:text-base text-slate-300">
          A single developer API that handles parsing, chunking, OCR, embeddings, and verifiable inference under one roof.
        </p>
      </div>

      {/* 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              className={`group relative p-6 sm:p-7 rounded-2xl bg-[#080a18]/60 border border-white/[0.08] ${cap.borderColor} backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/20 flex flex-col justify-between`}
            >
              {/* Subtle top corner gradient hint */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-tr-2xl pointer-events-none" />

              <div>
                {/* Icon wrapper */}
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-white/[0.07] transition-all">
                  <Icon className={`w-5 h-5 ${cap.accentColor} transition-colors`} />
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{cap.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>

                {/* Single sentence description */}
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {cap.description}
                </p>
              </div>

              {/* Bottom decorative subtle indicator */}
              <div className="mt-6 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>POST /v1/{cap.id}</span>
                <span className="text-emerald-400/80">99.9% Uptime</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
