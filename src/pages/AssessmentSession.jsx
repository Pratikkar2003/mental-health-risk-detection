import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from '../components/assessment/QuestionCard'
import MediaRecorderPanel from '../components/assessment/MediaRecorderPanel'
import { getQuestionSet } from '../data/questions'
import { useAuth } from '../context/AuthContext'
import { computeScreeningResult } from '../utils/score'

export default function AssessmentSession() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const questions = useMemo(() => getQuestionSet(session?.profile || {}), [session])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [mediaStatus, setMediaStatus] = useState('requesting')
  const startedAtRef = useRef(new Date())

  const question = questions[current]
  const answeredCount = Object.keys(answers).length
  const progress = Math.round(((current) / questions.length) * 100)

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1)
    } else {
      submit()
    }
  }

  const handleBack = () => setCurrent((c) => Math.max(0, c - 1))

  const submit = () => {
  const medicalReports = session?.profile?.medicalReports || []
  const result = computeScreeningResult(answers, {
    hasMedicalReports: medicalReports.length > 0,
    medicalReportCount: medicalReports.length,
  })
  const completedAt = new Date()
  const durationSeconds = Math.max(1, Math.round((completedAt - startedAtRef.current) / 1000))
  navigate('/assessments/result', {
    state: {
      result, answers, questions,
      completedAt: completedAt.toISOString(),
      durationSeconds,
      mediaAvailable: mediaStatus === 'recording',
      medicalReportCount: medicalReports.length,
    },
  })
}

  return (
    <div className="container section session-layout">
      <div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-label">{answeredCount} of {questions.length} answered</p>

        <QuestionCard
          question={question}
          index={current}
          total={questions.length}
          value={answers[question.id]}
          onAnswer={handleAnswer}
        />

        <div className="row gap-12" style={{ marginTop: 20, justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={handleBack} disabled={current === 0}>
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={answers[question.id] === undefined}
          >
            {current === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>

      <MediaRecorderPanel onStatusChange={setMediaStatus} />

      <style>{`
        .session-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; align-items: start; }
        .progress-track { height: 6px; border-radius: var(--radius-pill); background: var(--color-border); overflow: hidden; margin-bottom: 8px; }
        .progress-fill { height: 100%; background: var(--color-primary); transition: width 0.3s var(--ease-signal); }
        .progress-label { font-size: var(--fs-small); color: var(--color-text-secondary); margin-bottom: 20px; }

        @media (max-width: 920px) {
          .session-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
