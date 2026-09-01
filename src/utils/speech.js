function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.8
  utterance.pitch = 1.1
  window.speechSynthesis.speak(utterance)
}

export function speakWord(word) {
  speak(word)
}

export function speakSentence(sentence) {
  speak(sentence)
}

export function speechSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}
