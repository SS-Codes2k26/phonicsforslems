// Built-in word banks for each phonics pattern.
// tier: 1 = easy, 2 = medium, 3 = hard (within the pattern)
export const PATTERNS = ['CVC', 'CVCC', 'CCVC']

export const WORD_BANK = [
  // --- CVC ---
  { word: 'cat', pattern: 'CVC', tier: 1, emoji: '🐱' },
  { word: 'dog', pattern: 'CVC', tier: 1, emoji: '🐶' },
  { word: 'sun', pattern: 'CVC', tier: 1, emoji: '☀️' },
  { word: 'hat', pattern: 'CVC', tier: 1, emoji: '🎩' },
  { word: 'pig', pattern: 'CVC', tier: 1, emoji: '🐷' },
  { word: 'bed', pattern: 'CVC', tier: 1, emoji: '🛏️' },
  { word: 'cup', pattern: 'CVC', tier: 1, emoji: '☕' },
  { word: 'bus', pattern: 'CVC', tier: 1, emoji: '🚌' },
  { word: 'sit', pattern: 'CVC', tier: 2, emoji: '🪑' },
  { word: 'run', pattern: 'CVC', tier: 2, emoji: '🏃' },
  { word: 'map', pattern: 'CVC', tier: 2, emoji: '🗺️' },
  { word: 'fox', pattern: 'CVC', tier: 2, emoji: '🦊' },
  { word: 'pen', pattern: 'CVC', tier: 2, emoji: '🖊️' },
  { word: 'net', pattern: 'CVC', tier: 2, emoji: '🥅' },
  { word: 'log', pattern: 'CVC', tier: 2, emoji: '🪵' },
  { word: 'web', pattern: 'CVC', tier: 3, emoji: '🕸️' },
  { word: 'jam', pattern: 'CVC', tier: 3, emoji: '🍓' },
  { word: 'wig', pattern: 'CVC', tier: 3, emoji: '👨‍🦲' },
  { word: 'zip', pattern: 'CVC', tier: 3, emoji: '🤐' },
  { word: 'mud', pattern: 'CVC', tier: 3, emoji: '🟤' },

  // --- CVCC ---
  { word: 'nest', pattern: 'CVCC', tier: 1, emoji: '🪺' },
  { word: 'hand', pattern: 'CVCC', tier: 1, emoji: '✋' },
  { word: 'fish', pattern: 'CVCC', tier: 1, emoji: '🐟' },
  { word: 'milk', pattern: 'CVCC', tier: 1, emoji: '🥛' },
  { word: 'lamp', pattern: 'CVCC', tier: 1, emoji: '💡' },
  { word: 'duck', pattern: 'CVCC', tier: 1, emoji: '🦆' },
  { word: 'best', pattern: 'CVCC', tier: 2, emoji: '🥇' },
  { word: 'jump', pattern: 'CVCC', tier: 2, emoji: '🤸' },
  { word: 'list', pattern: 'CVCC', tier: 2, emoji: '📝' },
  { word: 'tent', pattern: 'CVCC', tier: 2, emoji: '⛺' },
  { word: 'sock', pattern: 'CVCC', tier: 2, emoji: '🧦' },
  { word: 'ring', pattern: 'CVCC', tier: 2, emoji: '💍' },
  { word: 'desk', pattern: 'CVCC', tier: 3, emoji: '🪑' },
  { word: 'bump', pattern: 'CVCC', tier: 3, emoji: '🤕' },
  { word: 'wind', pattern: 'CVCC', tier: 3, emoji: '🌬️' },
  { word: 'lunch', pattern: 'CVCC', tier: 3, emoji: '🍱' },

  // --- CCVC ---
  { word: 'step', pattern: 'CCVC', tier: 1, emoji: '🪜' },
  { word: 'stop', pattern: 'CCVC', tier: 1, emoji: '🛑' },
  { word: 'flag', pattern: 'CCVC', tier: 1, emoji: '🚩' },
  { word: 'frog', pattern: 'CCVC', tier: 1, emoji: '🐸' },
  { word: 'crab', pattern: 'CCVC', tier: 1, emoji: '🦀' },
  { word: 'slip', pattern: 'CCVC', tier: 2, emoji: '🧴' },
  { word: 'snack', pattern: 'CCVC', tier: 2, emoji: '🍿' },
  { word: 'plan', pattern: 'CCVC', tier: 2, emoji: '📋' },
  { word: 'clap', pattern: 'CCVC', tier: 2, emoji: '👏' },
  { word: 'drum', pattern: 'CCVC', tier: 2, emoji: '🥁' },
  { word: 'swim', pattern: 'CCVC', tier: 3, emoji: '🏊' },
  { word: 'spot', pattern: 'CCVC', tier: 3, emoji: '🐆' },
  { word: 'grin', pattern: 'CCVC', tier: 3, emoji: '😁' },
  { word: 'trip', pattern: 'CCVC', tier: 3, emoji: '🧳' },
  { word: 'flat', pattern: 'CCVC', tier: 3, emoji: '🏠' },
]

export function wordsForPatterns(patterns) {
  return WORD_BANK.filter((w) => patterns.includes(w.pattern))
}

export function wordsForTier(patterns, tier) {
  const pool = wordsForPatterns(patterns).filter((w) => w.tier === tier)
  return pool.length ? pool : wordsForPatterns(patterns)
}
