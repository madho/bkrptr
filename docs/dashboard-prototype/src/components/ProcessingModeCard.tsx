import React from 'react';

interface ProcessingModeCardProps {
  mode: 'batch' | 'expedited';
  selected: boolean;
  onSelect: () => void;
}

export function ProcessingModeCard({ mode, selected, onSelect }: ProcessingModeCardProps) {
  const isBatch = mode === 'batch';
  
  return (
    <button
      onClick={onSelect}
      className={`
        flex-1 p-6 rounded-xl text-left transition-all duration-150
        ${selected 
          ? isBatch
            ? 'border-2 border-[#22C55E] bg-[#DCFCE7]'
            : 'border-2 border-[#F59E0B] bg-[#FEF3C7]'
          : 'border border-[#D1D5DB] bg-white hover:border-[#9CA3AF]'
        }
      `}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${selected 
            ? isBatch ? 'border-[#22C55E]' : 'border-[#F59E0B]'
            : 'border-[#D1D5DB]'
          }
        `}>
          {selected && (
            <div className={`w-3 h-3 rounded-full ${isBatch ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`} />
          )}
        </div>
        <span className="font-semibold text-[#111827]">
          {isBatch ? 'Batch Processing' : 'Expedited Processing'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isBatch ? '💰' : '⚡'}</span>
          <span className="text-2xl font-semibold text-[#111827]">
            ${isBatch ? '0.03' : '0.06'} per book
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-[#374151]">
          <span>⏱️</span>
          <span>{isBatch ? '~24 hours' : '~9 minutes'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#374151]">
          <span>{isBatch ? '🌱' : '🚀'}</span>
          <span>{isBatch ? 'Economy option' : 'Priority processing'}</span>
        </div>
      </div>

      <p className="text-sm text-[#6B7280] mt-4">
        Best for: {isBatch ? 'Regular reading lists' : 'Urgent needs'}
      </p>
    </button>
  );
}
