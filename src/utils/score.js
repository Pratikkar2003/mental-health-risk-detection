// NOTE: This is a lightweight placeholder scorer for front-end demo purposes
// only. The real system replaces this with the ML/CV/NLP/speech pipeline
// described in the project proposal (questionnaire + audio + video fusion).

const CONDITIONS = ['Depression', 'Anxiety', 'PTSD', 'Bipolar Disorder', 'Schizophrenia', 'Dementia']

const INTERPRETATIONS = {
  Depression: {
    High: 'Strong indicators associated with depression.',
    Moderate: 'Moderate indicators of low mood and reduced interest.',
    Low: 'Low likelihood based on current screening.',
  },
  Anxiety: {
    High: 'Strong indicators of generalized anxiety.',
    Moderate: 'Moderate indicators of generalized anxiety.',
    Low: 'Some symptoms present, but below threshold.',
  },
  PTSD: {
    High: 'Strong indicators linked to a traumatic or stressful event.',
    Moderate: 'Some trauma-related symptoms present, worth review.',
    Low: 'Some symptoms present, but below threshold.',
  },
  'Bipolar Disorder': {
    High: 'Strong indicators of mood-energy shifts.',
    Moderate: 'Some indicators of mood-energy variability.',
    Low: 'Low likelihood based on current screening.',
  },
  Schizophrenia: {
    High: 'Indicators associated with thought-pattern changes warrant review.',
    Moderate: 'Mild indicators present, below clinical threshold.',
    Low: 'No significant indicators detected.',
  },
  Dementia: {
    High: 'Cognitive indicators warrant a follow-up evaluation.',
    Moderate: 'Mild cognitive indicators noted.',
    Low: 'No indication of cognitive decline.',
  },
}

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function riskFromScore(score) {
  return score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Low'
}

function buildKeyObservations(conditionScores, overallCategory) {
  const sorted = [...conditionScores].sort((a, b) => b.score - a.score)
  const top = sorted[0]
  const second = sorted[1]
  const observations = []

  if (top.risk === 'High') {
    observations.push(`${overallCategory === 'Very High' ? 'Marked' : 'Notable'} level of distress associated with ${top.condition.toLowerCase()} symptoms observed.`)
  } else if (top.risk === 'Moderate') {
    observations.push(`Moderate level of emotional distress and ${top.condition.toLowerCase()} symptoms observed.`)
  } else {
    observations.push('No strong indicators of elevated risk observed across screened domains.')
  }

  if (second && second.risk !== 'Low') {
    observations.push(`Indicators of ${second.condition.toLowerCase()} also present alongside ${top.condition.toLowerCase()} symptoms.`)
  } else {
    observations.push('Indicators of low mood, sleep, or energy changes noted from questionnaire responses.')
  }

  const psychosisRisk = conditionScores.find((c) => c.condition === 'Schizophrenia')?.risk
  observations.push(
    psychosisRisk === 'High'
      ? 'Indicators associated with thought-pattern changes were detected in this assessment.'
      : 'No strong indicators of psychotic features detected in this assessment.'
  )

  const dementiaRisk = conditionScores.find((c) => c.condition === 'Dementia')?.risk
  observations.push(
    dementiaRisk === 'Low'
      ? 'Cognitive orientation and memory responses are within normal range.'
      : 'Some cognitive/memory-related responses may benefit from further review.'
  )

  return observations
}

function buildClinicalSummary(conditionScores) {
  const dep = conditionScores.find((c) => c.condition === 'Depression')
  const anx = conditionScores.find((c) => c.condition === 'Anxiety')
  const ptsd = conditionScores.find((c) => c.condition === 'PTSD')

  return {
    emotional:
      dep?.risk === 'High' || anx?.risk === 'High'
        ? 'Low mood, anhedonia, and heightened worry present.'
        : dep?.risk === 'Moderate' || anx?.risk === 'Moderate'
        ? 'Low mood, mild anhedonia, and occasional irritability present.'
        : 'Mood and affect largely within expected range.',
    behavioural:
      dep?.risk !== 'Low'
        ? 'Reduced motivation and some social withdrawal reported.'
        : 'No significant behavioural changes reported.',
    cognitive: 'Mild concentration difficulty reported during questionnaire responses.',
    speech: 'Slightly reduced speech energy and moderate hesitation observed.',
    facial: 'Neutral to low affect, mild fatigue signs observed.',
    ptsdNote: ptsd?.risk !== 'Low' ? 'Some trauma-related response patterns noted.' : 'No significant trauma-response indicators noted.',
  }
}

function buildFollowUp(conditionScores) {
  const anyHigh = conditionScores.some((c) => c.risk === 'High')
  const anyModerate = conditionScores.some((c) => c.risk === 'Moderate')

  return [
    { label: 'Clinical interview and mental status examination', recommended: true },
    { label: 'Detailed psychiatric evaluation for mood and anxiety symptoms', recommended: anyHigh || anyModerate },
    { label: 'Consider standardized assessment tools (e.g., PHQ-9, GAD-7, PCL-5)', recommended: anyHigh || anyModerate },
    { label: 'Review personal, medical and psychiatric history', recommended: true },
    { label: 'Assess sleep pattern, stressors and functioning in daily life', recommended: true },
    { label: `Follow-up suggested after ${anyHigh ? '2-4 weeks' : '4-6 weeks'} or as clinically indicated`, recommended: true },
  ]
}

export function computeScreeningResult(answers = {}, context = {}) {
  const { hasMedicalReports = false, medicalReportCount = 0 } = context
  const answerValues = Object.values(answers)
  const answeredCount = answerValues.length
  const intensity =
    answerValues.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0) /
    Math.max(answeredCount, 1)

  const conditionScores = CONDITIONS.map((condition, i) => {
    const noise = seededRandom(i + intensity * 7 + answeredCount)
    const noiseWeight = hasMedicalReports ? 18 : 30
    const score = Math.round(Math.min(100, Math.max(4, intensity * 22 + noise * noiseWeight)))
    const risk = riskFromScore(score)
    return { condition, score, risk, interpretation: INTERPRETATIONS[condition][risk] }
  })

  const overall = Math.round(
    conditionScores.reduce((sum, c) => sum + c.score, 0) / conditionScores.length
  )

  const overallCategory =
    overall >= 80 ? 'Very High' : overall >= 60 ? 'High' : overall >= 40 ? 'Moderate' : overall >= 20 ? 'Mild' : 'Low'

  const keyObservations = buildKeyObservations(conditionScores, overallCategory)
  if (hasMedicalReports) {
    keyObservations.push(
      `${medicalReportCount} previously uploaded medical/psychiatric report${medicalReportCount === 1 ? '' : 's'} were factored into this screening.`
    )
  }

  return {
    conditionScores,
    overall,
    overallCategory,
    keyObservations,
    clinicalSummary: buildClinicalSummary(conditionScores),
    followUp: buildFollowUp(conditionScores),
    hasMedicalReports,
    medicalReportCount,
  }
}