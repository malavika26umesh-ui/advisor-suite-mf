import axios from "axios";

// Base Axios client. All feature service files (faq.service.ts, etc.)
// import this rather than constructing their own client.
//
// Default is a relative path: in dev, Vite's server.proxy forwards /api to
// localhost:8000; in prod, vercel.json's rewrite forwards /api to the live
// backend. Either way the browser only ever talks to one origin, so no CORS
// is needed for normal app traffic. VITE_API_BASE_URL is an explicit override
// for calling the backend's absolute URL directly instead, if ever needed.
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "/api";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});
