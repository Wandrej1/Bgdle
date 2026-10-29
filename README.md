# ♟️ Brettspieldle (Bgdle)

> **Das tägliche Rate- und Deduktionsspiel für Brettspiel-Begeisterte** – inspiriert von *Pokédle* und *LoLdle*, basierend auf der legendären **BoardGameGeek (BGG) Top 1000** und zeitlosen Kultklassikern!

---

## 🎲 Über das Spiel

In **Brettspieldle** versuchst du, mit möglichst wenigen Versuchen das gesuchte geheime Brettspiel zu erraten. Nach jeder getätigten Vermutung verraten dir farbige Kacheln und Richtungspfeile, wie nah du der gesuchten Antwort bist:

* 🟩 **Grün:** Exakte Übereinstimmung in dieser Kategorie!
* 🟨 **Gelb:** Teilweise Übereinstimmung (z. B. Spielzeit/Spieleranzahl überschneidet sich, Erscheinungsjahr weicht maximal 5 Jahre ab, Mechanik taucht an anderer Stelle auf).
* 🟥 **Rot:** Keine Übereinstimmung.
* ⬆️ / ⬇️ **Pfeile:** Zeigen an, ob der gesuchte Zielwert **höher / neuer / länger / weiter oben in den Charts** (↑) oder **niedriger / älter / kürzer / weiter hinten** (↓) liegt.

---

## 📊 Die 8 Vergleichskategorien

Jeder Rateversuch wird detailliert in folgenden Spalten analysiert:

1. **Spieleranzahl** *(z. B. 1–4 Spieler, 2–6 Spieler)*
2. **Spieldauer** *(z. B. 60–120 Min.)*
3. **Genre & Thema** *(z. B. Wirtschaft, Kartenspiel, Fantasy, Familienspiel)*
4. **Designer / Autoren** *(z. B. Klaus Teuber, Uwe Rosenberg, Vital Lacerda, Ramy Badie)*
5. **Hauptmechanik 1** *(z. B. Hand-Management, Worker-Placement, Deck-Building)*
6. **Hauptmechanik 2** *(z. B. Set-Sammlung, Würfelwurf, Mehrheitenkontrolle)*
7. **Veröffentlichungsjahr** *(z. B. 1995, 2020, 2024)*
8. **BGG-Platzierung** *(Weltweiter Rang auf BoardGameGeek, z. B. #1, #980)*

---

## ✨ Features

* 📅 **Täglicher Modus (Daily):** Jeden Tag ein neues, synchrones Rätsel für alle Spieler weltweit.
* 🔀 **Freies Spiel (Practice):** Unbegrenzt viele Runden mit zufälligen Titeln aus der Spieledatenbank zum Trainieren.
* 💡 **Freischaltbare Spielhinweise:**
  * **Nach 3 Versuchen:** Auszeichnung & Prämierung (z. B. *Spiel des Jahres*, *Deutscher Spielepreis*) oder eine zentrale Spielmechanik (ohne Rang-Spoiler).
  * **Nach 5 Versuchen:** Thematische, spoilerbereinigte Spielidee & Setting.
  * **Nach 7 Versuchen:** Der Anfangsbuchstabe des Titels.
* 📚 **Umfangreiche Spieledatenbank:** Über 1.000 Titel inklusive der kompletten aktuellen **BGG Top 1000** sowie Ikonen wie *Catan*, *Carcassonne*, *Scotland Yard*, *Here to Slay*, *Monopoly* u. v. m.
* ➕ **Eigene Spiele hinzufügen:** Schneller Import beliebiger Lieblingstitel aus dem eigenen Spieleregal.
* 📈 **Persönliche Statistiken:** Erfolgsquote, Streaks und Versuchsverteilung im lokalen Browser-Speicher.
* 📱 **Vollständig responsiv:** Entwickelt für Desktop, Tablets und Smartphones ohne horizontales Scrollen.

---

## 🛠️ Technologie-Stack

* **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Bundler & Tooling:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animationen:** [Motion](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
* **Hosting:** Statisches Deployment via [GitHub Pages](https://pages.github.com/) mit automatischer [GitHub Actions](https://github.com/features/actions) Pipeline.

---

## 🚀 Lokale Installation & Entwicklung

Voraussetzung: [Node.js](https://nodejs.org/) (Version 18 oder neuer)

```bash
# 1. Repository klonen
git clone https://github.com/<DEIN-NUTZERNAME>/<REPO-NAME>.git
cd <REPO-NAME>

# 2. Abhängigkeiten installieren
npm install --legacy-peer-deps

# 3. Lokalen Entwicklungsserver starten
npm run dev
```

Der Server startet standardmäßig auf `http://localhost:3000`.

### Projekt bauen

```bash
npm run build
```

Die fertigen statischen Dateien liegen anschließend im Ordner `dist/`.

---

## 🌐 Deployment auf GitHub Pages

In diesem Repository ist bereits eine fertige **GitHub Actions Workflow**-Datei hinterlegt (`.github/workflows/deploy.yml`):

1. Repository auf GitHub pushen (`main` oder `master` Branch).
2. Auf GitHub im Repository zu **Settings** > **Pages** navigieren.
3. Unter **Build and deployment** > **Source** die Option **GitHub Actions** auswählen.
4. Nach Abschluss des ersten Workflows ist die App unter `https://<nutzername>.github.io/<repo-name>/` erreichbar!

---

## 🙏 Danksagungen & Credits

Ein solches Projekt entsteht auf den Schultern fantastischer Ideen, Gemeinschaften und Open-Source-Projekte:

### 💡 Spielkonzept & Inspiration
* **[Wordle](https://www.nytimes.com/games/wordle/)** (erschaffen von *Josh Wardle*) für die Pionierarbeit an täglichen webbasierten Deduktionsrätseln.
* **[Pokédle](https://pokedle.net/)** & **[LoLdle](https://loldle.net/)** für die geniale Idee, Charaktere und Objekte anhand konkreter Kategorien und farbiger Indikatoren zu erraten.

### 🎲 Brettspieldaten & Community
* Ein riesiger Dank geht an **[BoardGameGeek (BGG)](https://boardgamegeek.com/)** und die weltweite BGG-Community. Ihre unermüdliche Dokumentation, Bewertungen und Verschlagwortung von tausenden Brettspielen bilden das Fundament für dieses Quiz.
* Besonderer Dank gilt all den wunderbaren **Spieleautoren, Designerinnen, Illustratoren und Verlagen**, deren Leidenschaft und Kreativität die analoge Spielewelt seit Jahrzehnten bereichern.

### 💻 Open Source Software & Bibliotheken
* Dem **React- & Vite-Team** für blitzschnelle Webentwicklungswerkzeuge.
* **[Tailwind Labs](https://tailwindcss.com/)** für das moderne Utility-First CSS-Framework.
* Den Machern von **[Lucide Icons](https://lucide.dev/)** für elegante, barrierefreie UI-Icons.
* **[canvas-confetti](https://github.com/catdad/canvas-confetti)** von *Kiril Vatev* für das festliche Gewinner-Konfetti.

---

## 📄 Lizenz & Rechtliches

Dieses Projekt ist ein nicht-kommerzielles Fan- und Community-Projekt zum Kennenlernen und Würdigen von Gesellschaftsspielen. Alle erwähnten Spieltitel, Handelsmarken und Urheberrechte gehören ihren jeweiligen Eigentümern und Verlagen.
