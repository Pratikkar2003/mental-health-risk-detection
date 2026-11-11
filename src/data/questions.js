// Screening questionnaire bank.
// In production this would be served by the backend based on age/gender
// and adapted using validated instruments (PHQ-9, GAD-7, PCL-5, etc.)
// Here it is a static bank grouped by age bracket for the front-end demo.

const baseQuestions = [
  {
    id: 'q1',
    text: 'Over the past two weeks, how often have you felt down, low, or hopeless?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    id: 'q2',
    text: 'How often do you find it hard to relax or feel persistently on edge?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    id: 'q3',
    text: 'Have you experienced repeated, distressing memories of a stressful or traumatic event?',
    options: ['Never', 'Rarely', 'Sometimes', 'Frequently'],
  },
  {
    id: 'q4',
    text: 'How would you rate your sleep quality over the last month?',
    options: ['Very good', 'Fairly good', 'Fairly bad', 'Very bad'],
  },
  {
    id: 'q5',
    text: 'Do you notice sudden shifts between periods of high energy and periods of low mood?',
    options: ['Never', 'Occasionally', 'Often', 'Very often'],
  },
  {
    id: 'q6',
    text: 'How often do you find it difficult to concentrate on everyday tasks?',
    options: ['Not at all', 'Sometimes', 'Often', 'Nearly always'],
  },
  {
    id: 'q7',
    text: 'Have you noticed changes in appetite or weight in the past month?',
    options: ['No change', 'Slight change', 'Noticeable change', 'Significant change'],
  },
  {
    id: 'q8',
    text: 'How connected do you feel to friends, family, or your community right now?',
    options: ['Very connected', 'Somewhat connected', 'Somewhat isolated', 'Very isolated'],
  },
]

const seniorAddOn = [
  {
    id: 'q9',
    text: 'How often do you misplace items or forget recent conversations?',
    options: ['Rarely', 'Sometimes', 'Often', 'Very often'],
  },
  {
    id: 'q10',
    text: 'Do you find it more difficult than before to follow a familiar route or routine?',
    options: ['Not at all', 'Slightly', 'Moderately', 'Significantly'],
  },
]

const youthAddOn = [
  {
    id: 'q9y',
    text: 'How often do academic, social, or family pressures feel overwhelming?',
    options: ['Rarely', 'Sometimes', 'Often', 'Nearly always'],
  },
]

/**
 * Returns a tailored question set based on the user's age and gender.
 * Gender is accepted for future adaptive-question logic (kept in signature
 * to match the product spec) but does not currently branch the question bank.
 */
export function getQuestionSet({ age, gender } = {}) {
  const numericAge = Number(age)
  if (!Number.isNaN(numericAge) && numericAge >= 60) {
    return [...baseQuestions.slice(0, 6), ...seniorAddOn]
  }
  if (!Number.isNaN(numericAge) && numericAge <= 21) {
    return [...baseQuestions.slice(0, 7), ...youthAddOn]
  }
  return baseQuestions
}
