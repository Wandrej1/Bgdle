import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, Check } from 'lucide-react';
import { BoardGame } from '../types/game';

interface GameSearchBarProps {
  games: BoardGame[];
  guessedGameIds: string[];
  disabled: boolean;
  onSelectGame: (game: BoardGame) => void;
}

export const GameSearchBar: React.FC<GameSearchBarProps> = ({
  games,
  guessedGameIds,
  disabled,
  onSelectGame
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize text for flexible search (ignores accents/umlauts)
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');

  // Filter games based on search query (by title, original title, designer, or rank number)
  const filteredGames = query.trim().length === 0
    ? []
    : games.filter(g => {
        const qRaw = query.trim().toLowerCase();
        const q = normalize(query.trim());
        const normTitle = normalize(g.title);
        const normOriginal = g.originalTitle ? normalize(g.originalTitle) : '';
        const normDesigner = normalize(g.designer);

        const titleMatch = normTitle.includes(q) || g.title.toLowerCase().includes(qRaw);
        const originalMatch = normOriginal.includes(q) || (g.originalTitle?.toLowerCase().includes(qRaw) ?? false);
        const designerMatch = normDesigner.includes(q);
        const rankMatch = qRaw.startsWith('#')
          ? g.bggRank.toString() === qRaw.slice(1).trim()
          : (!isNaN(Number(qRaw)) && Number(qRaw) > 0 && g.bggRank.toString() === qRaw);

        return titleMatch || originalMatch || designerMatch || rankMatch;
      }).slice(0, 15); // Top 15 matches

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (game: BoardGame) => {
    if (guessedGameIds.includes(game.id)) {
      return; // already guessed
    }
    onSelectGame(game);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredGames.length === 0) {
      if (e.key === 'ArrowDown' && query.trim().length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredGames.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredGames.length) % filteredGames.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredGames[selectedIndex];
      if (selected && !guessedGameIds.includes(selected.id)) {
        handleSelect(selected);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center shadow-lg rounded-xl overflow-hidden border border-slate-700 bg-slate-900 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
        <div className="pl-4 pr-2 text-slate-400">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Spiel beendet!' : 'Spieltitel oder #Rang eingeben... (z. B. Arche Nova, Catan, #1-500)'}
          className="w-full py-3.5 px-2 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          autoComplete="off"
          spellCheck="false"
        />
        {query.trim().length > 0 && !disabled && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="px-3 text-xs text-slate-400 hover:text-slate-200"
          >
            Löschen
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && filteredGames.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-y-auto max-h-96 divide-y divide-slate-800"
        >
          {filteredGames.map((game, index) => {
            const isGuessed = guessedGameIds.includes(game.id);
            const isHighlighted = index === selectedIndex;

            return (
              <button
                key={game.id}
                type="button"
                disabled={isGuessed}
                onClick={() => handleSelect(game)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                  isGuessed
                    ? 'opacity-40 bg-slate-900/50 cursor-not-allowed'
                    : isHighlighted
                    ? 'bg-emerald-950/70 text-white'
                    : 'hover:bg-slate-800/80 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-inner"
                    style={{
                      backgroundColor: game.themeColor || '#10b981',
                      color: '#ffffff'
                    }}
                  >
                    {game.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm sm:text-base text-slate-100 truncate">
                        {game.title}
                      </span>
                      {game.originalTitle && game.originalTitle !== game.title && (
                        <span className="text-xs text-slate-400 hidden sm:inline truncate">
                          ({game.originalTitle})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{game.designer}</span>
                      <span>·</span>
                      <span className="font-mono">{game.releaseYear}</span>
                      <span>·</span>
                      <span className="text-yellow-400/90 font-mono font-medium">BGG #{game.bggRank}</span>
                      <span className="hidden md:inline">·</span>
                      <span className="hidden md:inline">{game.genre}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  {isGuessed ? (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-slate-500" />
                      Bereits geraten
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      Wählen
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.trim().length > 0 && filteredGames.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 text-center text-sm text-slate-400"
        >
          Kein Brettspiel mit dem Namen <strong className="text-slate-200">"{query}"</strong> gefunden.
          <p className="text-xs text-slate-400 mt-1">
            Tipp: Prüfe die Schreibweise oder suche nach dem englischen Originalnamen.
          </p>
        </div>
      )}
    </div>
  );
};
