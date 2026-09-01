import { useEffect } from 'react'
import { speakWord, speakSentence, speechSupported } from '../utils/speech'

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionCard({ question, revealed }) {
  const isIdentifyObject = question.type === 'identify-object'
  const isSentence = question.type === 'sentence'
  const isAudioPrompt = question.format === 'audio'
  const showEmoji = question.format === 'picture'

  useEffect(() => {
    if (isAudioPrompt) {
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

  // The target word's text is never shown until the answer is revealed - showing it
  // earlier would make multiple-choice/typing trivial (the answer would be right there).
  const showWord = revealed && !isSentence

  return (
    <div className="question-card">
      <div className="question-meta">
        <span className="question-pattern-badge">{question.pattern}</span>
        <span className="question-type-badge">
          {question.type === 'multiple-choice' && 'Multiple Choice'}
          {question.type === 'typing' && 'Type the Word'}
          {question.type === 'audio-identify' && 'Listen & Choose'}
          {question.type === 'identify-object' && '🖼️ Identify the Object'}
          {isSentence && '📖 Finish the Sentence'}
        </span>
      </div>

      {showEmoji && <div className="question-emoji">{question.emoji}</div>}
      {showWord && <div className="question-word">{question.word}</div>}
      {isAudioPrompt && !revealed && <div className="question-word question-word-hidden">🔊 Listen carefully!</div>}
      {showEmoji && !revealed && <div className="question-word question-word-hidden">What is this?</div>}

      {isSentence && (
        <div className="question-sentence">
          {revealed
            ? question.sentence.split(new RegExp(`(${question.word})`, 'i')).map((part, i) =>
                part.toLowerCase() === question.word.toLowerCase() ? (
                  <strong key={i} className="sentence-answer">
                    {part}
                  </strong>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )
            : question.blankedSentence}
        </div>
      )}

      {speechSupported() && !isIdentifyObject && !isSentence && (
        <button type="button" className="btn-speak" onClick={() => speakWord(question.word)}>
          🔊 Play Sound
        </button>
      )}
      {isSentence && revealed && speechSupported() && (
        <button type="button" className="btn-speak" onClick={() => speakSentence(question.sentence)}>
          🔊 Play Sentence
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
