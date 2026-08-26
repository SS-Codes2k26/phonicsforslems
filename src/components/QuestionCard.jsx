import { useEffect } from 'react'
import { speakWord, speechSupported } from '../utils/speech'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionCard({ question, revealed }) {
  const isListenOnly = question.type === 'audio-identify'
  const isIdentifyObject = question.type === 'identify-object'

  useEffect(() => {
    if (isListenOnly || question.format === 'audio-visual') {
      const t = setTimeout(() => speakWord(question.word), 400)
      return () => clearTimeout(t)
    }
  }, [question.id])

  // Pronunciation-practice: model the correct pronunciation once the answer is revealed.
  useEffect(() => {
    if (isIdentifyObject && revealed) {
      const t = setTimeout(() => speakWord(question.word), 300)
      return () => clearTimeout(t)
    }
  }, [revealed, question.id])

  const showWord = !isListenOnly && !(isIdentifyObject && !revealed)
  const showEmoji = question.format === 'picture-word' || isIdentifyObject

  return (
    <div className="question-card">
      <div className="question-meta">
        <span className="question-pattern-badge">{question.pattern}</span>
        <span className="question-type-badge">
          {question.type === 'multiple-choice' && 'Multiple Choice'}
          {question.type === 'typing' && 'Type the Word'}
          {question.type === 'audio-identify' && 'Listen & Choose'}
          {question.type === 'identify-object' && '🖼️ Identify the Object'}
        </span>
      </div>

      {showEmoji && <div className="question-emoji">{question.emoji}</div>}
      {showWord && <div className="question-word">{question.word}</div>}
      {isListenOnly && <div className="question-word question-word-hidden">🔊 Listen carefully!</div>}
      {isIdentifyObject && !revealed && <div className="question-word question-word-hidden">What is this?</div>}

      {speechSupported() && !isIdentifyObject && (
        <button type="button" className="btn-speak" onClick={() => speakWord(question.word)}>
          🔊 Play Sound
        </button>
      )}

      {question.options && (
        <div className="question-options-reference">
          {question.options.map((opt, i) => (
            <div key={opt} className={`option-chip ${revealed && opt === question.word ? 'option-correct' : ''}`}>
              <span className="option-letter">{LETTERS[i]}</span>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
