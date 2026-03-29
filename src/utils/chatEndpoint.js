export const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
export const NORMALIZED_API_BASE = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

export const SOCKET_ENDPOINT = (() => {
  const configured = NORMALIZED_API_BASE.replace(/\/api\/?$/, '');
  if (configured && /^https?:\/\//.test(configured)) return configured;
  return import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
})();

