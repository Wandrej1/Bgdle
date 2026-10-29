import React, { useState } from 'react';
import { X, Plus, Trash2, Library, CheckCircle } from 'lucide-react';
import { BoardGame } from '../types/game';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customGames: BoardGame[];
  onAddGames: (newGames: BoardGame[]) => void;
  onRemoveGame: (gameId: string) => void;
  totalGamesCount: number;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  customGames,
  onAddGames,
  onRemoveGame,
  totalGamesCount
}) => {
  const [pasteText, setPasteText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportText = () => {
    if (!pasteText.trim()) return;

    // Parse lines or comma-separated titles
    const rawLines = pasteText
      .split(/[\r\n]+/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const added: BoardGame[] = [];
    for (const rawLine of rawLines) {
      // Clean up common CSV quotes or bullet points
      const cleanTitle = rawLine
        .replace(/^["'\-•*]\s*/, '')
        .replace(/["']\s*$/, '')
        .split(',')[0] // if CSV, take first column
        .trim();

      if (!cleanTitle || cleanTitle.toLowerCase() === 'objectname' || cleanTitle.toLowerCase() === 'title') {
        continue;
      }

      const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const newGame: BoardGame = {
        id: `custom-${slug}-${Date.now().toString().slice(-4)}`,
        title: cleanTitle,
        originalTitle: cleanTitle,
        minPlayers: 2,
        maxPlayers: 4,
        minPlaytime: 30,
        maxPlaytime: 60,
        genre: 'Familienspiel',
        designer: 'Eigene Sammlung',
        mechanic1: 'Hand-Management',
        mechanic2: 'Set-Sammlung',
        releaseYear: 2020,
        description: `Individuell hinzugefügtes Spiel: ${cleanTitle}.`,
        clueMaterial: `Teil der hinzugefügten Spielesammlung.`,
        difficulty: 'Mittel',
        themeColor: '#059669',
        bggRank: 999
      };
      added.push(newGame);
    }

    if (added.length > 0) {
      onAddGames(added);
      setFeedbackMsg(`✓ ${added.length} Spiel(e) erfolgreich zur aktiven Datenbank hinzugefügt!`);
      setPasteText('');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Eigene Spiele & Sammlung
            </h2>
            <p className="text-xs text-slate-400">
              Verwalte zusätzliche persönliche Spiele neben der BGG Top 1000 & den Kultklassikern
            </p>
          </div>
        </div>

        {/* Database overview status banner */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Gesamtanzahl erratbarer Spiele:</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {totalGamesCount} Spiele
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              (BGG Top 1–1000 inkl. Here to Slay, Kultklassiker + {customGames.length} eigene Titel)
            </span>
          </div>
        </div>

        {/* Import section */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Eigene Spiele hinzufügen
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kopiere beliebige Spielnamen aus deinen Notizen oder Listen hier hinein (ein Spiel pro Zeile oder durch Kommas getrennt). Sie stehen danach sofort im Suchfeld und im Freien Spiel bereit:
          </p>

          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"Z. B.:\nPort Royal\nCamel Up\nDie Quacksalber von Quedlinburg\nOder weitere Lieblingstitel aus deinem Spieleregal..."}
            rows={4}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleImportText}
              disabled={!pasteText.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Spiele zur Datenbank hinzufügen</span>
            </button>

            {feedbackMsg && (
              <span className="text-xs text-emerald-400 font-medium animate-in fade-in">
                {feedbackMsg}
              </span>
            )}
          </div>
        </div>

        {/* Custom Games List */}
        {customGames.length > 0 && (
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Bereits manuell hinzugefügte Spiele ({customGames.length}):
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {customGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-slate-200 truncate">{game.title}</span>
                    <span className="text-slate-500 font-mono text-[10px]">({game.releaseYear})</span>
                  </div>
                  <button
                    onClick={() => onRemoveGame(game.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="Entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Fertig
          </button>
        </div>

      </div>
    </div>
  );
};
