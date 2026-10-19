'use client';

import React from 'react';
import {
  Check,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  price: string;
  cadence: string;
  description: string;
  requestsIncluded: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const NimbusPricing: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      id: 'hacker',
      name: 'Developer',
      price: '$0',
      cadence: 'forever free',
      description: 'Ideal for prototyping, personal projects, and evaluating accuracy.',
      requestsIncluded: '500 requests / month included',
      features: [
        '500 document queries / month',
        'Up to 10MB per file (PDF, DOCX, TXT)',
        'Page & paragraph coordinate citations',
        'Standard rate limits (60 req / min)',
        'Community Discord & public docs',
      ],
      cta: 'Start with Free',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Most Popular',
      price: '$49',
      cadence: '/ month',
      description: 'Built for fast-growing production applications and engineering teams.',
      requestsIncluded: '10,000 requests / month ($0.004/extra)',
      features: [
        '10,000 document queries / month',
        'Up to 100MB per file with OCR',
        'Sub-120ms median latency burst mode',
        'High throughput (600 req / min)',
        'Native Server-Sent Events (SSE) streaming',
        'Table structure & key-value extraction',
        '99.9% uptime SLA & priority email support',
      ],
      cta: 'Get Started with Pro',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      cadence: 'volume-based',
      description: 'For organizations with mission-critical security and high-throughput workloads.',
      requestsIncluded: 'Custom volume & dedicated capacity',
      features: [
        'Unlimited requests & custom volume tiers',
        'Private VPC or On-Premise deployments',
        'Zero-data-retention legal agreement',
        'SOC-2 Type II report & HIPAA BAA',
        'Dedicated Slack channel & solutions engineer',
        'Custom 99.99% uptime SLA guarantee',
        'Custom fine-tuned OCR & domain glossaries',
      ],
      cta: 'Contact Enterprise Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10" aria-label="Transparent Pricing">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">
          Predictable Pricing
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pay only for what you process
        </p>
        <p className="mt-3.5 text-sm sm:text-base text-slate-300">
          Transparent, usage-based pricing with no surprise overages or hidden vector storage surcharges.
        </p>
      </div>

      {/* Clear definition of what counts as a request */}
      <div className="max-w-3xl mx-auto mb-14 p-4 rounded-2xl bg-gradient-to-r from-violet-950/30 via-indigo-950/20 to-cyan-950/30 border border-violet-500/20 backdrop-blur-md text-xs sm:text-sm text-slate-300 flex items-start gap-3 shadow-lg">
        <HelpCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-semibold">What counts as a request?</strong>{' '}
          <span>
            1 request equals 1 natural language question asked against a document, or up to 25 pages processed during batch ingestion. Document indexing and embedding generation are completely free.
          </span>
        </div>
      </div>

      {/* Three Pricing Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
              tier.popular
                ? 'bg-[#0a0c20]/90 border-2 border-violet-500/60 shadow-2xl shadow-violet-900/30'
                : 'bg-[#080a18]/70 border border-white/[0.08] hover:border-white/[0.2] shadow-xl'
            } backdrop-blur-xl`}
          >
            {/* "Most Popular" Pill */}
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-200" />
                <span>{tier.badge}</span>
              </div>
            )}

            <div>
              {/* Plan name & description */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
              </div>
              <p className="text-xs text-slate-400 min-h-[36px]">{tier.description}</p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {tier.price}
                </span>
                <span className="text-xs text-slate-400 font-medium">{tier.cadence}</span>
              </div>

              {/* Volume callout */}
              <div className="mt-2 text-xs font-semibold text-cyan-300 font-mono">
                {tier.requestsIncluded}
              </div>

              {/* Feature List */}
              <ul className="mt-8 space-y-3.5 text-xs text-slate-300" aria-label={`${tier.name} features`}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-10 pt-4 border-t border-white/[0.06]">
              <a
                href="#developers"
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/30 hover:opacity-95'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
