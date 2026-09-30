'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MenuItem, Order } from '@/types';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight,
  Package,
  Plus,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

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

export const BitesAIAssistant: React.FC = () => {
  const { user, addToCart, setActiveNavTab, showToast, activeOrder } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 I am Bites AI, your personal campus food assistant. How can I help you eat well today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickChips = [
    { label: '🍔 Find food', query: 'What should I eat today?' },
    { label: "📋 Today's menu", query: "Show me today's canteen menu" },
    { label: '🛒 My order', query: 'What is in my active order?' },
    { label: '⏱ Track order', query: 'Where is my order?' },
    { label: '💰 Offers', query: 'What coupons or discounts are available?' },
    { label: '❓ Help', query: 'How does CanteenBites work?' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
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
          message: query,
          userId: user?.id,
          userRole: user?.role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // If server says item should be added to cart
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
            text: 'I ran into a temporary hiccup retrieving that. Please try asking again!',
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
          text: 'Unable to connect to Bites AI server. Please check your network connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item);
    showToast('Added to Cart', `${item.name} added to cart`, 'success');
  };

  const handleGoToCheckout = () => {
    setIsOpen(false);
    setActiveNavTab('cart');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-6 right-5 z-40 p-3.5 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 group ring-2 ring-white animate-float-gentle"
        aria-label="Open Bites AI Chat Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6 group-hover:rotate-6 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
        </div>
        <span className="text-xs font-black tracking-tight pr-1 hidden sm:inline">
          Bites AI 🤖
        </span>
      </button>

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[420px] h-full sm:h-[600px] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-in duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white tracking-tight">Bites AI 🤖</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Your CanteenBites food assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chip.query)}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 text-[11px] font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-left bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Interactive Recommendation Cards */}
                {msg.recommendedItems && msg.recommendedItems.length > 0 && (
                  <div className="w-full mt-2.5 space-y-2">
                    {msg.recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-left hover:border-brand-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 line-clamp-1">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-black text-slate-900">₹{item.price}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {item.prepTimeMinutes}m
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickAdd(item)}
                          className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-all flex items-center gap-1 active:scale-95 flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Active Order Tracking Card */}
                {msg.activeOrder && (
                  <div className="w-full mt-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-left space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-900">
                        {msg.activeOrder.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                        {msg.activeOrder.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-amber-800">
                      Queue Position:{' '}
                      <strong className="text-sm">
                        #{msg.activeOrder.queuePosition > 0 ? msg.activeOrder.queuePosition : 'Ready'}
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setActiveNavTab('orders');
                      }}
                      className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Open Full Tracking Screen</span>
                    </button>
                  </div>
                )}

                {/* Checkout Confirmation Card */}
                {msg.checkoutPrompt && (
                  <div className="w-full mt-2">
                    <button
                      onClick={handleGoToCheckout}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Proceed to Normal Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 w-fit text-xs text-slate-500 shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span>Bites AI is searching menu & orders...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Bites AI, e.g. What's fast under ₹100?..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-40"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
