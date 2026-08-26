import { useState } from 'react'
import { AVATARS } from '../data/avatars'
import { useQuizState, useQuizDispatch } from '../context/QuizContext'
import { pointsForPassCount } from '../utils/quizEngine'

const LETTERS = ['A', 'B', 'C', 'D']

// Keyed by the caller on question/team/passCount so a new turn always gets a
// fresh component instance instead of needing an effect to reset local state.
export default function TurnPanel() {
  const { session } = useQuizState()
  const dispatch = useQuizDispatch()
  const { active, turnResult, teams } = session
  const team = teams[active.currentTeamIndex]
  const avatar = AVATARS.find((a) => a.id === team.avatarId)
  const [typedValue, setTypedValue] = useState('')

  function submit(answer) {
    if (turnResult) return
    dispatch({ type: 'ANSWER_TURN', answer })
  }

  function handleTypeSubmit(e) {
    e.preventDefault()
    if (!typedValue.trim()) return
    submit(typedValue)
  }

  return (
    <div className="turn-panel" style={{ borderColor: team.color }}>
      <div className="turn-panel-header" style={{ background: team.color }}>
        <span className="turn-panel-avatar">{avatar?.emoji}</span>
        <div className="turn-panel-header-text">
          <span className="turn-panel-team">{team.name}'s turn</span>
          <span className="turn-panel-kid">🙋 {active.kidName ?? 'Anyone'}</span>
        </div>
        <span className="turn-panel-score">{team.score} pts</span>
      </div>

      <div className="turn-panel-body">
        {active.passCount > 0 && !turnResult && (
          <div className="turn-panel-pass-note">
            Passed {active.passCount}x already — worth {pointsForPassCount(active.passCount)} pts now
          </div>
        )}

        {turnResult ? (
          <div className="turn-result">
            <div className="turn-result-icon">
              {turnResult.outcome === 'correct' ? '✅' : turnResult.outcome === 'passed' ? '🙋' : '❌'}
            </div>
            <div className="turn-result-label">
              {turnResult.outcome === 'correct' && `${turnResult.teamName} got it right!`}
              {turnResult.outcome === 'wrong' && `Not quite, ${turnResult.teamName}!`}
              {turnResult.outcome === 'passed' && `${turnResult.teamName} passed.`}
            </div>
            {turnResult.outcome === 'correct' && (
              <div className="turn-result-points">
                +{turnResult.points} pts · +{turnResult.coins} 🪙
              </div>
            )}
            {!turnResult.resolved && <div className="turn-result-next">Passing to the next team...</div>}
            {turnResult.resolved && turnResult.outcome !== 'correct' && (
              <div className="turn-result-answer">
                The answer was: <strong>{turnResult.correctWord}</strong>
              </div>
            )}
            <button type="button" className="btn-primary btn-big" onClick={() => dispatch({ type: 'CONTINUE' })}>
              {!turnResult.resolved ? 'Next Team ➡️' : 'Next Question ➡️'}
            </button>
          </div>
        ) : active.question.options ? (
          <>
            <div className="turn-panel-choices">
              {active.question.options.map((opt, i) => (
                <button key={opt} type="button" className="turn-choice-btn" onClick={() => submit(opt)}>
                  <span className="turn-choice-letter">{LETTERS[i]}</span>
                  {opt}
                </button>
              ))}
            </div>
            <button type="button" className="btn-pass" onClick={() => submit(null)}>
              🙋 Pass
            </button>
          </>
        ) : (
          <>
            <form className="turn-panel-typing" onSubmit={handleTypeSubmit}>
              <input
                type="text"
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                placeholder="type the word..."
                autoComplete="off"
                autoFocus
              />
              <button type="submit">Lock In</button>
            </form>
            <button type="button" className="btn-pass" onClick={() => submit(null)}>
              🙋 Pass
            </button>
          </>
        )}
      </div>
    </div>
  )
}
