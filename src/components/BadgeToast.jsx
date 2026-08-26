import { useEffect } from 'react'
import { useQuizDispatch } from '../context/QuizContext'

function Toast({ item }) {
  const dispatch = useQuizDispatch()

  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'DISMISS_BADGE_TOAST', badge: item }), 3500)
    return () => clearTimeout(t)
  }, [item])

  return (
    <div className="badge-toast">
      <span className="badge-toast-emoji">{item.badge.emoji}</span>
      <div>
        <div className="badge-toast-title">{item.teamName} earned a badge!</div>
        <div className="badge-toast-name">{item.badge.name}</div>
      </div>
    </div>
  )
}

export default function BadgeToast({ items }) {
  if (!items.length) return null
  return (
    <div className="badge-toast-stack">
      {items.map((item, i) => (
        <Toast key={`${item.teamName}-${item.badge.id}-${i}`} item={item} />
      ))}
    </div>
  )
}
