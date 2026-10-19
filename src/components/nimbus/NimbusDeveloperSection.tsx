'use client';

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Zap,
  Lock,
  Box,
  Radio,
  ArrowRight,
} from 'lucide-react';

type Tab = 'curl' | 'python' | 'javascript';

export const NimbusDeveloperSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('python');
  const [copied, setCopied] = useState(false);

  const codeSnippets: Record<Tab, { filename: string; code: string; highlighted: React.ReactNode }> = {
    curl: {
      filename: 'query.sh',
      code: `curl -X POST https://api.nimbus.ai/v1/query \\
  -H "Authorization: Bearer nb_live_8f9a2b7c4d" \\
  -H "Content-Type: application/json" \\
  -d '{
    "document_url": "https://storage.acme.corp/q3-report.pdf",
    "question": "What was our net operating cash flow in Q3?",
    "stream": true,
    "cite_coordinates": true
  }'`,
      highlighted: (
        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
          <span className="text-violet-400 font-semibold">curl</span> -X POST https://api.nimbus.ai/v1/query \{'\n'}
          {'  '}-H <span className="text-cyan-300">&quot;Authorization: Bearer nb_live_8f9a2b7c4d&quot;</span> \{'\n'}
          {'  '}-H <span className="text-cyan-300">&quot;Content-Type: application/json&quot;</span> \{'\n'}
          {'  '}-d <span className="text-amber-300">&#39;</span>{'{'}{'\n'}
          {'    '}<span className="text-slate-400">&quot;document_url&quot;</span>: <span className="text-cyan-300">&quot;https://storage.acme.corp/q3-report.pdf&quot;</span>,{'\n'}
          {'    '}<span className="text-slate-400">&quot;question&quot;</span>: <span className="text-cyan-300">&quot;What was our net operating cash flow in Q3?&quot;</span>,{'\n'}
          {'    '}<span className="text-slate-400">&quot;stream&quot;</span>: <span className="text-violet-400">true</span>,{'\n'}
          {'    '}<span className="text-slate-400">&quot;cite_coordinates&quot;</span>: <span className="text-violet-400">true</span>{'\n'}
          {'  '}{'}'}<span className="text-amber-300">&#39;</span>
        </pre>
      ),
    },
    python: {
      filename: 'main.py',
      code: `import os
from nimbus import NimbusClient

client = NimbusClient(api_key=os.environ["NIMBUS_API_KEY"])

# Query with streamed answer and exact citations
stream = client.documents.query(
    document="s3://contracts/master-service-agreement.pdf",
    question="What are the termination notice windows and penalty terms?",
    stream=True,
    include_citations=True
)

for chunk in stream:
    print(chunk.text, end="", flush=True)
    if chunk.citations:
        print(f"\\n[Cited: {chunk.citations[0].page_number}]")`,
      highlighted: (
        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
          <span className="text-violet-400 font-semibold">import</span> os{'\n'}
          <span className="text-violet-400 font-semibold">from</span> nimbus <span className="text-violet-400 font-semibold">import</span> NimbusClient{'\n\n'}
          client = NimbusClient(api_key=os.environ[<span className="text-cyan-300">&quot;NIMBUS_API_KEY&quot;</span>]){'\n\n'}
          <span className="text-slate-500 italic"># Query with streamed answer and exact citations</span>{'\n'}
          stream = client.documents.query({'\n'}
          {'    '}document=<span className="text-cyan-300">&quot;s3://contracts/master-service-agreement.pdf&quot;</span>,{'\n'}
          {'    '}question=<span className="text-cyan-300">&quot;What are the termination notice windows and penalty terms?&quot;</span>,{'\n'}
          {'    '}stream=<span className="text-violet-400">True</span>,{'\n'}
          {'    '}include_citations=<span className="text-violet-400">True</span>{'\n'}
          ){'\n\n'}
          <span className="text-violet-400 font-semibold">for</span> chunk <span className="text-violet-400 font-semibold">in</span> stream:{'\n'}
          {'    '}<span className="text-blue-400">print</span>(chunk.text, end=<span className="text-cyan-300">&quot;&quot;</span>, flush=<span className="text-violet-400">True</span>){'\n'}
          {'    '}<span className="text-violet-400 font-semibold">if</span> chunk.citations:{'\n'}
          {'        '}<span className="text-blue-400">print</span>(<span className="text-cyan-300">f&quot;\n[Cited: {'{'}chunk.citations[0].page_number{'}'}]&quot;</span>)
        </pre>
      ),
    },
    javascript: {
      filename: 'index.ts',
      code: `import { Nimbus } from "@nimbus-ai/sdk";

const nimbus = new Nimbus({ apiKey: process.env.NIMBUS_API_KEY });

// Stream response directly into web response or terminal
const stream = await nimbus.query({
  file: "https://assets.corp/q3-investor-deck.pdf",
  question: "Summarize the key TAM assumptions and competitor matrix",
  stream: true,
});

for await (const delta of stream) {
  process.stdout.write(delta.text);
  if (delta.citation) {
    console.log(\` [Page \${delta.citation.page}]\`);
  }
}`,
      highlighted: (
        <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
          <span className="text-violet-400 font-semibold">import</span> {'{'} Nimbus {'}'} <span className="text-violet-400 font-semibold">from</span> <span className="text-cyan-300">&quot;@nimbus-ai/sdk&quot;</span>;{'\n\n'}
          <span className="text-violet-400 font-semibold">const</span> nimbus = <span className="text-violet-400 font-semibold">new</span> <span className="text-blue-400">Nimbus</span>({'{'} apiKey: process.env.NIMBUS_API_KEY {'}'});{'\n\n'}
          <span className="text-slate-500 italic">// Stream response directly into web response or terminal</span>{'\n'}
          <span className="text-violet-400 font-semibold">const</span> stream = <span className="text-violet-400 font-semibold">await</span> nimbus.<span className="text-blue-400">query</span>({'{'}{'\n'}
          {'  '}file: <span className="text-cyan-300">&quot;https://assets.corp/q3-investor-deck.pdf&quot;</span>,{'\n'}
          {'  '}question: <span className="text-cyan-300">&quot;Summarize the key TAM assumptions and competitor matrix&quot;</span>,{'\n'}
          {'  '}stream: <span className="text-violet-400">true</span>,{'\n'}
          {'}'});{'\n\n'}
          <span className="text-violet-400 font-semibold">for await</span> (<span className="text-violet-400 font-semibold">const</span> delta <span className="text-violet-400 font-semibold">of</span> stream) {'{'}{'\n'}
          {'  '}process.stdout.<span className="text-blue-400">write</span>(delta.text);{'\n'}
          {'  '}<span className="text-violet-400 font-semibold">if</span> (delta.citation) {'{'}{'\n'}
          {'    '}console.<span className="text-blue-400">log</span>(<span className="text-cyan-300">\` [Page \${'{'}delta.citation.page{'}'}]\`</span>);{'\n'}
          {'  '}{'}'}{'\n'}
          {'}'}
        </pre>
      ),
    },
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10" aria-label="Developer Integration">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Short Explanation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold backdrop-blur-sm">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer-First Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Integrate in minutes. Scale without infrastructure overhead.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate fragile vector database chunking, embedding drift, and complex prompt tuning. Nimbus provides a single streaming endpoint that understands layout geometry, tables, and dense technical jargon.
          </p>

          {/* Key Specs */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                <strong className="text-white">&lt; 120ms</strong> median response latency via edge edge caches
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-violet-400">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                <strong className="text-white">Zero retention guarantee</strong> with SOC-2 & HIPAA compliance
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400">
                <Box className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                Official SDKs for <strong className="text-white">Python, TypeScript, Go & Rust</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-violet-400">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                Server-Sent Events (<strong className="text-white">SSE</strong>) for native streaming responses
              </span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
            >
              <span>Explore complete API documentation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Column: Code Sample with Tabs */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#080a18]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/80 overflow-hidden hover:border-white/[0.15] transition-colors">
            {/* Tabs Header */}
            <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Code language selection">
                {(['python', 'javascript', 'curl'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      activeTab === tab
                        ? 'bg-violet-600/20 text-cyan-300 border border-violet-500/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    {tab === 'curl' ? 'cURL' : tab === 'python' ? 'Python' : 'JavaScript'}
                  </button>
                ))}
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Copy code to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-[11px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-6 overflow-x-auto bg-[#04050d]/80">
              {codeSnippets[activeTab].highlighted}
            </div>

            {/* Terminal status bar */}
            <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{codeSnippets[activeTab].filename}</span>
              <span className="text-cyan-400/80">UTF-8 • 200 OK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
