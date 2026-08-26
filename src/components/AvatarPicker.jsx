import { AVATARS } from '../data/avatars'
import { useQuizState, useQuizDispatch } from '../context/QuizContext'

export default function AvatarPicker({ team, onClose }) {
  const { cumulative } = useQuizState()
  const dispatch = useQuizDispatch()
  const owned = new Set(cumulative[team.name]?.unlockedAvatarIds || [])

  function pick(avatar) {
    const alreadyOwned = avatar.cost === 0 || owned.has(avatar.id)
    if (!alreadyOwned && team.coins < avatar.cost) return
    dispatch({ type: 'EQUIP_AVATAR', teamName: team.name, avatarId: avatar.id, cost: alreadyOwned ? 0 : avatar.cost })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>
          {team.name}'s Avatar Shop <span className="coin-count">🪙 {team.coins}</span>
        </h3>
        <div className="avatar-grid">
          {AVATARS.map((a) => {
            const alreadyOwned = a.cost === 0 || owned.has(a.id)
            const affordable = alreadyOwned || team.coins >= a.cost
            const equipped = team.avatarId === a.id
            return (
              <button
                key={a.id}
                type="button"
                className={`avatar-option ${equipped ? 'avatar-equipped' : ''} ${!affordable ? 'avatar-locked' : ''}`}
                onClick={() => pick(a)}
                disabled={!affordable}
              >
                <span className="avatar-option-emoji">{a.emoji}</span>
                <span className="avatar-option-name">{a.name}</span>
                {!alreadyOwned && <span className="avatar-option-cost">🪙 {a.cost}</span>}
                {equipped && <span className="avatar-equipped-badge">Equipped</span>}
              </button>
            )
          })}
        </div>
        <button type="button" className="btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
