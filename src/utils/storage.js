const CUMULATIVE_KEY = 'phonicsQuest.cumulativeTeams'

// Cumulative record shape: { [teamName]: { score, coins, badgeIds, unlockedAvatarIds } }
export function loadCumulative() {
  try {
    const raw = localStorage.getItem(CUMULATIVE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveCumulative(record) {
  try {
    localStorage.setItem(CUMULATIVE_KEY, JSON.stringify(record))
  } catch {
    // localStorage unavailable (private mode, quota) - fail silently, session still works in-memory
  }
}

// Pure helpers below compute a new record without touching localStorage, so they're
// safe to call from a reducer (React may invoke reducers more than once in dev).
// Persisting the result is the caller's job (see the effect in QuizContext).

function emptyTeamRecord() {
  return { score: 0, coins: 0, badgeIds: [], unlockedAvatarIds: [] }
}

export function mergeTeamRecord(record, teamName, delta) {
  const existing = record[teamName] || emptyTeamRecord()
  return {
    ...record,
    [teamName]: {
      score: existing.score + delta.scoreGained,
      coins: existing.coins + delta.coinsGained,
      badgeIds: Array.from(new Set([...existing.badgeIds, ...delta.newBadgeIds])),
      unlockedAvatarIds: existing.unlockedAvatarIds,
    },
  }
}

export function spendCoinsInRecord(record, teamName, avatarId, cost) {
  const existing = record[teamName] || emptyTeamRecord()
  if (existing.coins < cost) return record
  return {
    ...record,
    [teamName]: {
      ...existing,
      coins: existing.coins - cost,
      unlockedAvatarIds: Array.from(new Set([...existing.unlockedAvatarIds, avatarId])),
    },
  }
}
