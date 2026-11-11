import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MarketingLayout from './components/layout/MarketingLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

import Splash from './pages/Splash'
import Entry from './pages/Entry'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Assessments from './pages/Assessments'
import AssessmentSession from './pages/AssessmentSession'
import Result from './pages/Result'
import AboutUs from './pages/AboutUs'
import Dashboard from './pages/Dashboard'
import MyAssessments from './pages/MyAssessments'
import MyReports from './pages/MyReports'
import Settings from './pages/Settings'
import HelpSupport from './pages/HelpSupport'
import { DoctorProvider } from './doctor/DoctorContext'
import { DoctorSignIn, DoctorRegister } from './doctor/DoctorAuthPages'
import DoctorLayout, { DoctorProtectedRoute } from './doctor/DoctorLayout'
import * as DP from './doctor/DoctorPages'
import PatientOverview from './doctor/PatientOverview'
import { PrivacyPolicy, TermsOfUse, Disclaimer } from './pages/Legal'

export default function App() {
  return (
    <AuthProvider>
      <DoctorProvider>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Entry />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Public / guest-accessible marketing pages */}
        <Route element={<MarketingLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/resources" element={<Navigate to="/how-it-works#resources" replace />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/terms" element={<TermsOfUse />} />
          <Route path="/legal/disclaimer" element={<Disclaimer />} />

          {/* Guarded: guests are gated by ProtectedRoute inside these */}
          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <Assessments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments/session"
            element={
              <ProtectedRoute>
                <AssessmentSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments/result"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Authenticated dashboard area (sidebar) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/assessments" element={<MyAssessments />} />
          <Route path="/dashboard/reports" element={<MyReports />} />
          <Route path="/profile" element={<Navigate to="/dashboard#profile" replace />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpSupport />} />
        </Route>

        {/* Doctor Portal (separate role, own session + guard) */}
        <Route path="/doctor/signin" element={<DoctorSignIn />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor" element={<DoctorProtectedRoute><DoctorLayout /></DoctorProtectedRoute>}>
          <Route index element={<DP.DoctorDashboard />} />
          <Route path="patients" element={<DP.PatientList />} />
          <Route path="patients/:patientId" element={<PatientOverview />} />
          <Route path="access" element={<DP.AccessPatient />} />
          <Route path="assessments" element={<DP.Assessments />} />
          <Route path="shared" element={<DP.SharedReports />} />
          <Route path="requests" element={<DP.AccessRequests />} />
          <Route path="notes" element={<DP.AllNotes />} />
          <Route path="resources" element={<DP.DoctorResources />} />
          <Route path="settings" element={<DP.DoctorSettings />} />
          <Route path="help" element={<DP.DoctorHelp />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </DoctorProvider>
    </AuthProvider>
  )
}