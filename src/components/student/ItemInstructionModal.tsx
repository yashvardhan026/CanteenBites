'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { X, Clock, Plus, Flame } from 'lucide-react';

interface ItemInstructionModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: MenuItem, instruction: string) => void;
}

export const ItemInstructionModal: React.FC<ItemInstructionModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen || !item) return null;

  const quickPresets = ['Less spicy', 'No onion', 'Extra sauce', 'Extra crunchy', 'Separate packaging'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-3">
            <span className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
          </div>
        </div>

        <div className="p-5 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 leading-snug">{item.name}</h3>
            <span className="font-black text-brand-600 text-lg">₹{item.price}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{item.prepTimeMinutes} mins prep</span>
            </span>
            {item.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>{item.calories} kcal</span>
              </span>
            )}
          </div>

          {/* Special Instructions */}
          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Special Kitchen Instructions (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Less spicy, no mayo, extra hot..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() =>
                  setInstruction((prev) => (prev ? `${prev}, ${preset}` : preset))
                }
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onConfirm(item, instruction);
              setInstruction('');
              onClose();
            }}
            className="w-full mt-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Add to Cart (₹{item.price})
          </button>
        </div>
      </div>
    </div>
  );
};
