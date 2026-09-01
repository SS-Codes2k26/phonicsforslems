import { useState } from 'react'
import { PATTERNS } from '../data/wordBanks'
import { AVATARS, DEFAULT_AVATAR_IDS } from '../data/avatars'
import { useQuizState, useQuizDispatch } from '../context/QuizContext'

const TEAM_COLORS = ['#ff5c7a', '#4da6ff', '#ffca3a', '#5fd97a', '#b980f0', '#ff9f4d']
const QUESTION_TYPE_OPTIONS = [
  { id: 'identify-object', label: '🖼️ Identify the Object' },
  { id: 'multiple-choice', label: 'Multiple Choice' },
  { id: 'typing', label: 'Typing' },
  { id: 'audio-identify', label: 'Listen & Choose' },
  { id: 'sentence', label: '📖 Finish the Sentence' },
]

function makeDefaultTeams(count) {
  return Array.from({ length: count }, (_, i) => ({
    name: `Team ${i + 1}`,
    color: TEAM_COLORS[i % TEAM_COLORS.length],
    avatarId: DEFAULT_AVATAR_IDS[i % DEFAULT_AVATAR_IDS.length],
    kids: [],
  }))
}

export default function SetupScreen() {
  const { cumulative } = useQuizState()
  const dispatch = useQuizDispatch()
  const [patterns, setPatterns] = useState(['CVC'])
  const [teamCount, setTeamCount] = useState(3)
  const [teams, setTeams] = useState(makeDefaultTeams(3))
  const [kidDrafts, setKidDrafts] = useState(Array(3).fill(''))
  const [questionsPerTeam, setQuestionsPerTeam] = useState(10)
  const [questionTypes, setQuestionTypes] = useState([
    'identify-object',
    'multiple-choice',
    'typing',
    'audio-identify',
    'sentence',
  ])
  const [startingTier, setStartingTier] = useState(1)
  const [showCumulative, setShowCumulative] = useState(false)

  function updateTeamCount(count) {
    setTeamCount(count)
    setTeams((prev) => {
      if (count > prev.length) return [...prev, ...makeDefaultTeams(count).slice(prev.length)]
      return prev.slice(0, count)
    })
    setKidDrafts((prev) => {
      if (count > prev.length) return [...prev, ...Array(count - prev.length).fill('')]
      return prev.slice(0, count)
    })
  }

  function updateTeamName(index, name) {
    setTeams((prev) => prev.map((t, i) => (i === index ? { ...t, name } : t)))
  }

  function updateTeamAvatar(index, avatarId) {
    setTeams((prev) => prev.map((t, i) => (i === index ? { ...t, avatarId } : t)))
  }

  function addKid(index) {
    const name = kidDrafts[index].trim()
    if (!name) return
    setTeams((prev) => prev.map((t, i) => (i === index ? { ...t, kids: [...t.kids, name] } : t)))
    setKidDrafts((prev) => prev.map((d, i) => (i === index ? '' : d)))
  }

  function removeKid(teamIndex, kidIndex) {
    setTeams((prev) =>
      prev.map((t, i) => (i === teamIndex ? { ...t, kids: t.kids.filter((_, ki) => ki !== kidIndex) } : t)),
    )
  }

  function togglePattern(p) {
    setPatterns((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }

  function toggleQuestionType(id) {
    setQuestionTypes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function canStart() {
    return (
      patterns.length > 0 &&
      questionTypes.length > 0 &&
      teams.every((t) => t.name.trim().length > 0 && t.kids.length > 0)
    )
  }

  function handleStart() {
    if (!canStart()) return
    dispatch({
      type: 'START_QUIZ',
      config: { patterns, teams, questionsPerTeam, questionTypes, startingTier },
    })
  }

  const cumulativeRows = Object.entries(cumulative).sort((a, b) => b[1].score - a[1].score)

  return (
    <div className="screen setup-screen">
      <h1 className="app-title">🔤 Phonics Quest</h1>
      <p className="app-subtitle">Set up your class quiz</p>

      <section className="setup-card">
        <h2>Word Patterns</h2>
        <div className="chip-row">
          {PATTERNS.map((p) => (
            <button
              key={p}
              className={`chip ${patterns.includes(p) ? 'chip-active' : ''}`}
              onClick={() => togglePattern(p)}
              type="button"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="setup-card">
        <h2>Teams &amp; Players</h2>
        <p className="setup-hint">Each question goes to one team at a time, answered by a randomly picked kid from that team.</p>
        <label className="field-inline">
          Number of teams
          <input
            type="number"
            min={2}
            max={6}
            value={teamCount}
            onChange={(e) => updateTeamCount(Math.max(2, Math.min(6, Number(e.target.value) || 2)))}
          />
        </label>
        <div className="team-editor-list">
          {teams.map((t, i) => (
            <div className="team-editor-block" key={i} style={{ borderColor: t.color }}>
              <div className="team-editor-row">
                <span className="team-avatar-preview">{AVATARS.find((a) => a.id === t.avatarId)?.emoji}</span>
                <input
                  className="team-name-input"
                  value={t.name}
                  onChange={(e) => updateTeamName(i, e.target.value)}
                  maxLength={20}
                />
                <select value={t.avatarId} onChange={(e) => updateTeamAvatar(i, e.target.value)}>
                  {AVATARS.filter((a) => a.cost === 0).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.emoji} {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="kid-chip-row">
                {t.kids.map((name, ki) => (
                  <span key={`${name}-${ki}`} className="kid-chip">
                    {name}
                    <button type="button" className="kid-chip-remove" onClick={() => removeKid(i, ki)} aria-label={`Remove ${name}`}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <form
                className="kid-add-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  addKid(i)
                }}
              >
                <input
                  type="text"
                  placeholder="Add a kid's name..."
                  value={kidDrafts[i] ?? ''}
                  onChange={(e) => setKidDrafts((prev) => prev.map((d, di) => (di === i ? e.target.value : d)))}
                  maxLength={30}
                />
                <button type="submit" className="btn-secondary">
                  Add
                </button>
              </form>
              {t.kids.length === 0 && <div className="kid-empty-warning">Add at least one kid to this team</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="setup-card">
        <h2>Question Types</h2>
        <div className="chip-row">
          {QUESTION_TYPE_OPTIONS.map((q) => (
            <button
              key={q.id}
              className={`chip ${questionTypes.includes(q.id) ? 'chip-active' : ''}`}
              onClick={() => toggleQuestionType(q.id)}
              type="button"
            >
              {q.label}
            </button>
          ))}
        </div>
      </section>

      <section className="setup-card setup-card-row">
        <label className="field-inline">
          Questions per team
          <input
            type="number"
            min={3}
            max={30}
            value={questionsPerTeam}
            onChange={(e) => setQuestionsPerTeam(Math.max(3, Math.min(30, Number(e.target.value) || 3)))}
          />
        </label>
        <label className="field-inline">
          Starting difficulty
          <select value={startingTier} onChange={(e) => setStartingTier(Number(e.target.value))}>
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </select>
        </label>
      </section>

      <button className="btn-primary btn-big" disabled={!canStart()} onClick={handleStart}>
        Start Quiz 🚀
      </button>

      {cumulativeRows.length > 0 && (
        <section className="setup-card">
          <button className="link-toggle" onClick={() => setShowCumulative((s) => !s)} type="button">
            {showCumulative ? 'Hide' : 'Show'} cumulative leaderboard ({cumulativeRows.length} teams)
          </button>
          {showCumulative && (
            <ol className="cumulative-list">
              {cumulativeRows.map(([name, data]) => (
                <li key={name}>
                  <span>{name}</span>
                  <span>{data.score} pts</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  )
}
