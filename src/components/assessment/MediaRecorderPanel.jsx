import { useEffect, useRef, useState } from 'react'

export default function MediaRecorderPanel({ onStatusChange }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | requesting | recording | denied | unsupported

  useEffect(() => {
    let cancelled = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        onStatusChange?.('unsupported')
        return
      }
      setStatus('requesting')
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setStatus('recording')
        onStatusChange?.('recording')
      } catch (err) {
        setStatus('denied')
        onStatusChange?.('denied')
      }
    }

    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [onStatusChange])

  return (
    <div className="card media-panel">
      <div className="media-frame">
        {status === 'recording' && <video ref={videoRef} autoPlay muted playsInline className="media-video" />}
        {status === 'requesting' && <p className="media-note">Requesting camera &amp; microphone access…</p>}
        {status === 'denied' && (
          <p className="media-note">
            Camera/microphone access was not granted. You can still continue with the questionnaire only.
          </p>
        )}
        {status === 'unsupported' && (
          <p className="media-note">Audio/video capture is not supported in this browser.</p>
        )}
      </div>
      {status === 'recording' && (
        <div className="media-indicator">
          <span className="pulse-dot" style={{ color: 'var(--color-error)' }}>●</span>
          Recording session audio &amp; video
        </div>
      )}

      <style>{`
        .media-panel { padding: 14px; }
        .media-frame {
          aspect-ratio: 4 / 3; background: var(--color-primary-dark);
          border-radius: var(--radius-sm); overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .media-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        .media-note { color: #DCEBEA; padding: 20px; text-align: center; font-size: 0.88rem; }
        .media-indicator {
          display: flex; align-items: center; gap: 8px;
          margin-top: 12px; font-size: 0.85rem; color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  )
}
