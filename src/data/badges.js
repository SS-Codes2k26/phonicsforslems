// Badge definitions. `check` receives a team's session stats and returns true if earned.
// sessionStats: { correct, attempted, streak, bestStreak, fastestMs, patternCorrect: {CVC,CVCC,CCVC} }
export const BADGES = [
  {
    id: 'perfect-round',
    name: 'Perfect Round',
    emoji: '🌟',
    description: 'Answered every question correctly this quiz',
    check: (stats) => stats.attempted >= 3 && stats.correct === stats.attempted,
  },
  {
    id: 'phonics-master',
    name: 'Phonics Master',
    emoji: '🎓',
    description: 'Got 5 correct answers in a single pattern',
    check: (stats) => Object.values(stats.patternCorrect).some((n) => n >= 5),
  },
  {
    id: 'speedster',
    name: 'Speedster',
    emoji: '⚡',
    description: 'Answered correctly in under 3 seconds',
    check: (stats) => stats.fastestMs !== null && stats.fastestMs < 3000,
  },
  {
    id: 'streak-3',
    name: 'On a Roll',
    emoji: '🔥',
    description: '3 correct answers in a row',
    check: (stats) => stats.bestStreak >= 3,
  },
  {
    id: 'comeback',
    name: 'Comeback Kid',
    emoji: '💪',
    description: 'Bounced back with a correct answer after 2 misses in a row',
    check: (stats) => stats.hadComeback,
  },
]

export function checkNewBadges(stats, alreadyEarnedIds) {
  return BADGES.filter((b) => !alreadyEarnedIds.includes(b.id) && b.check(stats))
}
