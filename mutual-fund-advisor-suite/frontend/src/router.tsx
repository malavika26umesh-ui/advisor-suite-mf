import { createBrowserRouter } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import FAQCentre from "./pages/FAQCentre";
import FeeExplainerDetail from "./pages/FeeExplainerDetail";
import EducationHub from "./pages/EducationHub";
import EducationArticle from "./pages/EducationArticle";
import VoiceScheduler from "./pages/VoiceScheduler";
import RescheduleCancel from "./pages/RescheduleCancel";
import Sources from "./pages/Sources";
import QueryBuilder from "./pages/QueryBuilder";

// Advisor pages — not wrapped in PageLayout (they use the Dashboard shell, Sprint 14)
import AdvisorLogin from "./pages/AdvisorLogin";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdvisorBrief from "./pages/AdvisorBrief";
import AdvisorCalendar from "./pages/AdvisorCalendar";
import AdvisorPulse from "./pages/AdvisorPulse";
import AdvisorApprovalCentre from "./pages/AdvisorApprovalCentre";
import AdvisorRoute from "./components/AdvisorRoute";

const withErrorBoundary = (component: React.ReactNode) => (
  <ErrorBoundary>{component}</ErrorBoundary>
);

export const router = createBrowserRouter([
  // ── Investor-facing pages (wrapped in NavBar + Footer) ──────────────────────
  {
    element: withErrorBoundary(<PageLayout />),
    children: [
      { path: "/", element: withErrorBoundary(<Home />) },
      { path: "/query-builder", element: withErrorBoundary(<QueryBuilder />) },
      { path: "/faq", element: withErrorBoundary(<FAQCentre />) },
      { path: "/faq/fee-explainer", element: withErrorBoundary(<FeeExplainerDetail />) },
      { path: "/education", element: withErrorBoundary(<EducationHub />) },
      { path: "/education/:slug", element: withErrorBoundary(<EducationArticle />) },
      { path: "/schedule", element: withErrorBoundary(<VoiceScheduler />) },
      { path: "/schedule/manage", element: withErrorBoundary(<RescheduleCancel />) },
      { path: "/sources", element: withErrorBoundary(<Sources />) },
    ],
  },

  // ── Advisor portal pages (own shell, Sprint 14) ─────────────────────────────
  { path: "/advisor/login", element: withErrorBoundary(<AdvisorLogin />) },
  {
    element: withErrorBoundary(<AdvisorRoute />),
    children: [
      { path: "/advisor", element: withErrorBoundary(<AdvisorDashboard />) },
      { path: "/advisor/brief/:id", element: withErrorBoundary(<AdvisorBrief />) },
      { path: "/advisor/calendar", element: withErrorBoundary(<AdvisorCalendar />) },
      { path: "/advisor/pulse", element: withErrorBoundary(<AdvisorPulse />) },
      { path: "/advisor/approval-centre", element: withErrorBoundary(<AdvisorApprovalCentre />) },
    ],
  },
]);
