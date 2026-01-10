const THEME_KEY = "lp_theme";
const MODE_KEY = "lp_mode";
const TOKEN_KEY = "lp_token";
const GUEST_EVENTS_KEY = "lp_events_v1";
export function getTheme() {
  const v = localStorage.getItem(THEME_KEY);
  if (v === "dark") return "dark";
  return "light";
}
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
export function setMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}
export function getMode() {
  return localStorage.getItem(MODE_KEY) || "guest";
}
export function isGuestMode() {
  return getMode() === "guest";
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
export function logout() {
  clearToken();
  setMode("guest");
}
export function loadGuestEvents() {
  const raw = localStorage.getItem(GUEST_EVENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}
export function saveGuestEvents(events) {
  localStorage.setItem(GUEST_EVENTS_KEY, JSON.stringify(events));
}