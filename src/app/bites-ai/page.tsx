'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MenuItem, Order } from '@/types';
import {
  Bot,
  Send,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight,
  Package,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Footer } from '@/components/common/Footer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  intent?: string;
  recommendedItems?: MenuItem[];
  activeOrder?: Order;
  checkoutPrompt?: boolean;
}

export default function BitesAIPage() {
  const { user, addToCart, setActiveNavTab, showToast } = useApp();

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-page-msg',
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I am Bites AI, your official CanteenBites campus food assistant.\n\nYou can ask me to find delicious meals, recommend quick snacks under ₹100, track your live kitchen queue position, or explain hostel room delivery. What would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const samplePrompts = [
    { label: '🍟 What should I eat?', query: 'What should I eat today?' },
    { label: '⏱️ Quick food under 10 mins', query: "What's the fastest food ready in less than 10 minutes?" },
    { label: '📦 Where is my order?', query: 'Where is my order and what is my queue position?' },
    { label: '🌱 Pure Veg under ₹100', query: 'Show vegetarian food under 100' },
    { label: '🚲 How does hostel delivery work?', query: 'How does hostel room delivery work?' },
    { label: '🍕 Order me a paneer roll', query: 'Order me a paneer roll' },
  ];

  const handleSendMessage = async (queryText?: string) => {
    const text = queryText || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userId: user?.id,
          userRole: user?.role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.cartAction && data.cartAction.item) {
          addToCart(data.cartAction.item);
          showToast('Added to Cart', `${data.cartAction.item.name} added!`, 'success');
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: data.intent,
          recommendedItems: data.recommendedItems,
          activeOrder: data.activeOrder,
          checkoutPrompt: data.checkoutPrompt,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'ai',
            text: 'I encountered an issue processing that query. Please try asking again!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `net-err-${Date.now()}`,
          sender: 'ai',
          text: 'Unable to connect to Bites AI server. Please verify your network.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1 flex flex-col space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Bites AI 🤖
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Your CanteenBites food assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authenticated student data only</span>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p.query)}
              className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col space-y-4 min-h-[420px] max-h-[550px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Recommendation Cards */}
              {msg.recommendedItems && msg.recommendedItems.length > 0 && (
                <div className="w-full max-w-md mt-3 space-y-2">
                  {msg.recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-left hover:border-brand-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-black text-slate-900">₹{item.price}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.prepTimeMinutes} mins
                            </span>
                            <span>•</span>
                            <span className="text-brand-600 font-semibold">{item.canteenName}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(item);
                          showToast('Added to Cart', `${item.name} added!`, 'success');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center gap-1 active:scale-95 flex-shrink-0 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Order Tracking Card */}
              {msg.activeOrder && (
                <div className="w-full max-w-md mt-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">
                      Order: {msg.activeOrder.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                      {msg.activeOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-amber-800">
                    Live Queue Position:{' '}
                    <strong className="text-base text-amber-950">
                      #{msg.activeOrder.queuePosition > 0 ? msg.activeOrder.queuePosition : 'Ready'}
                    </strong>
                  </div>

                  <Link
                    href="/"
                    onClick={() => setActiveNavTab('orders')}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>View Real-Time Progress Screen</span>
                  </Link>
                </div>
              )}

              {/* Checkout Prompt Card */}
              {msg.checkoutPrompt && (
                <div className="w-full max-w-md mt-3">
                  <Link
                    href="/"
                    onClick={() => setActiveNavTab('cart')}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Proceed to Normal Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 w-fit text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span>Bites AI is inspecting the kitchen database...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3 p-2 bg-white rounded-3xl border border-slate-200 shadow-sm"
        >
          <input
            type="text"
            placeholder="Type your question or food request, e.g. What's fast under ₹100?..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-40"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
