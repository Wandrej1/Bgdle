import React from 'react';
import { GuessEvaluation } from '../types/game';
import { GuessCell } from './GuessCell';

interface GuessRowProps {
  evaluation: GuessEvaluation;
  guessNumber: number;
}

export const GuessRow: React.FC<GuessRowProps> = ({ evaluation, guessNumber }) => {
  const { game, titleMatch, players, playtime, genre, designer, mechanic1, mechanic2, releaseYear, bggRank } = evaluation;

  return (
    <div className="grid grid-cols-[24px_repeat(9,minmax(0,1fr))] sm:grid-cols-[28px_repeat(9,minmax(0,1fr))] md:grid-cols-[34px_repeat(9,minmax(0,1fr))] gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-2 shadow-inner hover:border-slate-700/80 transition-colors items-center w-full">
      
      {/* Turn indicator */}
      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-slate-400 shrink-0 mx-auto">
        {guessNumber}
      </div>

      {/* 1. Spieltitel */}
      <div className="relative w-full min-w-0 h-16 sm:h-18 md:h-20 perspective-1000">
        <div
          className={`w-full h-full p-1 sm:p-1.5 rounded-lg sm:rounded-xl border flex flex-col items-center justify-center text-center text-white transition-all shadow-sm select-none animate-card-reveal ${
            titleMatch
              ? 'bg-emerald-600 border-emerald-500 shadow-emerald-950/30'
              : 'bg-rose-900/90 border-rose-700/80 shadow-rose-950/30'
          }`}
          style={{ animationDelay: '0ms' }}
        >
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center font-bold text-[8px] sm:text-[9px] text-white mb-0.5 sm:mb-1 shadow-xs shrink-0"
            style={{ backgroundColor: game.themeColor || '#10b981' }}
          >
            {game.title.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-[10px] sm:text-[11px] md:text-xs font-bold leading-tight break-words line-clamp-2 px-0.5">
            {game.title}
          </span>
          <span className="text-[8px] sm:text-[9px] opacity-75 truncate max-w-full hidden md:inline mt-0.5">
            {game.publisher || 'Spiel'}
          </span>
        </div>
      </div>

      {/* 2. Spieleranzahl */}
      <GuessCell result={players} columnIndex={1} />

      {/* 3. Spieldauer */}
      <GuessCell result={playtime} columnIndex={2} />

      {/* 4. Genre */}
      <GuessCell result={genre} columnIndex={3} />

      {/* 5. Designer */}
      <GuessCell result={designer} columnIndex={4} />

      {/* 6. Hauptmechanik 1 */}
      <GuessCell result={mechanic1} columnIndex={5} />

      {/* 7. Hauptmechanik 2 */}
      <GuessCell result={mechanic2} columnIndex={6} />

      {/* 8. Veröffentlichungsjahr */}
      <GuessCell result={releaseYear} columnIndex={7} />

      {/* 9. BGG-Platzierung */}
      <GuessCell result={bggRank} columnIndex={8} />

    </div>
  );
};
