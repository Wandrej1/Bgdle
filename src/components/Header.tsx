import React from 'react';
import { Volume2, VolumeX, HelpCircle, BarChart2, Calendar, Shuffle, Library } from 'lucide-react';
import { GameMode } from '../types/game';

interface HeaderProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenCollection: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  puzzleNumber: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  onOpenHelp,
  onOpenStats,
  onOpenCollection,
  isMuted,
  onToggleMute,
  puzzleNumber
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            ♟
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Brettspieldle
          </span>
          {mode === 'DAILY' && (
            <span className="hidden sm:inline-block text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              #{puzzleNumber}
            </span>
          )}
        </div>

        {/* Zone 2: Navigation / Mode Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectMode('DAILY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              mode === 'DAILY'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Täglich</span>
          </button>

          <button
            onClick={() => onSelectMode('PRACTICE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              mode === 'PRACTICE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Freies Spiel</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Collection, Stats, Help, Sound) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenCollection}
            aria-label="Eigene Spiele öffnen"
            title="Eigene Spiele verwalten"
            className="px-2.5 py-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold border border-slate-800"
          >
            <Library className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sammlung</span>
          </button>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ton einschalten' : 'Ton stummschalten'}
            title={isMuted ? 'Ton einschalten' : 'Ton stummschalten'}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenStats}
            aria-label="Statistiken anzeigen"
            title="Statistiken anzeigen"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelp}
            aria-label="Spielanleitung öffnen"
            title="Spielanleitung"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
