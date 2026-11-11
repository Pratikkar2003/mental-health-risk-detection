import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/common/Toast'

const initialForm = {
  name: '',
  dob: '',
  age: '',
  contact: '',
  email: '',
  country: '',
  state: '',
  city: '',
  district: '',
  pincode: '',
}

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const ACCEPTED_ATTR = '.pdf,.jpg,.jpeg,.png'
const MAX_FILES = 5
const MAX_SIZE_MB = 10

function formatSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function calculateAge(dobString) {
  if (!dobString) return ''
  const dob = new Date(dobString)
  if (Number.isNaN(dob.getTime())) return ''

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return age >= 0 ? String(age) : ''
}

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(initialForm)
  const [reportFiles, setReportFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [toast, setToast] = useState(null)

  const update = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.value,
    })
  }

  const handleDobChange = (e) => {
    const dob = e.target.value
    setForm((prev) => ({
      ...prev,
      dob,
      age: calculateAge(dob),
    }))
  }

  const handleFileSelect = (e) => {
    const incoming = Array.from(e.target.files || [])
    e.target.value = '' // allow re-selecting the same file later

    if (!incoming.length) {
      return
    }

    setFileError('')
    const accepted = []

    for (const file of incoming) {
      if (reportFiles.length + accepted.length >= MAX_FILES) {
        setFileError(`You can attach up to ${MAX_FILES} files.`)
        break
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError('Only PDF, JPG, or PNG files are supported.')
        continue
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`"${file.name}" is larger than ${MAX_SIZE_MB} MB.`)
        continue
      }
      if (reportFiles.some((f) => f.name === file.name && f.size === file.size)) {
        continue // skip duplicates
      }
      accepted.push(file)
    }

    if (accepted.length) {
      setReportFiles((prev) => [...prev, ...accepted])
    }
  }

  const removeFile = (index) => {
    setReportFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // NOTE: In this front-end-only demo, uploaded files stay in memory for
    // the current session — only their metadata (name/size/type) is stored
    // on the user's profile. A production build would upload the actual
    // files to a secure backend (for OCR + clinical-record parsing) and
    // store a reference/ID here instead. See AssessmentSession.jsx and
    // utils/score.js for how the presence of reports currently feeds into
    // the screening result.
    const medicalReports = reportFiles.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }))

    const result = signUp({ ...form, medicalReports, medicalReportFiles: reportFiles })

    if (result.ok) {
      setToast({
        type: 'success',
        title: 'Account created successfully',
        message: 'Redirecting to your homepage…',
      })
    } else {
      setToast({
        type: 'error',
        title: 'Invalid data',
        message: result.message,
      })
    }
  }

  const closeToast = () => {
    const wasSuccess = toast?.type === 'success'

    setToast(null)

    if (wasSuccess) {
      navigate('/home')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">

        {/* Header */}
        <span className="eyebrow">Sign Up</span>

        <h1 className="signup-title">
          Create your account
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Personal Information */}
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Full name"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={form.dob}
                onChange={handleDobChange}
              />
            </div>

            <div className="field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                required
                readOnly
                value={form.age}
                placeholder="Auto-filled"
                className="field-readonly"
              />
              <span className="field-hint">Calculated automatically from date of birth</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="contact">Contact Number</label>
            <input
              id="contact"
              type="tel"
              required
              value={form.contact}
              onChange={update('contact')}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email ID</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
            />
          </div>

          {/* Address */}
          <div className="address-heading">
            <span className="eyebrow">Address</span>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                required
                value={form.country}
                onChange={update('country')}
                placeholder="Country"
              />
            </div>

            <div className="field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                required
                value={form.state}
                onChange={update('state')}
                placeholder="State"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                required
                value={form.city}
                onChange={update('city')}
                placeholder="City"
              />
            </div>

            <div className="field">
              <label htmlFor="district">District</label>
              <input
                id="district"
                type="text"
                required
                value={form.district}
                onChange={update('district')}
                placeholder="District"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="pincode">Pin Code</label>
            <input
              id="pincode"
              type="text"
              inputMode="numeric"
              required
              value={form.pincode}
              onChange={update('pincode')}
              placeholder="Pin Code"
            />
          </div>

          {/* Medical Reports */}
          <div className="address-heading">
            <span className="eyebrow">Medical Reports (optional)</span>
          </div>

          <p className="upload-hint">
            Attaching recent psychiatric or medical evaluation reports helps refine the accuracy
            of your screening result. This step is optional — you can also add reports later
            from your profile.
          </p>

          <button
            type="button"
            className="dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="dropzone-icon" aria-hidden="true">&#128206;</span>
            <span>
              <strong>Click to upload</strong> or drag files here
              <br />
              <span className="dropzone-meta">
                PDF, JPG or PNG · up to {MAX_SIZE_MB} MB each · max {MAX_FILES} files
              </span>
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_ATTR}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {fileError && (
            <p className="field-error" style={{ marginTop: 8 }}>
              {fileError}
            </p>
          )}

          {reportFiles.length > 0 && (
            <ul className="file-list">
              {reportFiles.map((f, i) => (
                <li key={`${f.name}-${f.size}`} className="file-item">
                  <span className="file-icon" aria-hidden="true">
                    {f.type === 'application/pdf' ? '\u{1F4C4}' : '\u{1F5BC}\uFE0F'}
                  </span>
                  <span className="file-name">{f.name}</span>
                  <span className="file-size">{formatSize(f.size)}</span>
                  <button
                    type="button"
                    className="file-remove"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => removeFile(i)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-block signup-button"
          >
            Create Account
          </button>

        </form>

        {/* Sign In */}
        <p className="signin-text">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="signin-link"
          >
            Sign in
          </Link>
        </p>

      </div>

      {toast && (
        <Toast
          {...toast}
          onClose={closeToast}
        />
      )}

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: var(--color-bg);
        }

        .auth-card {
          width: 100%;
          max-width: 520px;
          padding: 38px 34px;
        }

        .signup-title {
          margin: 10px 0 28px;
        }

        .address-heading {
          margin: 8px 0 16px;
        }

        .field-readonly {
          background: var(--color-surface-alt);
          color: var(--color-text-secondary);
          cursor: default;
        }

        .field-hint {
          margin-top: 4px;
          font-size: var(--fs-caption);
          color: var(--color-text-secondary);
        }

        .upload-hint {
          margin: 0 0 12px;
          font-size: var(--fs-small);
          color: var(--color-text-secondary);
        }

        .dropzone {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border: 1.5px dashed var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface-alt);
          text-align: left;
          font-size: 0.9rem;
          color: var(--color-text);
          transition: border-color 0.15s, background 0.15s;
        }

        .dropzone:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-tint);
        }

        .dropzone-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
        }

        .dropzone-meta {
          font-size: var(--fs-caption);
          color: var(--color-text-secondary);
        }

        .file-list {
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          background: #fff;
        }

        .file-icon {
          flex-shrink: 0;
        }

        .file-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          color: var(--color-text-secondary);
          font-size: var(--fs-caption);
          flex-shrink: 0;
        }

        .file-remove {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          font-size: 1.2rem;
          line-height: 1;
          padding: 0 2px;
          flex-shrink: 0;
        }

        .file-remove:hover {
          color: var(--color-error);
        }

        .signup-button {
          margin-top: 22px;
        }

        .signin-text {
          margin: 22px 0 0;
          text-align: center;
        }

        .signin-link {
          color: var(--color-primary);
          font-weight: 600;
        }

        .signin-link:hover {
          color: var(--color-primary-dark);
        }

        @media (max-width: 560px) {
          .auth-page {
            padding: 24px 16px;
            align-items: flex-start;
          }

          .auth-card {
            padding: 30px 22px;
          }
        }
      `}</style>
    </div>
  )
}