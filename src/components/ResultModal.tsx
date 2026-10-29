import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Share2, CheckCircle2, RotateCcw, Shuffle, Sparkles, Trophy, Calendar, Users, Clock, Award } from 'lucide-react';
import { BoardGame, GuessEvaluation, GameMode } from '../types/game';
import { generateShareText } from '../utils/gameLogic';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGame: BoardGame;
  hasWon: boolean;
  guesses: GuessEvaluation[];
  mode: GameMode;
  puzzleNumber: number;
  onPlayNextPractice: () => void;
  onSwitchToPractice: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  targetGame,
  hasWon,
  guesses,
  mode,
  puzzleNumber,
  onPlayNextPractice,
  onSwitchToPractice
}) => {
  const [copied, setCopied] = useState(false);
  const [timeUntilTomorrow, setTimeUntilTomorrow] = useState('');

  // Confetti on win
  useEffect(() => {
    if (isOpen && hasWon) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, hasWon]);

  // Countdown to next daily puzzle (midnight local)
  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilTomorrow(`${hours}h ${minutes}m ${seconds}s`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleShare = async () => {
    const text = generateShareText(mode, puzzleNumber, guesses, hasWon);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Victory / Defeat Header */}
        <div className="text-center mb-6 pt-2">
          {hasWon ? (
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-3 shadow-lg shadow-emerald-950/50">
              <Trophy className="w-8 h-8" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mb-3 shadow-lg shadow-rose-950/50">
              <RotateCcw className="w-8 h-8" />
            </div>
          )}

          <h2 className="text-2xl font-black text-white font-display">
            {hasWon ? 'Hervorragend gelöst!' : 'Schade, das nächste Mal!'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {hasWon
              ? `Du hast das gesuchte Brettspiel in ${guesses.length} ${guesses.length === 1 ? 'Versuch' : 'Versuchen'} erraten.`
              : `Das gesuchte Brettspiel war:`}
          </p>
        </div>

        {/* Target Board Game Showcase Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl text-white shrink-0 shadow-md"
              style={{ backgroundColor: targetGame.themeColor || '#10b981' }}
            >
              {targetGame.title.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white truncate">
                  {targetGame.title}
                </h3>
                {targetGame.originalTitle && targetGame.originalTitle !== targetGame.title && (
                  <span className="text-xs text-slate-400">
                    ({targetGame.originalTitle})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Von <span className="text-slate-200 font-medium">{targetGame.designer}</span> · Erschienen <span className="font-mono text-slate-200">{targetGame.releaseYear}</span>
              </p>
              {targetGame.awards && (
                <div className="flex items-center gap-1.5 text-xs text-amber-300 mt-1.5">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{targetGame.awards}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800/80 leading-relaxed">
            {targetGame.description}
          </p>

          {/* Quick attribute breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
            <div className="bg-slate-900 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">BGG-Rang</span>
              <span className="text-yellow-400 font-bold font-mono">
                #{targetGame.bggRank}
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">Spieler</span>
              <span className="text-slate-200 font-semibold font-mono">
                {targetGame.minPlayers === targetGame.maxPlayers ? targetGame.minPlayers : `${targetGame.minPlayers}–${targetGame.maxPlayers}`}
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">Dauer</span>
              <span className="text-slate-200 font-semibold font-mono">
                {targetGame.minPlaytime === targetGame.maxPlaytime ? `${targetGame.minPlaytime} Min` : `${targetGame.minPlaytime}–${targetGame.maxPlaytime}m`}
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">Genre</span>
              <span className="text-slate-200 font-semibold truncate block">
                {targetGame.genre}
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">Mechanik</span>
              <span className="text-slate-200 font-semibold truncate block" title={`${targetGame.mechanic1}, ${targetGame.mechanic2}`}>
                {targetGame.mechanic1}
              </span>
            </div>
          </div>
        </div>

        {/* Share Button & Next Game Actions */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>In die Zwischenablage kopiert!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Ergebnis teilen (Emoji-Raster)</span>
              </>
            )}
          </button>

          {mode === 'DAILY' ? (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nächstes tägliches Rätsel in:</span>
              </div>
              <span className="text-lg font-mono font-bold text-white tabular-nums">
                {timeUntilTomorrow}
              </span>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    onClose();
                    onSwitchToPractice();
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Jetzt im Freien Spiel weiterspielen</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onPlayNextPractice();
              }}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nächstes Brettspiel erraten</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
