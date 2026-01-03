const THEME_KEY = "lp_theme";
const MODE_KEY = "lp_mode";

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
