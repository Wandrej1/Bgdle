import React from 'react';
import { X, Award, Flame, Target, BarChart2 } from 'lucide-react';
import { GameStats } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  // Find max count in distribution for relative bar width
  const maxDistributionCount = Math.max(1, ...Object.values(stats.guessDistribution));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Deine Statistiken
            </h2>
            <p className="text-xs text-slate-400">
              Spielverlauf & Erfolge in Brettspieldle
            </p>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="block text-2xl font-black font-display text-white tabular-nums">
              {stats.gamesPlayed}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
              Gespielt
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="block text-2xl font-black font-display text-emerald-400 tabular-nums">
              {winRate}%
            </span>
            <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
              Siegquote
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="block text-2xl font-black font-display text-amber-400 tabular-nums">
              {stats.currentStreak}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
              Serie
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="block text-2xl font-black font-display text-purple-400 tabular-nums">
              {stats.maxStreak}
            </span>
            <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
              Rekord
            </span>
          </div>
        </div>

        {/* Guess Distribution Histogram */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
            Verteilung der Versuche
          </h3>

          <div className="space-y-1.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((attemptNum) => {
              const count = stats.guessDistribution[attemptNum] || 0;
              const percentage = Math.round((count / maxDistributionCount) * 100);

              return (
                <div key={attemptNum} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-right font-mono font-bold text-slate-400">
                    {attemptNum}
                  </span>
                  <div className="flex-1 bg-slate-950/60 rounded-md h-5 p-0.5 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-500 flex items-center justify-end px-2 ${
                        count > 0 ? 'bg-emerald-600 text-white font-bold' : 'bg-transparent text-slate-500'
                      }`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 12 : 0)}%` }}
                    >
                      <span className="text-[10px] tabular-nums font-mono">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
