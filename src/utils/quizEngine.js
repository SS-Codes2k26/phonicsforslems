import { wordsForTier } from '../data/wordBanks'

const FORMATS = ['visual', 'audio-visual', 'picture-word']

export const MAX_KID_TURNS = 3
export const PASS_POINT_TIERS = [10, 8, 6, 4]
export const MAX_PASSES = PASS_POINT_TIERS.length - 1

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Builds one question given the active patterns, current difficulty tier, allowed
// question types, and the words already used this session (to avoid repeats while pool allows).
export function pickQuestion({ patterns, tier, questionTypes, usedWords }) {
  const pool = wordsForTier(patterns, tier)
  const fresh = pool.filter((w) => !usedWords.includes(w.word))
  const candidates = fresh.length ? fresh : pool
  const target = pickRandom(candidates)

  const type = pickRandom(questionTypes)
  // "Identify the Object" is always a picture-first pronunciation-practice format.
  const format = type === 'identify-object' ? 'picture-word' : pickRandom(FORMATS)

  let options = null
  if (type === 'multiple-choice' || type === 'audio-identify' || type === 'identify-object') {
    const distractorPool = pool.filter((w) => w.word !== target.word)
    const distractors = shuffle(distractorPool).slice(0, 3)
    options = shuffle([target, ...distractors]).map((w) => w.word)
  }

  return {
    id: `${target.word}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    word: target.word,
    pattern: target.pattern,
    tier: target.tier,
    emoji: target.emoji,
    type, // 'multiple-choice' | 'typing' | 'audio-identify' | 'identify-object'
    format, // 'visual' | 'audio-visual' | 'picture-word'
    options,
  }
}

// Simplified whole-class adaptive difficulty: shift tier based on rolling accuracy.
export function nextTier(currentTier, rollingHistory) {
  if (rollingHistory.length < 3) return currentTier
  const accuracy = rollingHistory.reduce((a, b) => a + b, 0) / rollingHistory.length
  if (accuracy >= 0.8 && currentTier < 3) return currentTier + 1
  if (accuracy <= 0.4 && currentTier > 1) return currentTier - 1
  return currentTier
}

export function emptyPatternCorrectMap(patterns) {
  return Object.fromEntries(patterns.map((p) => [p, 0]))
}

// Points awarded for a correct answer depend on how many times the question has
// already been passed/missed by other teams: 10 / 8 / 6 / 4, floor at 4.
export function pointsForPassCount(passCount) {
  return PASS_POINT_TIERS[Math.min(passCount, MAX_PASSES)]
}

// Picks a random kid to take the next turn. Kids who haven't hit the per-round
// answer cap are preferred; if everyone on the team has, the round keeps moving
// by falling back to whoever has answered the fewest questions.
export function pickEligibleKid(roster) {
  if (!roster || !roster.length) return null
  const under = roster.filter((k) => k.answeredCount < MAX_KID_TURNS)
  if (under.length) return pickRandom(under)
  const min = Math.min(...roster.map((k) => k.answeredCount))
  return pickRandom(roster.filter((k) => k.answeredCount === min))
}

// Finds the next team (after fromIndex, wrapping) that still has fresh questions
// of its own left in this round. Returns null once every team is done.
export function nextOwnerIndex(teams, fromIndex) {
  const n = teams.length
  for (let step = 1; step <= n; step++) {
    const idx = (fromIndex + step) % n
    if (teams[idx].remainingQuestions > 0) return idx
  }
  return null
}
