import axios from "axios";

// Base Axios client. All feature service files (faq.service.ts, etc.)
// import this rather than constructing their own client.
export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});
