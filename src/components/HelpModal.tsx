import React from 'react';
import { X, ArrowUp, ArrowDown, Check, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
            ♟
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Spielanleitung: Wie funktioniert Brettspieldle?
            </h2>
            <p className="text-xs text-slate-400">
              Inspiriert von Pokédle und LoLdle – errate das gesuchte Brettspiel!
            </p>
          </div>
        </div>

        {/* Explanation text */}
        <div className="space-y-5 text-sm">
          <p className="text-slate-300">
            Errate das geheime Brettspiel in möglichst wenigen Versuchen. Nach jedem getätigten Tipp zeigt dir die Zeile farbliche Rückmeldungen zu den <strong>8 Kategorien</strong> (inkl. BGG-Weltrangliste der Top 500):
          </p>

          {/* Color explanations */}
          <div className="space-y-3">
            
            {/* Green */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </span>
              <div>
                <strong className="text-emerald-400 block text-sm">
                  Grün (Exakter Treffer)
                </strong>
                <span className="text-xs text-slate-300">
                  Die Eigenschaft des geratenen Spiels stimmt exakt mit dem gesuchten Spiel überein!
                </span>
              </div>
            </div>

            {/* Yellow */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60">
              <span className="w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center text-white shrink-0 font-bold text-xs mt-0.5">
                ≈
              </span>
              <div>
                <strong className="text-amber-400 block text-sm">
                  Gelb (Teilweise Übereinstimmung / Nah dran)
                </strong>
                <ul className="text-xs text-slate-300 list-disc list-inside mt-1 space-y-1">
                  <li><strong>Spieleranzahl:</strong> Überschneidung bei möglicher Spieleranzahl (z. B. 2–4 vs. 3–5).</li>
                  <li><strong>Spieldauer:</strong> Innerhalb von ±30 Minuten der durchschnittlichen Spielzeit.</li>
                  <li><strong>Genre:</strong> Eng verwandte Kategorie (z. B. Kennerspiel ↔ Expertenspiel).</li>
                  <li><strong>Hauptmechaniken (Slot 1 & 2):</strong> Die Mechanik ist im gesuchten Spiel vorhanden, aber in der anderen Position (z. B. als Mechanik 2 statt 1).</li>
                  <li><strong>Erscheinungsjahr:</strong> Maximal 5 Jahre Abweichung (z. B. 2017 statt 2021).</li>
                  <li><strong>BGG-Rang:</strong> Nah dran in der BoardGameGeek-Weltrangliste (innerhalb von ~40 Plätzen).</li>
                </ul>
              </div>
            </div>

            {/* Red */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60">
              <span className="w-6 h-6 rounded-lg bg-rose-900 flex items-center justify-center text-white shrink-0 font-bold text-xs mt-0.5">
                <X className="w-4 h-4" />
              </span>
              <div>
                <strong className="text-rose-400 block text-sm">
                  Rot (Keine Übereinstimmung)
                </strong>
                <span className="text-xs text-slate-300">
                  Die Eigenschaft passt nicht zum gesuchten Spiel.
                </span>
              </div>
            </div>

            {/* Arrows */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="flex items-center gap-1 text-sky-400 font-bold shrink-0 mt-0.5">
                <ArrowUp className="w-4 h-4" />
                <ArrowDown className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-sky-300 block text-sm">
                  Pfeile (Höher / Niedriger)
                </strong>
                <span className="text-xs text-slate-300">
                  Ein Pfeil nach <strong>oben (↑)</strong> bedeutet, dass der Wert <strong>größer / neuer / länger / besser platziert</strong> ist. Ein Pfeil nach <strong>unten (↓)</strong> bedeutet, dass er <strong>kleiner / älter / kürzer / weiter hinten platziert</strong> ist.
                </span>
              </div>
            </div>

          </div>

          {/* Categories overview */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-2 text-xs uppercase tracking-wider">
              Die 8 Bewertungs-Kategorien:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400">
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">1. Spieleranzahl</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">2. Spieldauer</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">3. Genre</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">4. Designer</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">5. Mechanik 1</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">6. Mechanik 2</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">7. Erscheinungsjahr</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/60">8. BGG-Rang (#)</div>
            </div>
          </div>

        </div>

        {/* Footer button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-950/40"
          >
            Verstanden, los geht's!
          </button>
        </div>

      </div>
    </div>
  );
};
