import React from 'react';
import { Users, Clock, Compass, UserCheck, Cog, Puzzle, Calendar, Trophy } from 'lucide-react';
import { GuessEvaluation } from '../types/game';
import { GuessRow } from './GuessRow';

interface GuessTableProps {
  guesses: GuessEvaluation[];
}

export const GuessTable: React.FC<GuessTableProps> = ({ guesses }) => {
  if (guesses.length === 0) {
    return (
      <div className="w-full text-center py-10 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 max-w-2xl mx-auto my-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center text-xl font-bold mb-2.5">
          🎲
        </div>
        <h3 className="text-base font-bold text-slate-200">
          Noch kein Spiel geraten
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Gib oben einen beliebigen bekannten Spieltitel ein (z. B. <span className="text-slate-300 font-semibold">Catan</span>, <span className="text-slate-300 font-semibold">Flügelschlag</span> oder <span className="text-slate-300 font-semibold">Arche Nova</span>), um erste Hinweise zu den Kategorien zu erhalten!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-3 px-1 sm:px-2">
      
      {/* 10-Column CSS Grid Table Header (Fits 100% on screen with no scroll) */}
      <div className="grid grid-cols-[24px_repeat(9,minmax(0,1fr))] sm:grid-cols-[28px_repeat(9,minmax(0,1fr))] md:grid-cols-[34px_repeat(9,minmax(0,1fr))] gap-1 sm:gap-1.5 px-1 sm:px-1.5 py-2 mb-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider items-center text-center">
        
        {/* Turn placeholder */}
        <div className="text-center text-slate-500 font-mono text-[10px]">
          #
        </div>

        {/* 1. Spieltitel */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Compass className="w-3 h-3 text-emerald-400 shrink-0 hidden md:inline" />
          <span className="truncate">Titel</span>
        </div>

        {/* 2. Spieleranzahl */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Users className="w-3 h-3 text-sky-400 shrink-0 hidden md:inline" />
          <span className="truncate">Spieler</span>
        </div>

        {/* 3. Spieldauer */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Clock className="w-3 h-3 text-amber-400 shrink-0 hidden md:inline" />
          <span className="truncate">Dauer</span>
        </div>

        {/* 4. Genre */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Puzzle className="w-3 h-3 text-purple-400 shrink-0 hidden md:inline" />
          <span className="truncate">Genre</span>
        </div>

        {/* 5. Designer */}
        <div className="flex items-center justify-center gap-1 truncate">
          <UserCheck className="w-3 h-3 text-blue-400 shrink-0 hidden md:inline" />
          <span className="truncate">Autor</span>
        </div>

        {/* 6. Hauptmechanik 1 */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Cog className="w-3 h-3 text-emerald-400 shrink-0 hidden md:inline" />
          <span className="truncate">Mech 1</span>
        </div>

        {/* 7. Hauptmechanik 2 */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Cog className="w-3 h-3 text-teal-400 shrink-0 hidden md:inline" />
          <span className="truncate">Mech 2</span>
        </div>

        {/* 8. Veröffentlichungsjahr */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Calendar className="w-3 h-3 text-amber-400 shrink-0 hidden md:inline" />
          <span className="truncate">Jahr</span>
        </div>

        {/* 9. BGG-Platzierung */}
        <div className="flex items-center justify-center gap-1 truncate">
          <Trophy className="w-3 h-3 text-yellow-400 shrink-0 hidden md:inline" />
          <span className="truncate">BGG</span>
        </div>

      </div>

      {/* Guesses list (latest first) */}
      <div className="space-y-1.5 sm:space-y-2">
        {guesses.map((evaluation, index) => {
          const guessNumber = guesses.length - index;
          return (
            <GuessRow
              key={`${evaluation.game.id}-${guessNumber}`}
              evaluation={evaluation}
              guessNumber={guessNumber}
            />
          );
        })}
      </div>

      {/* Compact Legend reminder */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 mt-3 px-3 py-1.5 bg-slate-900/40 rounded-xl border border-slate-800/60 max-w-xl mx-auto">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"></span>
          <span>Exakt</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-amber-600 inline-block"></span>
          <span>Teilweise / Nah dran</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-rose-900 inline-block"></span>
          <span>Falsch</span>
        </div>
        <div className="flex items-center gap-1 font-mono">
          <span className="font-bold text-amber-300">↑</span> / <span className="font-bold text-sky-300">↓</span>
          <span>Höher / Tiefer</span>
        </div>
      </div>

    </div>
  );
};
