'use client';

import React from 'react';
import { NimbusNavbar } from '@/components/nimbus/NimbusNavbar';
import { NimbusHero } from '@/components/nimbus/NimbusHero';
import { NimbusDemo } from '@/components/nimbus/NimbusDemo';
import { NimbusCapabilities } from '@/components/nimbus/NimbusCapabilities';
import { NimbusDeveloperSection } from '@/components/nimbus/NimbusDeveloperSection';
import { NimbusUseCases } from '@/components/nimbus/NimbusUseCases';
import { NimbusPricing } from '@/components/nimbus/NimbusPricing';
import { NimbusCta } from '@/components/nimbus/NimbusCta';
import { NimbusFooter } from '@/components/nimbus/NimbusFooter';

/**
 * Nimbus AI — Developer Landing Page
 *
 * Visual Style:
 * - Dark & Cinematic background (#05060f)
 * - Accent glows: Violet (#7c3aed) and Cyan (#06b6d4)
 * - Thin 1px translucent borders & glassy backdrop blur
 * - Monospace font for code, clean sans-serif for UI
 *
 * Ordered Sections:
 * 1. Navbar (Sticky, scroll blur, logo, docs, pricing, blog, CTA)
 * 2. Hero (Pure CSS aurora blobs, cursor spotlight, beta pill, h1 with gradient, 2 CTAs)
 * 3. Demo (Mock document chat panel with streamed answer & page citations)
 * 4. Capabilities (3x2 grid with hover border glow)
 * 5. Developer Section (2-column explanation & code tabs: cURL, Python, JS)
 * 6. Use Cases (Support, Research, Legal teams)
 * 7. Pricing (Usage-based, 3 tiers, clear request definition banner)
 * 8. CTA ("Start building in 5 minutes")
 * 9. Footer (Semantic footer, status, links)
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#05060f] text-slate-100 flex flex-col selection:bg-violet-600 selection:text-white font-sans overflow-x-hidden">
      {/* 1. Transparent Navbar with scroll blur */}
      <NimbusNavbar />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero Section with Pure CSS Aurora & Cursor Spotlight */}
        <NimbusHero />

        {/* 3. Demo: Mock Chat Panel with streamed-looking answer */}
        <NimbusDemo />

        {/* 4. Capabilities: 3x2 Grid */}
        <NimbusCapabilities />

        {/* 5. Developer Section: Two-column with interactive code tabs */}
        <NimbusDeveloperSection />

        {/* 6. Use Cases: Support, Research, and Legal teams */}
        <NimbusUseCases />

        {/* 7. Pricing: 3 Tiers with request definition banner */}
        <NimbusPricing />

        {/* 8. Call to Action: Start building in 5 minutes */}
        <NimbusCta />
      </main>

      {/* 9. Semantic Footer */}
      <NimbusFooter />
    </div>
  );
}
