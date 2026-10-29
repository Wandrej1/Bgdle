import React, { useState } from 'react';
import { Lightbulb, Trophy, Compass, Sparkles, AlertCircle, Eye, EyeOff, Puzzle } from 'lucide-react';
import { BoardGame } from '../types/game';

interface HintsPanelProps {
  targetGame: BoardGame;
  guessCount: number;
  onGiveUp: () => void;
  isGameOver: boolean;
}

/**
 * Remove any inadvertent title / franchise / author spoilers from hint text
 */
function sanitizeSpoilerHint(text: string, game: BoardGame): string {
  if (!text) return '';
  let sanitized = text;

  // Collect potential spoiler terms (game title, original title, designer names)
  const blacklist = [game.title, game.originalTitle, game.designer].filter(Boolean) as string[];

  for (const item of blacklist) {
    // Add full string
    const trimmed = item.trim();
    if (trimmed.length >= 3) {
      const reg = new RegExp(`\\b${escapeRegExp(trimmed)}\\b`, 'gi');
      sanitized = sanitized.replace(reg, '[dieses Spiel]');
    }

    // Add significant words >= 4 letters (excluding common stop words)
    const stopWords = new Set(['spiel', 'game', 'edition', 'first', 'second', 'deluxe', 'board', 'card', 'eine', 'einer', 'eines', 'über', 'nach', 'with', 'from', 'into']);
    const words = item.split(/[\s:,\-–()]+/).filter(w => w.length >= 4 && !stopWords.has(w.toLowerCase()));
    for (const word of words) {
      const reg = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
      sanitized = sanitized.replace(reg, '[...]');
    }
  }

  // Clean double replacements
  sanitized = sanitized.replace(/(\[\.\.\.\]\s*)+/g, '[dieses Spiel] ');
  return sanitized.trim();
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const HintsPanel: React.FC<HintsPanelProps> = ({
  targetGame,
  guessCount,
  onGiveUp,
  isGameOver
}) => {
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [showConfirmGiveUp, setShowConfirmGiveUp] = useState(false);

  const toggleHint = (hintIndex: number) => {
    setRevealedHints(prev => ({ ...prev, [hintIndex]: !prev[hintIndex] }));
  };

  const hint1Unlocked = guessCount >= 3 || isGameOver;
  const hint2Unlocked = guessCount >= 5 || isGameOver;
  const hint3Unlocked = guessCount >= 7 || isGameOver;

  if (guessCount === 0 && !isGameOver) {
    return null;
  }

  // Hint 1: Award information if available, otherwise a primary game mechanic (Never BGG rank)
  const hasAwards = Boolean(targetGame.awards && targetGame.awards.trim().length > 0);
  const cleanAwards = targetGame.awards
    ? targetGame.awards.replace(/BGG\s*(Rank|Rang)?\s*#?\d+/gi, '').trim()
    : '';

  const fallbackMechanic =
    (targetGame.mechanic1 && targetGame.mechanic1 !== 'NA' && targetGame.mechanic1 !== 'Unbekannt')
      ? targetGame.mechanic1
      : (targetGame.mechanic2 && targetGame.mechanic2 !== 'NA' && targetGame.mechanic2 !== 'Unbekannt')
        ? targetGame.mechanic2
        : 'Hand-Management';

  const hint1Content = (hasAwards && cleanAwards)
    ? cleanAwards
    : `Eine der zentralen Spielmechaniken dieses Spiels ist: "${fallbackMechanic}".`;

  const cleanDescriptionHint = sanitizeSpoilerHint(
    targetGame.clueMaterial || targetGame.description || 'Ein renommiertes Spiel dieser Kategorie.',
    targetGame
  );

  return (
    <div className="w-full max-w-xl mx-auto my-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2.5 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-200">
            Freischaltbare Spielhinweise
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">
          Versuch {guessCount}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Hint 1: Awards or Mechanic (strictly no BGG rank) */}
        <div className={`p-2.5 rounded-xl border transition-all ${
          hint1Unlocked ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-950/40 border-slate-800/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasAwards && cleanAwards ? (
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Puzzle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="font-semibold text-slate-300 text-[11px] sm:text-xs">
                Hinweis 1 (ab 3 Versuchen): {hasAwards && cleanAwards ? 'Auszeichnung & Prämierung' : 'Spielmechanik'}
              </span>
            </div>
            {hint1Unlocked && (
              <button
                onClick={() => toggleHint(1)}
                className="text-[11px] sm:text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                {revealedHints[1] || isGameOver ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {revealedHints[1] || isGameOver ? 'Verbergen' : 'Aufdecken'}
              </button>
            )}
          </div>
          {hint1Unlocked ? (
            revealedHints[1] || isGameOver ? (
              <p className="mt-1.5 text-amber-200 font-medium pl-5 text-[11px] sm:text-xs">
                {hint1Content}
              </p>
            ) : (
              <p className="mt-1 text-slate-400 pl-5 italic text-[11px]">Klicke auf "Aufdecken", um den Hinweis zu lesen.</p>
            )
          ) : (
            <p className="mt-1 text-slate-400 pl-5 text-[11px]">Wird nach 3 Versuchen freigeschaltet (noch {Math.max(0, 3 - guessCount)} nötig).</p>
          )}
        </div>

        {/* Hint 2: Theme & Gameplay Setting (Strictly spoiler-free) */}
        <div className={`p-2.5 rounded-xl border transition-all ${
          hint2Unlocked ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-950/40 border-slate-800/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-semibold text-slate-300 text-[11px] sm:text-xs">
                Hinweis 2 (ab 5 Versuchen): Spielidee & Thema
              </span>
            </div>
            {hint2Unlocked && (
              <button
                onClick={() => toggleHint(2)}
                className="text-[11px] sm:text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                {revealedHints[2] || isGameOver ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {revealedHints[2] || isGameOver ? 'Verbergen' : 'Aufdecken'}
              </button>
            )}
          </div>
          {hint2Unlocked ? (
            revealedHints[2] || isGameOver ? (
              <p className="mt-1.5 text-sky-200 font-medium pl-5 text-[11px] sm:text-xs leading-relaxed">
                {cleanDescriptionHint}
              </p>
            ) : (
              <p className="mt-1 text-slate-400 pl-5 italic text-[11px]">Klicke auf "Aufdecken", um den Hinweis zu lesen.</p>
            )
          ) : (
            <p className="mt-1 text-slate-400 pl-5 text-[11px]">Wird nach 5 Versuchen freigeschaltet (noch {Math.max(0, 5 - guessCount)} nötig).</p>
          )}
        </div>

        {/* Hint 3: First letter */}
        <div className={`p-2.5 rounded-xl border transition-all ${
          hint3Unlocked ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-950/40 border-slate-800/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="font-semibold text-slate-300 text-[11px] sm:text-xs">
                Hinweis 3 (ab 7 Versuchen): Anfangsbuchstabe
              </span>
            </div>
            {hint3Unlocked && (
              <button
                onClick={() => toggleHint(3)}
                className="text-[11px] sm:text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                {revealedHints[3] || isGameOver ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {revealedHints[3] || isGameOver ? 'Verbergen' : 'Aufdecken'}
              </button>
            )}
          </div>
          {hint3Unlocked ? (
            revealedHints[3] || isGameOver ? (
              <p className="mt-1.5 text-purple-200 font-medium pl-5 text-[11px] sm:text-xs">
                Der Spieltitel beginnt mit dem Buchstaben <span className="font-bold underline text-sm">"{targetGame.title.charAt(0)}"</span>.
              </p>
            ) : (
              <p className="mt-1 text-slate-400 pl-5 italic text-[11px]">Klicke auf "Aufdecken", um den Hinweis zu lesen.</p>
            )
          ) : (
            <p className="mt-1 text-slate-400 pl-5 text-[11px]">Wird nach 7 Versuchen freigeschaltet (noch {Math.max(0, 7 - guessCount)} nötig).</p>
          )}
        </div>
      </div>

      {/* Give up option */}
      {!isGameOver && guessCount >= 6 && (
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-end">
          {showConfirmGiveUp ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-300">Wirklich auflösen?</span>
              <button
                onClick={onGiveUp}
                className="px-2 py-0.5 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors"
              >
                Ja, auflösen
              </button>
              <button
                onClick={() => setShowConfirmGiveUp(false)}
                className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmGiveUp(true)}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Aufgeben & Lösung anzeigen
            </button>
          )}
        </div>
      )}
    </div>
  );
};
