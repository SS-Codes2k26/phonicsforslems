import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import {
  pickQuestion,
  nextTier,
  emptyPatternCorrectMap,
  pointsForPassCount,
  pickEligibleKid,
  nextOwnerIndex,
  MAX_PASSES,
} from '../utils/quizEngine'
import { checkNewBadges } from '../data/badges'
import { loadCumulative, saveCumulative, mergeTeamRecord, spendCoinsInRecord } from '../utils/storage'

const QuizStateContext = createContext(null)
const QuizDispatchContext = createContext(null)

function makeRoster(kidNames) {
  return kidNames.map((name, i) => ({ id: `${i}-${name}`, name, answeredCount: 0, correctCount: 0 }))
}

function makeTeamSessionState(team, patterns, questionsPerTeam) {
  return {
    name: team.name,
    color: team.color,
    avatarId: team.avatarId,
    roster: makeRoster(team.kids),
    remainingQuestions: questionsPerTeam,
    score: 0,
    coins: 0,
    streak: 0,
    bestStreak: 0,
    missStreak: 0,
    hadComeback: false,
    correct: 0,
    attempted: 0,
    fastestMs: null,
    patternCorrect: emptyPatternCorrectMap(patterns),
    patternAttempted: emptyPatternCorrectMap(patterns),
    badgeIds: [],
    lastPoints: 0,
    lastCoins: 0,
  }
}

function initialState() {
  return {
    screen: 'setup',
    config: null,
    session: null,
    newBadges: [],
    cumulative: loadCumulative(),
  }
}

function drawFreshTurn(teams, ownerIndex, tier, config, usedWords) {
  const question = pickQuestion({ patterns: config.patterns, tier, questionTypes: config.questionTypes, usedWords })
  const kid = pickEligibleKid(teams[ownerIndex].roster)
  return {
    question,
    ownerTeamIndex: ownerIndex,
    currentTeamIndex: ownerIndex,
    passCount: 0,
    kidId: kid?.id ?? null,
    kidName: kid?.name ?? null,
    turnStartedAt: Date.now(),
  }
}

function startSession(config) {
  const tier = config.startingTier
  const teams = config.teams.map((t) => makeTeamSessionState(t, config.patterns, config.questionsPerTeam))
  teams[0] = { ...teams[0], remainingQuestions: teams[0].remainingQuestions - 1 }
  const active = drawFreshTurn(teams, 0, tier, config, [])
  return {
    teams,
    tier,
    rollingAccuracy: [],
    usedWords: [active.question.word],
    active,
    turnResult: null,
  }
}

// The reducer must stay pure (no localStorage/network I/O): React can invoke it more
// than once per dispatch (e.g. StrictMode's dev-only double-invoke to catch impurities).
// Cumulative totals live in state.cumulative and are persisted by an effect in
// QuizProvider, so recomputing them here never double-counts.
function reducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ': {
      return {
        ...state,
        screen: 'play',
        config: action.config,
        session: startSession(action.config),
        newBadges: [],
      }
    }

    // A kid attempts the active question. `answer: null` means they used the Pass button.
    case 'ANSWER_TURN': {
      const s = state.session
      if (s.turnResult) return state
      const { active, teams } = s
      const team = teams[active.currentTeamIndex]

      const passed = action.answer === null
      const normalized = passed ? '' : action.answer.toString().trim().toLowerCase()
      const isCorrect = !passed && normalized === active.question.word.toLowerCase()
      const elapsedMs = Date.now() - active.turnStartedAt

      const points = isCorrect ? pointsForPassCount(active.passCount) : 0
      const coins = isCorrect ? Math.max(1, Math.round(points / 5)) : 0

      const updatedRoster = team.roster.map((k) =>
        k.id === active.kidId ? { ...k, answeredCount: k.answeredCount + 1, correctCount: k.correctCount + (isCorrect ? 1 : 0) } : k,
      )

      const streak = isCorrect ? team.streak + 1 : 0
      const bestStreak = Math.max(team.bestStreak, streak)
      const missStreak = isCorrect ? 0 : team.missStreak + 1
      const hadComeback = team.hadComeback || (isCorrect && team.missStreak >= 2)

      const patternCorrect = { ...team.patternCorrect }
      if (isCorrect) patternCorrect[active.question.pattern] = (patternCorrect[active.question.pattern] || 0) + 1
      const patternAttempted = { ...team.patternAttempted }
      patternAttempted[active.question.pattern] = (patternAttempted[active.question.pattern] || 0) + 1

      const fastestMs = isCorrect ? Math.min(team.fastestMs ?? Infinity, elapsedMs) : team.fastestMs

      const stats = {
        correct: team.correct + (isCorrect ? 1 : 0),
        attempted: team.attempted + 1,
        streak,
        bestStreak,
        fastestMs: fastestMs === Infinity ? null : fastestMs,
        patternCorrect,
        hadComeback,
      }
      const earned = checkNewBadges(stats, team.badgeIds)
      const newBadges = earned.map((b) => ({ teamName: team.name, badge: b }))

      const updatedTeam = {
        ...team,
        roster: updatedRoster,
        score: team.score + points,
        coins: team.coins + coins,
        streak,
        bestStreak,
        missStreak,
        hadComeback,
        correct: stats.correct,
        attempted: stats.attempted,
        fastestMs: stats.fastestMs,
        patternCorrect,
        patternAttempted,
        badgeIds: [...team.badgeIds, ...earned.map((b) => b.id)],
        lastPoints: points,
        lastCoins: coins,
      }
      const updatedTeams = teams.map((t, i) => (i === active.currentTeamIndex ? updatedTeam : t))

      const givingUp = !isCorrect && active.passCount >= MAX_PASSES
      const resolved = isCorrect || givingUp

      const turnResult = {
        outcome: passed ? 'passed' : isCorrect ? 'correct' : 'wrong',
        resolved,
        correctWord: active.question.word,
        points,
        coins,
        teamName: team.name,
        kidName: active.kidName,
      }

      if (!resolved) {
        const nextTeamIndex = (active.currentTeamIndex + 1) % updatedTeams.length
        const nextKid = pickEligibleKid(updatedTeams[nextTeamIndex].roster)
        return {
          ...state,
          session: {
            ...s,
            teams: updatedTeams,
            active: {
              ...active,
              currentTeamIndex: nextTeamIndex,
              passCount: active.passCount + 1,
              kidId: nextKid?.id ?? null,
              kidName: nextKid?.name ?? null,
              turnStartedAt: Date.now(),
            },
            turnResult,
          },
          newBadges,
        }
      }

      const nextRolling = [...s.rollingAccuracy, isCorrect ? 1 : 0].slice(-5)
      return {
        ...state,
        session: { ...s, teams: updatedTeams, rollingAccuracy: nextRolling, turnResult },
        newBadges,
      }
    }

    case 'DISMISS_BADGE_TOAST': {
      return { ...state, newBadges: state.newBadges.filter((b) => b !== action.badge) }
    }

    // Called after the teacher has seen the turn result. If the active question wasn't
    // resolved yet (it just passed to another team), simply clears the banner - the
    // rotation already happened in ANSWER_TURN. Otherwise draws a brand new question.
    case 'CONTINUE': {
      const s = state.session
      if (!s.turnResult) return state

      if (!s.turnResult.resolved) {
        return { ...state, session: { ...s, turnResult: null } }
      }

      const tier = nextTier(s.tier, s.rollingAccuracy)
      const owner = nextOwnerIndex(s.teams, s.active.ownerTeamIndex)

      if (owner === null) {
        const cumulative = s.teams.reduce(
          (record, t) =>
            mergeTeamRecord(record, t.name, {
              scoreGained: t.score,
              coinsGained: t.coins,
              newBadgeIds: t.badgeIds,
            }),
          state.cumulative,
        )
        return { ...state, screen: 'summary', cumulative }
      }

      const teams = s.teams.map((t, i) => (i === owner ? { ...t, remainingQuestions: t.remainingQuestions - 1 } : t))
      const active = drawFreshTurn(teams, owner, tier, state.config, s.usedWords)

      return {
        ...state,
        session: {
          ...s,
          teams,
          tier,
          usedWords: [...s.usedWords, active.question.word],
          active,
          turnResult: null,
        },
      }
    }

    case 'EQUIP_AVATAR': {
      const { teamName, avatarId, cost } = action
      const team = state.session.teams.find((t) => t.name === teamName)
      if (!team || (cost > 0 && team.coins < cost)) return state

      const teams = state.session.teams.map((t) => (t.name === teamName ? { ...t, coins: t.coins - cost, avatarId } : t))
      const cumulative = cost > 0 ? spendCoinsInRecord(state.cumulative, teamName, avatarId, cost) : state.cumulative

      return { ...state, session: { ...state.session, teams }, cumulative }
    }

    case 'RESTART': {
      return initialState()
    }

    default:
      return state
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const lastSaved = useRef(null)

  useEffect(() => {
    if (lastSaved.current === state.cumulative) return
    lastSaved.current = state.cumulative
    saveCumulative(state.cumulative)
  }, [state.cumulative])

  return (
    <QuizStateContext.Provider value={state}>
      <QuizDispatchContext.Provider value={dispatch}>{children}</QuizDispatchContext.Provider>
    </QuizStateContext.Provider>
  )
}

export function useQuizState() {
  const ctx = useContext(QuizStateContext)
  if (!ctx) throw new Error('useQuizState must be used within QuizProvider')
  return ctx
}

export function useQuizDispatch() {
  const ctx = useContext(QuizDispatchContext)
  if (!ctx) throw new Error('useQuizDispatch must be used within QuizProvider')
  return ctx
}
