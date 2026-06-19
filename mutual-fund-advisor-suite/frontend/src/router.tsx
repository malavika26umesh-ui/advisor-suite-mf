import { createBrowserRouter } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";

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

export const router = createBrowserRouter([
  // ── Investor-facing pages (wrapped in NavBar + Footer) ──────────────────────
  {
    element: <PageLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/query-builder", element: <QueryBuilder /> },
      { path: "/faq", element: <FAQCentre /> },
      { path: "/faq/fee-explainer", element: <FeeExplainerDetail /> },
      { path: "/education", element: <EducationHub /> },
      { path: "/education/:slug", element: <EducationArticle /> },
      { path: "/schedule", element: <VoiceScheduler /> },
      { path: "/schedule/manage", element: <RescheduleCancel /> },
      { path: "/sources", element: <Sources /> },
    ],
  },

  // ── Advisor portal pages (own shell, Sprint 14) ─────────────────────────────
  { path: "/advisor/login", element: <AdvisorLogin /> },
  { path: "/advisor", element: <AdvisorDashboard /> },
  { path: "/advisor/brief/:id", element: <AdvisorBrief /> },
  { path: "/advisor/calendar", element: <AdvisorCalendar /> },
  { path: "/advisor/pulse", element: <AdvisorPulse /> },
]);
