import { QuizProvider, useQuizState } from './context/QuizContext'
import SetupScreen from './components/SetupScreen'
import QuizScreen from './components/QuizScreen'
import SummaryScreen from './components/SummaryScreen'
import './App.css'

function Router() {
  const { screen } = useQuizState()
  if (screen === 'play') return <QuizScreen />
  if (screen === 'summary') return <SummaryScreen />
  return <SetupScreen />
}

export default function App() {
  return (
    <QuizProvider>
      <Router />
    </QuizProvider>
  )
}
