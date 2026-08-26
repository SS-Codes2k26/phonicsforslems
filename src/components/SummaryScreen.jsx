import { AVATARS } from '../data/avatars'
import { BADGES } from '../data/badges'
import { useQuizState, useQuizDispatch } from '../context/QuizContext'

export default function SummaryScreen() {
  const { session, cumulative } = useQuizState()
  const dispatch = useQuizDispatch()
  const { teams } = session

  const ranked = [...teams].sort((a, b) => b.score - a.score)
  const cumulativeRanked = Object.entries(cumulative).sort((a, b) => b[1].score - a[1].score)

  return (
    <div className="screen summary-screen">
      <h1 className="app-title">🏆 Quiz Complete!</h1>

      <section className="setup-card">
        <h2>Final Round Results</h2>
        <ol className="summary-rankings">
          {ranked.map((t, i) => {
            const avatar = AVATARS.find((a) => a.id === t.avatarId)
            return (
              <li key={t.name} className="summary-rank-row" style={{ borderColor: t.color }}>
                <span className="summary-rank-position">#{i + 1}</span>
                <span className="summary-rank-avatar">{avatar?.emoji}</span>
                <span className="summary-rank-name">{t.name}</span>
                <span className="summary-rank-score">{t.score} pts</span>
                <span className="summary-rank-coins">🪙 {t.coins}</span>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="setup-card">
        <h2>Pattern Mastery</h2>
        {ranked.map((t) => (
          <div key={t.name} className="mastery-team-block">
            <strong style={{ color: t.color }}>{t.name}</strong>
            <div className="mastery-bars">
              {Object.keys(t.patternCorrect).map((p) => {
                const attempted = t.patternAttempted[p] || 0
                const correct = t.patternCorrect[p] || 0
                const pct = attempted ? Math.round((correct / attempted) * 100) : null
                return (
                  <div key={p} className="mastery-bar-row">
                    <span className="mastery-pattern-label">{p}</span>
                    <div className="mastery-bar-track">
                      <div className="mastery-bar-fill" style={{ width: `${pct ?? 0}%` }} />
                    </div>
                    <span className="mastery-pct">{pct === null ? '—' : `${pct}%`}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="setup-card">
        <h2>Badges Earned This Quiz</h2>
        {ranked.every((t) => t.badgeIds.length === 0) ? (
          <p>No badges earned this round — next time!</p>
        ) : (
          <div className="badge-earned-grid">
            {ranked.flatMap((t) =>
              t.badgeIds.map((bid) => {
                const badge = BADGES.find((b) => b.id === bid)
                if (!badge) return null
                return (
                  <div key={`${t.name}-${bid}`} className="badge-earned-chip">
                    <span>{badge.emoji}</span>
                    <span>
                      {t.name}: {badge.name}
                    </span>
                  </div>
                )
              }),
            )}
          </div>
        )}
      </section>

      <section className="setup-card">
        <h2>Cumulative Leaderboard (All-Time)</h2>
        <ol className="cumulative-list">
          {cumulativeRanked.map(([name, data]) => (
            <li key={name}>
              <span>{name}</span>
              <span>{data.score} pts</span>
            </li>
          ))}
        </ol>
      </section>

      <button type="button" className="btn-primary btn-big" onClick={() => dispatch({ type: 'RESTART' })}>
        Play Again 🔁
      </button>
    </div>
  )
}
