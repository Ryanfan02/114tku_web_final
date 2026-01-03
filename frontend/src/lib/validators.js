export function isGmail(email) {
  return /^[a-z0-9._%+-]+@gmail\.com$/.test(email.toLowerCase());
}

export function minLen(v, n) {
  return v.length >= n;
}
