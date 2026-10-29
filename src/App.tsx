/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BOARD_GAMES } from './data/boardgames';
import { BoardGame, GuessEvaluation, GameMode, GameStats } from './types/game';
import {
  getDailyGame,
  getTodayDateString,
  getDailyPuzzleNumber,
  getRandomGame,
  evaluateGuess
} from './utils/gameLogic';
import {
  loadGameStats,
  recordGameResult,
  loadDailyState,
  saveDailyState
} from './utils/storage';
import {
  playCardFlipSound,
  playVictorySound,
  playWrongSound,
  getSoundMuted,
  setSoundMuted
} from './utils/audio';
import { Header } from './components/Header';
import { GameSearchBar } from './components/GameSearchBar';
import { GuessTable } from './components/GuessTable';
import { HintsPanel } from './components/HintsPanel';
import { HelpModal } from './components/HelpModal';
import { StatsModal } from './components/StatsModal';
import { ResultModal } from './components/ResultModal';
import { CollectionModal } from './components/CollectionModal';

import tableBannerUrl from './assets/images/boardgame_table_banner_1792063811589.jpg';
import emblemUrl from './assets/images/brettspieldle_emblem_1792063811048.jpg';

export default function App() {
  const todayStr = useMemo(() => getTodayDateString(), []);
  const dailyPuzzleNum = useMemo(() => getDailyPuzzleNumber(todayStr), [todayStr]);

  // Mode: DAILY or PRACTICE
  const [mode, setMode] = useState<GameMode>('DAILY');

  // Daily target game
  const dailyTarget = useMemo(() => getDailyGame(todayStr), [todayStr]);

  // Practice target game
  const [practiceTarget, setPracticeTarget] = useState<BoardGame>(() => getRandomGame());

  // Current active target game based on mode
  const currentTarget = mode === 'DAILY' ? dailyTarget : practiceTarget;

  // Guesses history
  const [dailyGuesses, setDailyGuesses] = useState<GuessEvaluation[]>([]);
  const [practiceGuesses, setPracticeGuesses] = useState<GuessEvaluation[]>([]);

  // Game over states
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [dailyWon, setDailyWon] = useState(false);

  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [practiceWon, setPracticeWon] = useState(false);

  // Modals state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  // Custom user collection games
  const [customGames, setCustomGames] = useState<BoardGame[]>(() => {
    try {
      const saved = localStorage.getItem('brettspieldle_custom_games');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleAddCustomGames = (newGames: BoardGame[]) => {
    setCustomGames(prev => {
      const updated = [...prev, ...newGames];
      try {
        localStorage.setItem('brettspieldle_custom_games', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRemoveCustomGame = (gameId: string) => {
    setCustomGames(prev => {
      const updated = prev.filter(g => g.id !== gameId);
      try {
        localStorage.setItem('brettspieldle_custom_games', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // All available games (BGG Top 1000 + Cult Classics + User Collection)
  const allGames = useMemo(() => [...BOARD_GAMES, ...customGames], [customGames]);

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => getSoundMuted());

  // Statistics
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());

  // Load saved Daily state on mount
  useEffect(() => {
    const saved = loadDailyState(todayStr);
    if (saved && saved.guessIds.length > 0) {
      const reconstructed: GuessEvaluation[] = [];
      for (const id of saved.guessIds) {
        const found = BOARD_GAMES.find(g => g.id === id);
        if (found) {
          reconstructed.push(evaluateGuess(found, dailyTarget));
        }
      }
      setDailyGuesses(reconstructed);
      setDailyCompleted(saved.isCompleted);
      setDailyWon(saved.hasWon);

      if (saved.isCompleted) {
        setIsResultOpen(true);
      }
    }
  }, [todayStr, dailyTarget]);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
  };

  // Current guesses and state based on mode
  const currentGuesses = mode === 'DAILY' ? dailyGuesses : practiceGuesses;
  const isGameOver = mode === 'DAILY' ? dailyCompleted : practiceCompleted;
  const hasWon = mode === 'DAILY' ? dailyWon : practiceWon;

  const guessedIds = useMemo(() => {
    return currentGuesses.map(g => g.game.id);
  }, [currentGuesses]);

  // Handle a new guess
  const handleGuess = useCallback((game: BoardGame) => {
    if (isGameOver) return;

    const evaluation = evaluateGuess(game, currentTarget);
    const isWin = evaluation.overallSuccess;

    // Play tactile sound
    playCardFlipSound(1.2);

    if (mode === 'DAILY') {
      const nextGuesses = [evaluation, ...dailyGuesses];
      setDailyGuesses(nextGuesses);

      const nextCompleted = isWin;
      const nextWon = isWin;

      setDailyCompleted(nextCompleted);
      setDailyWon(nextWon);

      // Save to localStorage
      saveDailyState({
        date: todayStr,
        guessIds: nextGuesses.map(g => g.game.id),
        isCompleted: nextCompleted,
        hasWon: nextWon
      });

      if (isWin) {
        setTimeout(() => {
          playVictorySound();
          const updatedStats = recordGameResult(true, nextGuesses.length, todayStr);
          setStats(updatedStats);
          setIsResultOpen(true);
        }, 800);
      } else {
        playWrongSound();
      }
    } else {
      // PRACTICE Mode
      const nextGuesses = [evaluation, ...practiceGuesses];
      setPracticeGuesses(nextGuesses);

      if (isWin) {
        setPracticeCompleted(true);
        setPracticeWon(true);
        setTimeout(() => {
          playVictorySound();
          const updatedStats = recordGameResult(true, nextGuesses.length);
          setStats(updatedStats);
          setIsResultOpen(true);
        }, 800);
      } else {
        playWrongSound();
      }
    }
  }, [isGameOver, currentTarget, mode, dailyGuesses, todayStr, practiceGuesses]);

  // Handle give up
  const handleGiveUp = useCallback(() => {
    if (isGameOver) return;

    if (mode === 'DAILY') {
      setDailyCompleted(true);
      setDailyWon(false);
      saveDailyState({
        date: todayStr,
        guessIds: dailyGuesses.map(g => g.game.id),
        isCompleted: true,
        hasWon: false
      });
      const updatedStats = recordGameResult(false, dailyGuesses.length, todayStr);
      setStats(updatedStats);
      setIsResultOpen(true);
    } else {
      setPracticeCompleted(true);
      setPracticeWon(false);
      const updatedStats = recordGameResult(false, practiceGuesses.length);
      setStats(updatedStats);
      setIsResultOpen(true);
    }
  }, [isGameOver, mode, todayStr, dailyGuesses, practiceGuesses]);

  // Start next game in practice mode
  const handlePlayNextPractice = useCallback(() => {
    setPracticeTarget(getRandomGame(practiceTarget.id));
    setPracticeGuesses([]);
    setPracticeCompleted(false);
    setPracticeWon(false);
    setIsResultOpen(false);
  }, [practiceTarget]);

  return (
    <div className="min-h-screen bg-tabletop text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* 3-Zone Header */}
      <Header
        mode={mode}
        onSelectMode={(newMode) => setMode(newMode)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenCollection={() => setIsCollectionOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleSound}
        puzzleNumber={dailyPuzzleNum}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col items-center">
        
        {/* Thematic Hero Strip */}
        <div className="w-full max-w-3xl mb-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src={emblemUrl}
              alt="Brettspieldle Emblem"
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-emerald-500/30 shadow-md"
            />
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
              {mode === 'DAILY' ? 'Das tägliche Brettspiel-Rätsel' : 'Freies Spiel: Endlos-Modus'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            {mode === 'DAILY'
              ? `Errate das heutige Geheimspiel #${dailyPuzzleNum} aus über 1.010 Titeln der BGG Top 1000 & Kultklassikern!`
              : `Errate beliebig viele Spiele aus der BGG Top 1000, Klassikern und deiner Sammlung (${allGames.length} Spiele verzeichnet)!`}
          </p>
        </div>

        {/* Search Bar (Spieltitel Suche) */}
        <div className="w-full max-w-xl mb-4">
          <GameSearchBar
            games={allGames}
            guessedGameIds={guessedIds}
            disabled={isGameOver}
            onSelectGame={handleGuess}
          />
        </div>

        {/* Game status button if game over */}
        {isGameOver && (
          <div className="mb-4">
            <button
              onClick={() => setIsResultOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-950/40 flex items-center gap-2 cursor-pointer"
            >
              <span>{hasWon ? '🏆 Ergebnis & Karte anzeigen' : '🔍 Lösung & Details ansehen'}</span>
            </button>
          </div>
        )}

        {/* Unlockable Hints Panel */}
        <HintsPanel
          targetGame={currentTarget}
          guessCount={currentGuesses.length}
          onGiveUp={handleGiveUp}
          isGameOver={isGameOver}
        />

        {/* Pokédle / LoLdle style Table of Guesses */}
        <GuessTable guesses={currentGuesses} />

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Brettspieldle</span>
            <span>·</span>
            <span>Inspiriert von Pokédle & LoLdle</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsHelpOpen(true)} className="hover:text-slate-200">
              Spielanleitung
            </button>
            <span>·</span>
            <button onClick={() => setIsStatsOpen(true)} className="hover:text-slate-200">
              Statistiken
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <ResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        targetGame={currentTarget}
        hasWon={hasWon}
        guesses={currentGuesses}
        mode={mode}
        puzzleNumber={dailyPuzzleNum}
        onPlayNextPractice={handlePlayNextPractice}
        onSwitchToPractice={() => {
          setMode('PRACTICE');
          handlePlayNextPractice();
        }}
      />

      <CollectionModal
        isOpen={isCollectionOpen}
        onClose={() => setIsCollectionOpen(false)}
        customGames={customGames}
        onAddGames={handleAddCustomGames}
        onRemoveGame={handleRemoveCustomGame}
        totalGamesCount={allGames.length}
      />

    </div>
  );
}
