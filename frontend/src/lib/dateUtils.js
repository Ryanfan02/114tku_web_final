export function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

export function sameISODate(a, b) {
  return a === b;
}

export function startOfWeek(iso) {
  // 以「週日」為一週開始
  const d = new Date(iso + "T00:00:00");
  const dow = d.getDay(); // 0..6
  d.setDate(d.getDate() - dow);
  return toISODate(d);
}

export function addDays(iso, n) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function addMonths(iso, n) {
  const d = new Date(iso + "T00:00:00");
  d.setMonth(d.getMonth() + n);
  return toISODate(d);
}

export function monthLabel(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.getFullYear() + "年" + (d.getMonth() + 1) + "月";
}

export function getMonthMatrix(focusedMonthISO) {
  // 回傳 42 格（6 週 x 7 天），每格是 ISO
  const d = new Date(focusedMonthISO + "T00:00:00");
  const y = d.getFullYear();
  const m = d.getMonth();

  const first = new Date(y, m, 1);
  const firstISO = toISODate(first);

  const start = startOfWeek(firstISO);

  const cells = [];
  let i = 0;
  while (i < 42) {
    cells.push(addDays(start, i));
    i = i + 1;
  }
  return cells;
}
