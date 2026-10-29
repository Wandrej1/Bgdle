import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { CategoryResult, MatchStatus } from '../types/game';

interface GuessCellProps {
  result: CategoryResult;
  columnIndex: number;
  isTitle?: boolean;
}

export const GuessCell: React.FC<GuessCellProps> = ({
  result,
  columnIndex,
  isTitle = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Background and border styles based on match status
  const getStatusStyles = (status: MatchStatus) => {
    switch (status) {
      case 'EXACT':
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-500',
          shadow: 'shadow-emerald-950/30'
        };
      case 'PARTIAL':
        return {
          bg: 'bg-amber-600',
          border: 'border-amber-500',
          shadow: 'shadow-amber-950/30'
        };
      case 'WRONG':
      default:
        return {
          bg: 'bg-rose-900/90',
          border: 'border-rose-700/80',
          shadow: 'shadow-rose-950/30'
        };
    }
  };

  const style = getStatusStyles(result.status);
  const animationDelay = `${columnIndex * 90}ms`;

  return (
    <div
      className="relative w-full min-w-0 h-16 sm:h-18 md:h-20 perspective-1000 group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div
        className={`w-full h-full p-1 sm:p-1.5 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center text-center text-white transition-all shadow-sm select-none animate-card-reveal ${style.bg} ${style.border} ${style.shadow}`}
        style={{ animationDelay }}
      >
        {/* Value text */}
        <span className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-bold leading-tight break-words line-clamp-2 px-0.5">
          {result.value}
        </span>

        {/* Direction arrow / match indicator */}
        <div className="mt-0.5 sm:mt-1 flex items-center justify-center">
          {result.direction === 'UP' && (
            <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] md:text-[10px] font-extrabold bg-black/35 px-1 py-0.5 rounded text-amber-200">
              <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              <span className="hidden sm:inline">HÖHER</span>
            </div>
          )}
          {result.direction === 'DOWN' && (
            <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] md:text-[10px] font-extrabold bg-black/35 px-1 py-0.5 rounded text-sky-200">
              <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              <span className="hidden sm:inline">TIEFER</span>
            </div>
          )}
          {result.status === 'EXACT' && !isTitle && (
            <div className="flex items-center text-[8px] sm:text-[9px] md:text-[10px] text-emerald-100 font-semibold bg-black/25 px-1 py-0.5 rounded">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 sm:mr-0.5 stroke-[3]" />
              <span className="hidden sm:inline">EXAKT</span>
            </div>
          )}
          {result.status === 'PARTIAL' && result.direction === 'NONE' && (
            <div className="text-[8px] sm:text-[9px] md:text-[10px] text-amber-100 font-semibold bg-black/25 px-1 py-0.5 rounded">
              <span className="sm:hidden">≈</span>
              <span className="hidden sm:inline">TEILWEISE</span>
            </div>
          )}
          {result.status === 'WRONG' && result.direction === 'NONE' && (
            <div className="text-[8px] sm:text-[9px] text-rose-200/90 font-medium bg-black/25 px-1 py-0.5 rounded">
              <X className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
          )}
        </div>
      </div>

      {/* Accessible Tooltip */}
      {showTooltip && result.subtext && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] sm:text-xs rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
          {result.subtext}
        </div>
      )}
    </div>
  );
};
