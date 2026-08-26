import { AVATARS } from '../data/avatars'

export default function Leaderboard({ teams }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score)
  const maxScore = Math.max(1, ...teams.map((t) => t.score))

  return (
    <aside className="leaderboard">
      <h3>Leaderboard</h3>
      <ul className="leaderboard-list">
        {sorted.map((t, i) => {
          const avatar = AVATARS.find((a) => a.id === t.avatarId)
          return (
            <li key={t.name} className="leaderboard-row">
              <span className="leaderboard-rank">{i + 1}</span>
              <span className="leaderboard-avatar">{avatar?.emoji}</span>
              <div className="leaderboard-bar-wrap">
                <span className="leaderboard-name" style={{ color: t.color }}>
                  {t.name}
                </span>
                <div className="leaderboard-bar-track">
                  <div
                    className="leaderboard-bar-fill"
                    style={{ width: `${(t.score / maxScore) * 100}%`, background: t.color }}
                  />
                </div>
              </div>
              <span className="leaderboard-score">{t.score}</span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
