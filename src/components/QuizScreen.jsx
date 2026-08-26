import { useState } from 'react'
import { useQuizState } from '../context/QuizContext'
import QuestionCard from './QuestionCard'
import TurnPanel from './TurnPanel'
import Leaderboard from './Leaderboard'
import BadgeToast from './BadgeToast'
import AvatarPicker from './AvatarPicker'
import { AVATARS } from '../data/avatars'

const TIER_LABELS = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }

export default function QuizScreen() {
  const { config, session, newBadges } = useQuizState()
  const [shopTeamName, setShopTeamName] = useState(null)

  const { active, teams, turnResult, tier } = session
  const ownerTeam = teams[active.ownerTeamIndex]
  const ownerQuestionNumber = config.questionsPerTeam - ownerTeam.remainingQuestions
  const activeTeamName = teams[active.currentTeamIndex].name
  const shopTeam = teams.find((t) => t.name === shopTeamName)

  return (
    <div className="screen quiz-screen">
      <header className="quiz-header">
        <div className="quiz-progress">
          {ownerTeam.name} — Question {ownerQuestionNumber} / {config.questionsPerTeam}
        </div>
        <div className="quiz-tier-badge">Difficulty: {TIER_LABELS[tier]}</div>
      </header>

      <div className="quiz-body">
        <div className="quiz-main">
          <QuestionCard question={active.question} revealed={!!turnResult} />
          <TurnPanel key={`${active.question.id}-${active.currentTeamIndex}-${active.passCount}`} />

          <div className="team-chip-strip">
            {teams.map((t) => {
              const avatar = AVATARS.find((a) => a.id === t.avatarId)
              return (
                <button
                  key={t.name}
                  type="button"
                  className={`team-strip-chip ${t.name === activeTeamName ? 'team-strip-active' : ''}`}
                  style={{ borderColor: t.color }}
                  onClick={() => setShopTeamName(t.name)}
                >
                  <span>{avatar?.emoji}</span> {t.name} · {t.score}pts 🎭
                </button>
              )
            })}
          </div>
        </div>

        <Leaderboard teams={teams} />
      </div>

      <BadgeToast items={newBadges} />

      {shopTeam && <AvatarPicker team={shopTeam} onClose={() => setShopTeamName(null)} />}
    </div>
  )
}
