// Built-in word banks for each phonics pattern.
// tier: 1 = easy, 2 = medium, 3 = hard (within the pattern)
// sentence: a simple, decodable sentence using the word - powers the
// "Finish the Sentence" question type so kids can practice the word in context.
export const PATTERNS = ['CVC', 'CVCC', 'CCVC']

export const WORD_BANK = [
  // --- CVC ---
  { word: 'cat', pattern: 'CVC', tier: 1, emoji: '🐱', sentence: 'The cat sat on the mat.' },
  { word: 'dog', pattern: 'CVC', tier: 1, emoji: '🐶', sentence: 'The dog ran to me.' },
  { word: 'sun', pattern: 'CVC', tier: 1, emoji: '☀️', sentence: 'The sun is hot.' },
  { word: 'hat', pattern: 'CVC', tier: 1, emoji: '🎩', sentence: 'I have a red hat.' },
  { word: 'pig', pattern: 'CVC', tier: 1, emoji: '🐷', sentence: 'The pig is pink.' },
  { word: 'bed', pattern: 'CVC', tier: 1, emoji: '🛏️', sentence: 'I jump on the bed.' },
  { word: 'cup', pattern: 'CVC', tier: 1, emoji: '☕', sentence: 'She has a big cup.' },
  { word: 'bus', pattern: 'CVC', tier: 1, emoji: '🚌', sentence: 'We ride the bus.' },
  { word: 'sit', pattern: 'CVC', tier: 2, emoji: '🪑', sentence: 'Please sit down now.' },
  { word: 'run', pattern: 'CVC', tier: 2, emoji: '🏃', sentence: 'We run in the sun.' },
  { word: 'map', pattern: 'CVC', tier: 2, emoji: '🗺️', sentence: 'He has a big map.' },
  { word: 'fox', pattern: 'CVC', tier: 2, emoji: '🦊', sentence: 'The fox is fast.' },
  { word: 'pen', pattern: 'CVC', tier: 2, emoji: '🖊️', sentence: 'I write with a pen.' },
  { word: 'net', pattern: 'CVC', tier: 2, emoji: '🥅', sentence: 'The fish is in the net.' },
  { word: 'log', pattern: 'CVC', tier: 2, emoji: '🪵', sentence: 'The frog sat on a log.' },
  { word: 'web', pattern: 'CVC', tier: 3, emoji: '🕸️', sentence: 'The bug is in the web.' },
  { word: 'jam', pattern: 'CVC', tier: 3, emoji: '🍓', sentence: 'I eat toast and jam.' },
  { word: 'wig', pattern: 'CVC', tier: 3, emoji: '👨‍🦲', sentence: 'The clown wears a wig.' },
  { word: 'zip', pattern: 'CVC', tier: 3, emoji: '🤐', sentence: 'Can you zip your bag?' },
  { word: 'mud', pattern: 'CVC', tier: 3, emoji: '🟤', sentence: 'The pig plays in the mud.' },

  // --- CVCC ---
  { word: 'nest', pattern: 'CVCC', tier: 1, emoji: '🪺', sentence: 'The bird sat in the nest.' },
  { word: 'hand', pattern: 'CVCC', tier: 1, emoji: '✋', sentence: 'I hold it in my hand.' },
  { word: 'fish', pattern: 'CVCC', tier: 1, emoji: '🐟', sentence: 'The fish can swim fast.' },
  { word: 'milk', pattern: 'CVCC', tier: 1, emoji: '🥛', sentence: 'I drink milk at lunch.' },
  { word: 'lamp', pattern: 'CVCC', tier: 1, emoji: '💡', sentence: 'Turn on the lamp please.' },
  { word: 'duck', pattern: 'CVCC', tier: 1, emoji: '🦆', sentence: 'The duck swims in the pond.' },
  { word: 'best', pattern: 'CVCC', tier: 2, emoji: '🥇', sentence: 'This is the best day.' },
  { word: 'jump', pattern: 'CVCC', tier: 2, emoji: '🤸', sentence: 'The frog can jump high.' },
  { word: 'list', pattern: 'CVCC', tier: 2, emoji: '📝', sentence: 'Mom made a long list.' },
  { word: 'tent', pattern: 'CVCC', tier: 2, emoji: '⛺', sentence: 'We slept in a tent.' },
  { word: 'sock', pattern: 'CVCC', tier: 2, emoji: '🧦', sentence: 'I lost my other sock.' },
  { word: 'ring', pattern: 'CVCC', tier: 2, emoji: '💍', sentence: 'She wears a gold ring.' },
  { word: 'desk', pattern: 'CVCC', tier: 3, emoji: '🪑', sentence: 'My book is on the desk.' },
  { word: 'bump', pattern: 'CVCC', tier: 3, emoji: '🤕', sentence: 'I got a bump on my head.' },
  { word: 'wind', pattern: 'CVCC', tier: 3, emoji: '🌬️', sentence: 'The wind is very strong.' },
  { word: 'lunch', pattern: 'CVCC', tier: 3, emoji: '🍱', sentence: 'We eat lunch at noon.' },

  // --- CCVC ---
  { word: 'step', pattern: 'CCVC', tier: 1, emoji: '🪜', sentence: 'Watch your step here.' },
  { word: 'stop', pattern: 'CCVC', tier: 1, emoji: '🛑', sentence: 'The car has to stop.' },
  { word: 'flag', pattern: 'CCVC', tier: 1, emoji: '🚩', sentence: 'The flag is red and blue.' },
  { word: 'frog', pattern: 'CCVC', tier: 1, emoji: '🐸', sentence: 'The frog can jump far.' },
  { word: 'crab', pattern: 'CCVC', tier: 1, emoji: '🦀', sentence: 'The crab walks on the sand.' },
  { word: 'slip', pattern: 'CCVC', tier: 2, emoji: '🧴', sentence: 'Do not slip on the ice.' },
  { word: 'snack', pattern: 'CCVC', tier: 2, emoji: '🍿', sentence: 'I want a snack now.' },
  { word: 'plan', pattern: 'CCVC', tier: 2, emoji: '📋', sentence: 'We made a fun plan.' },
  { word: 'clap', pattern: 'CCVC', tier: 2, emoji: '👏', sentence: 'Please clap your hands.' },
  { word: 'drum', pattern: 'CCVC', tier: 2, emoji: '🥁', sentence: 'He can play the drum.' },
  { word: 'swim', pattern: 'CCVC', tier: 3, emoji: '🏊', sentence: 'We swim in the pool.' },
  { word: 'spot', pattern: 'CCVC', tier: 3, emoji: '🐆', sentence: 'The dog has a black spot.' },
  { word: 'grin', pattern: 'CCVC', tier: 3, emoji: '😁', sentence: 'She had a big grin.' },
  { word: 'trip', pattern: 'CCVC', tier: 3, emoji: '🧳', sentence: 'We went on a trip.' },
  { word: 'flat', pattern: 'CCVC', tier: 3, emoji: '🏠', sentence: 'The tire is flat.' },
]

export function wordsForPatterns(patterns) {
  return WORD_BANK.filter((w) => patterns.includes(w.pattern))
}

export function wordsForTier(patterns, tier) {
  const pool = wordsForPatterns(patterns).filter((w) => w.tier === tier)
  return pool.length ? pool : wordsForPatterns(patterns)
}
