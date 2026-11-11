import LegalPage from '../components/common/LegalPage'

export function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Manodarshi collects account information, questionnaire responses, and, where permitted,
        audio/video recordings solely to generate your screening report. Data is not sold or
        shared with third parties for advertising purposes.
      </p>
      <p>
        You may request access to, correction of, or deletion of your data at any time through
        Settings or by contacting Help &amp; Support.
      </p>
    </LegalPage>
  )
}

export function TermsOfUse() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        By using Manodarshi, you agree that the platform provides screening and assessment support
        only, and does not constitute medical advice, diagnosis, or treatment.
      </p>
      <p>
        You are responsible for the accuracy of information you provide and for seeking
        professional care based on your own judgment and, where appropriate, your report.
      </p>
    </LegalPage>
  )
}

export function Disclaimer() {
  return (
    <LegalPage title="Disclaimer">
      <p>
        The platform provides screening/assessment support and does not provide a medical
        diagnosis. Reported scores and estimated risks are generated from information available
        during the assessment and may be affected by incomplete information, response bias,
        recording quality, and model limitations.
      </p>
      <p>
        A qualified clinician must independently interpret these findings before any clinical
        decision is made. If you are experiencing an immediate mental-health or safety crisis,
        please seek emergency or professional assistance without relying on this platform.
      </p>
    </LegalPage>
  )
}
