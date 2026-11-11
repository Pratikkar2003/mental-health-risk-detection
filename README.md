# Manodarshi — Frontend

React + Vite frontend for **Manodarshi: A Unified Framework for Early Detection of
Psychiatric and Neurocognitive Disorders**, built from the provided site-structure and
report-format spec.

This is a front-end scaffold: sign-in/sign-up, guest gating, navbar/sidebar/footer,
the questionnaire + audio/video assessment flow, and a results report page with
charts, all wired together with mocked (localStorage-backed) auth and a mocked
client-side scoring function. Wire the marked spots up to your real backend/ML
pipeline when ready.

## Getting started

```bash
npm install
npm run dev       # starts a local dev server, usually http://localhost:5173
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

Requires Node.js 18+.

## Where things live

```
manodarshi-frontend/
├── index.html                     Vite HTML entry, loads Google Fonts
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                   React root + BrowserRouter
    ├── App.jsx                    All routes wired together
    ├── index.css                  Global styles, buttons, cards, forms, signature "signal" motif
    ├── styles/
    │   └── tokens.css             Brand colors, type scale, spacing tokens (from the spec's palette)
    ├── context/
    │   └── AuthContext.jsx        Mocked sign-in/sign-up/guest session (localStorage-backed)
    ├── data/
    │   └── questions.js           Questionnaire bank, adapts by age group
    ├── utils/
    │   └── score.js               MOCK scorer — replace with a real API call to your ML backend
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx         Top nav: Home / How It Works / Assessments / Resources / About Us
    │   │   ├── Sidebar.jsx        Dashboard sidebar (Dashboard, My Assessments, My Reports, etc.)
    │   │   ├── Footer.jsx         Site footer, matches the spec's link groups
    │   │   ├── MarketingLayout.jsx  Navbar + page + footer wrapper
    │   │   └── DashboardLayout.jsx  Navbar + sidebar wrapper for signed-in areas
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Toast.jsx          Success/error popup used on sign-in/sign-up
    │   │   ├── GuestGate.jsx      "Sign in to continue" modal for guests
    │   │   ├── ProtectedRoute.jsx Route guard: redirects/gates guests & signed-out users
    │   │   ├── RiskGauge.jsx      Circular risk score gauge (signature waveform motif)
    │   │   └── LegalPage.jsx      Shared layout for Privacy/Terms/Disclaimer
    │   └── assessment/
    │       ├── QuestionCard.jsx        Single question + multiple-choice options
    │       └── MediaRecorderPanel.jsx  Requests camera/mic, shows live preview
    └── pages/
        ├── Splash.jsx              5–7s splash screen
        ├── Entry.jsx                "Continue as User / Guest"
        ├── SignIn.jsx / SignUp.jsx  Auth forms incl. Google/Facebook buttons
        ├── Home.jsx                 Hero + condition list + "how signals are gathered"
        ├── HowItWorks.jsx
        ├── Assessments.jsx          Condition overview + "Start Assessment"
        ├── AssessmentSession.jsx    Questionnaire + video/audio capture, step-by-step
        ├── Result.jsx                Risk gauge, bar chart, table, Q&A summary, disclaimer
        ├── Resources.jsx             Articles + FAQ accordion
        ├── AboutUs.jsx
        ├── Dashboard.jsx             Signed-in home (stat cards)
        ├── MyAssessments.jsx / MyReports.jsx  Empty-state history pages
        ├── Profile.jsx / Settings.jsx / HelpSupport.jsx
        └── Legal.jsx                 Privacy Policy / Terms of Use / Disclaimer
```

## Design tokens

Colors, typography, radii, and shadows are centralized in `src/styles/tokens.css`,
using the exact hex palette from the project spec (Deep Teal `#0F5C5E` primary,
Slate Blue `#40566F` secondary, Warm White `#F8FAF9` background, etc.). The
recurring bio-signal waveform (splash screen, hero, risk gauge) is the page's
signature motif, meant to evoke the speech/behavioural signal analysis at the
core of the product.

## What's mocked vs. real

- **Auth** (`AuthContext.jsx`) stores a session object in `localStorage` — no real
  backend call. Replace `signIn`, `signUp`, `signInWithProvider` with real API/OAuth calls.
- **Scoring** (`utils/score.js`) generates a pseudo-random but stable score from
  answers — replace `computeScreeningResult` with a call to your ML/CV/speech backend.
- **Media capture** (`MediaRecorderPanel.jsx`) requests camera/mic and shows a live
  preview but does not upload or persist the stream — hook in your recording/upload
  logic where noted.
- **Report PDF download** on the Result page currently triggers the browser's print
  dialog (`window.print()`) as a placeholder for a real PDF export endpoint.

## Guest vs. signed-in access

Per the spec: guests can view Home, How It Works, Resources, and About Us. Any
attempt to reach Assessments, results, sidebar pages, Profile, Settings, or Help &
Support opens a "Sign in to continue" modal (`GuestGate.jsx`), matching the
required behavior ("if the guest clicks on get started or sidebar contents, the
sign-in/sign-up form should appear... they can go back if not interested").
