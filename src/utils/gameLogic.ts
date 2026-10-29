import { BOARD_GAMES } from '../data/boardgames';
import { BoardGame, GuessEvaluation, CategoryResult, Direction, MatchStatus } from '../types/game';

/**
 * Deterministically pick daily game based on date string (YYYY-MM-DD)
 */
export function getDailyGame(dateStr: string): BoardGame {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % BOARD_GAMES.length;
  return BOARD_GAMES[index];
}

/**
 * Get current date in local ISO format (YYYY-MM-DD)
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the day number since start of Brettspieldle
 */
export function getDailyPuzzleNumber(dateStr: string): number {
  const startDate = new Date('2024-01-01').getTime();
  const currentDate = new Date(dateStr).getTime();
  const diffDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Pick a random game different from current
 */
export function getRandomGame(excludeId?: string): BoardGame {
  const pool = excludeId ? BOARD_GAMES.filter(g => g.id !== excludeId) : BOARD_GAMES;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Compare players count
 */
function evaluatePlayers(guess: BoardGame, target: BoardGame): CategoryResult {
  const exact = guess.minPlayers === target.minPlayers && guess.maxPlayers === target.maxPlayers;
  const guessRange = guess.minPlayers === guess.maxPlayers ? `${guess.minPlayers}` : `${guess.minPlayers} - ${guess.maxPlayers}`;

  if (exact) {
    return {
      value: `${guessRange} Spieler`,
      status: 'EXACT',
      direction: 'NONE',
      subtext: 'Exakt übereinstimmend!'
    };
  }

  // Check overlap
  const overlap = Math.max(guess.minPlayers, target.minPlayers) <= Math.min(guess.maxPlayers, target.maxPlayers);
  const minMatches = guess.minPlayers === target.minPlayers;
  const maxMatches = guess.maxPlayers === target.maxPlayers;

  const guessAvg = (guess.minPlayers + guess.maxPlayers) / 2;
  const targetAvg = (target.minPlayers + target.maxPlayers) / 2;

  let direction: Direction = 'NONE';
  if (targetAvg > guessAvg) {
    direction = 'UP';
  } else if (targetAvg < guessAvg) {
    direction = 'DOWN';
  }

  const isPartial = overlap || minMatches || maxMatches;

  return {
    value: `${guessRange} Spieler`,
    status: isPartial ? 'PARTIAL' : 'WRONG',
    direction,
    subtext: isPartial 
      ? (direction === 'UP' ? 'Überschneidung, aber Ziel hat tendenziell mehr Spieler' : direction === 'DOWN' ? 'Überschneidung, aber Ziel hat tendenziell weniger Spieler' : 'Teilweise Überschneidung')
      : (direction === 'UP' ? 'Ziel benötigt mehr Spieler' : 'Ziel benötigt weniger Spieler')
  };
}

/**
 * Compare playtime
 */
function evaluatePlaytime(guess: BoardGame, target: BoardGame): CategoryResult {
  const guessAvg = (guess.minPlaytime + guess.maxPlaytime) / 2;
  const targetAvg = (target.minPlaytime + target.maxPlaytime) / 2;
  const diff = targetAvg - guessAvg;

  const guessRange = guess.minPlaytime === guess.maxPlaytime 
    ? `${guess.minPlaytime} Min.` 
    : `${guess.minPlaytime} - ${guess.maxPlaytime} Min.`;

  const exact = guess.minPlaytime === target.minPlaytime && guess.maxPlaytime === target.maxPlaytime;

  if (exact || Math.abs(diff) === 0) {
    return {
      value: guessRange,
      status: 'EXACT',
      direction: 'NONE',
      subtext: 'Exakte Spieldauer!'
    };
  }

  let direction: Direction = 'NONE';
  if (diff > 0) {
    direction = 'UP';
  } else {
    direction = 'DOWN';
  }

  // Within 30 minutes is partial
  const isPartial = Math.abs(diff) <= 30;

  return {
    value: guessRange,
    status: isPartial ? 'PARTIAL' : 'WRONG',
    direction,
    subtext: isPartial
      ? (direction === 'UP' ? 'Nah dran! Ziel dauert etwas länger' : 'Nah dran! Ziel dauert etwas kürzer')
      : (direction === 'UP' ? 'Ziel dauert deutlich länger' : 'Ziel dauert deutlich kürzer')
  };
}

/**
 * Compare genres
 */
function evaluateGenre(guess: BoardGame, target: BoardGame): CategoryResult {
  const gGenre = guess.genre.trim().toLowerCase();
  const tGenre = target.genre.trim().toLowerCase();

  if (gGenre === tGenre) {
    return {
      value: guess.genre,
      status: 'EXACT',
      subtext: 'Exaktes Genre!'
    };
  }

  // Partial genre groups:
  const relatedGroups = [
    ['kennerspiel', 'expertenspiel', 'strategie'],
    ['familienspiel', 'kartenspiel', 'partyspiel'],
    ['kooperativ', 'abenteuer', 'deduktion']
  ];

  const isRelated = relatedGroups.some(group => 
    group.includes(gGenre) && group.includes(tGenre)
  );

  return {
    value: guess.genre,
    status: isRelated ? 'PARTIAL' : 'WRONG',
    subtext: isRelated ? 'Ähnliche Kategorie' : 'Falsches Genre'
  };
}

/**
 * Compare designer
 */
function evaluateDesigner(guess: BoardGame, target: BoardGame): CategoryResult {
  const gNorm = guess.designer.trim().toLowerCase();
  const tNorm = target.designer.trim().toLowerCase();

  if (gNorm === tNorm) {
    return {
      value: guess.designer,
      status: 'EXACT',
      subtext: 'Gleicher Designer!'
    };
  }

  // Split multiple designers
  const gList = gNorm.split(/[,/&]| und /i).map(s => s.trim());
  const tList = tNorm.split(/[,/&]| und /i).map(s => s.trim());

  const hasSharedDesigner = gList.some(d1 => tList.some(d2 => d1 === d2 || (d1.length > 3 && d2.includes(d1)) || (d2.length > 3 && d1.includes(d2))));

  return {
    value: guess.designer,
    status: hasSharedDesigner ? 'PARTIAL' : 'WRONG',
    subtext: hasSharedDesigner ? 'Gemeinsamer Co-Designer' : 'Anderer Designer'
  };
}

/**
 * Compare dual mechanics (Pokédle type 1 / type 2 dual slot rule)
 */
function evaluateMechanic1(guess: BoardGame, target: BoardGame): CategoryResult {
  const gMech1 = guess.mechanic1.trim().toLowerCase();
  const tMech1 = target.mechanic1.trim().toLowerCase();
  const tMech2 = target.mechanic2.trim().toLowerCase();

  if (gMech1 === tMech1) {
    return {
      value: guess.mechanic1,
      status: 'EXACT',
      subtext: 'Hauptmechanik 1 stimmt exakt!'
    };
  }

  if (gMech1 === tMech2) {
    return {
      value: guess.mechanic1,
      status: 'PARTIAL',
      subtext: 'Kommt vor, aber als Hauptmechanik 2!'
    };
  }

  return {
    value: guess.mechanic1,
    status: 'WRONG',
    subtext: 'Keine Übereinstimmung'
  };
}

function evaluateMechanic2(guess: BoardGame, target: BoardGame): CategoryResult {
  const gMech2 = guess.mechanic2.trim().toLowerCase();
  const tMech1 = target.mechanic1.trim().toLowerCase();
  const tMech2 = target.mechanic2.trim().toLowerCase();

  if (gMech2 === tMech2) {
    return {
      value: guess.mechanic2,
      status: 'EXACT',
      subtext: 'Hauptmechanik 2 stimmt exakt!'
    };
  }

  if (gMech2 === tMech1) {
    return {
      value: guess.mechanic2,
      status: 'PARTIAL',
      subtext: 'Kommt vor, aber als Hauptmechanik 1!'
    };
  }

  return {
    value: guess.mechanic2,
    status: 'WRONG',
    subtext: 'Keine Übereinstimmung'
  };
}

/**
 * Compare release year
 */
function evaluateReleaseYear(guess: BoardGame, target: BoardGame): CategoryResult {
  const diff = target.releaseYear - guess.releaseYear;

  if (diff === 0) {
    return {
      value: `${guess.releaseYear}`,
      status: 'EXACT',
      direction: 'NONE',
      subtext: 'Exaktes Erscheinungsjahr!'
    };
  }

  const direction: Direction = diff > 0 ? 'UP' : 'DOWN';
  const isPartial = Math.abs(diff) <= 5; // Within 5 years is yellow!

  return {
    value: `${guess.releaseYear}`,
    status: isPartial ? 'PARTIAL' : 'WRONG',
    direction,
    subtext: isPartial
      ? (direction === 'UP' ? 'Sehr nah dran (Ziel ist neuer ↑)' : 'Sehr nah dran (Ziel ist älter ↓)')
      : (direction === 'UP' ? 'Ziel ist deutlich neuer ↑' : 'Ziel ist deutlich älter ↓')
  };
}

/**
 * Compare BGG rank (Lower number is better rank, e.g. #1 > #50)
 */
function evaluateBggRank(guess: BoardGame, target: BoardGame): CategoryResult {
  if (guess.bggRank === target.bggRank) {
    return {
      value: `#${guess.bggRank}`,
      status: 'EXACT',
      direction: 'NONE',
      subtext: 'Exakte BGG-Platzierung!'
    };
  }

  // If target.bggRank < guess.bggRank, the target is higher placed (better ranking -> UP arrow)
  // If target.bggRank > guess.bggRank, the target is lower placed (worse ranking -> DOWN arrow)
  const direction: Direction = target.bggRank < guess.bggRank ? 'UP' : 'DOWN';
  const absDiff = Math.abs(guess.bggRank - target.bggRank);
  const isPartial = absDiff <= 40 || (guess.bggRank > 80 && absDiff <= guess.bggRank * 0.25);

  return {
    value: `#${guess.bggRank}`,
    status: isPartial ? 'PARTIAL' : 'WRONG',
    direction,
    subtext: isPartial
      ? (direction === 'UP' ? 'Nah dran! Ziel ist besser platziert (↑)' : 'Nah dran! Ziel ist weiter hinten platziert (↓)')
      : (direction === 'UP' ? 'Ziel ist besser platziert (↑)' : 'Ziel ist weiter hinten platziert (↓)')
  };
}

/**
 * Fully evaluate a guess against target game
 */
export function evaluateGuess(guess: BoardGame, target: BoardGame): GuessEvaluation {
  const titleMatch = guess.id === target.id;
  const players = evaluatePlayers(guess, target);
  const playtime = evaluatePlaytime(guess, target);
  const genre = evaluateGenre(guess, target);
  const designer = evaluateDesigner(guess, target);
  const mechanic1 = evaluateMechanic1(guess, target);
  const mechanic2 = evaluateMechanic2(guess, target);
  const releaseYear = evaluateReleaseYear(guess, target);
  const bggRank = evaluateBggRank(guess, target);

  const overallSuccess = titleMatch;

  return {
    game: guess,
    titleMatch,
    players,
    playtime,
    genre,
    designer,
    mechanic1,
    mechanic2,
    releaseYear,
    bggRank,
    overallSuccess
  };
}

/**
 * Format emoji share matrix for copying to clipboard (Pokédle / LoLdle style)
 */
export function generateShareText(
  mode: 'DAILY' | 'PRACTICE',
  puzzleNumber: number,
  guesses: GuessEvaluation[],
  won: boolean
): string {
  const statusToEmoji = (status: MatchStatus) => {
    switch (status) {
      case 'EXACT': return '🟩';
      case 'PARTIAL': return '🟨';
      case 'WRONG': return '🟥';
    }
  };

  const titleHeader = mode === 'DAILY' 
    ? `🎲 Brettspieldle #${puzzleNumber}` 
    : `🎲 Brettspieldle (Freies Spiel)`;

  const scoreText = won ? `${guesses.length} Versuche` : `X (nicht erraten)`;

  const lines = guesses.map(g => {
    return [
      g.titleMatch ? '🟩' : '🟥',
      statusToEmoji(g.players.status),
      statusToEmoji(g.playtime.status),
      statusToEmoji(g.genre.status),
      statusToEmoji(g.designer.status),
      statusToEmoji(g.mechanic1.status),
      statusToEmoji(g.mechanic2.status),
      statusToEmoji(g.releaseYear.status),
      statusToEmoji(g.bggRank.status)
    ].join('');
  });

  return `${titleHeader} 🎯 ${scoreText}\n\n${lines.join('\n')}\n\nSpiele kostenlos: https://brettspieldle.de`;
}
