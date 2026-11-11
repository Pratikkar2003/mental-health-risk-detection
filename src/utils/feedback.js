// Lightweight front-end-only feedback store.
// Submitted feedback is persisted to localStorage so it survives a refresh.
// A real backend would replace getFeedback()/addFeedback() with API calls
// so feedback is visible across devices/users rather than just this browser.

const STORAGE_KEY = 'manodarshi.feedback'

const AVATAR_PALETTE = ['#0F5C5E', '#40566F', '#A86500', '#287D55', '#083F41', '#8A4B6B']

// Fictional placeholder content for design/demo purposes only — never
// presented to real users unless explicitly requested via getFeedback's
// { includeSeed: true } option. See the note on getFeedback() below.
const SEED_FEEDBACK = [
  {
    id: 'seed-1',
    name: 'Ananya Rao',
    rating: 5,
    message: 'The questionnaire felt thoughtful, not clinical. My report gave me the push I needed to actually book a therapist appointment.',
    timeLabel: '5 days ago',
  },
  {
    id: 'seed-2',
    name: 'Wei Chen',
    rating: 5,
    message: 'I liked that it explained what each score meant instead of just throwing numbers at me. Took about 12 minutes start to finish.',
    timeLabel: '1 week ago',
  },
  {
    id: 'seed-3',
    name: 'Priya Menon',
    rating: 4,
    message: 'Straightforward and private-feeling. I skipped the camera step and it still worked fine with just the questionnaire.',
    timeLabel: '2 weeks ago',
  },
  {
    id: 'seed-4',
    name: 'Daniel Okafor',
    rating: 5,
    message: 'Brought the printed report to my GP and it made the conversation so much easier to start.',
    timeLabel: '1 month ago',
  },
  {
    id: 'seed-5',
    name: 'Meera Iyer',
    rating: 4,
    message: 'Clean interface, didn\u2019t feel overwhelming. Wish the assessment was a little shorter, but the results were genuinely useful.',
    timeLabel: 'Yesterday',
  },
]

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function colorForName(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

export function timeAgo(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.round(days / 7)
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  const months = Math.round(days / 30)
  return `${months} month${months === 1 ? '' : 's'} ago`
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Seed testimonials are fictional placeholder content for design/demo
// purposes only — they must never be presented to real users as genuine
// reviews. getFeedback() defaults to real submissions only; pass
// { includeSeed: true } explicitly (e.g. for local design preview) to see
// the placeholder cards.
export function getFeedback({ includeSeed = false } = {}) {
  const stored = readStored()
  const real = [...stored].reverse()
  return includeSeed ? real.concat(SEED_FEEDBACK) : real
}

export function addFeedback({ name, rating, title, message }) {
  const entry = {
    id: `fb-${Date.now()}`,
    name: name || 'Anonymous',
    rating,
    title,
    message,
    timestamp: new Date().toISOString(),
  }
  const stored = readStored()
  stored.push(entry)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // localStorage unavailable (e.g. private browsing quota) — fail silently,
    // the entry will still render for this session via addFeedback's return value.
  }
  return entry
}

export function hasSubmittedFeedback() {
  return readStored().length > 0
}