import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import GuestGate from './GuestGate'

export default function ProtectedRoute({ children }) {
  const { session, isAuthenticated, isGuest } = useAuth()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  if (!session) {
    navigate('/welcome')
    return null
  }

  if (isGuest && !dismissed) {
    return <GuestGate onDismiss={() => navigate(-1)} />
  }

  return children
}
