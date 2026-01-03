const KEY = "lp_events_v1";

export function loadEvents() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((e) => {
      if (typeof e.done === "boolean") return e;
      return { ...e, done: false };
    });
  } catch {
    return [];
  }
}

export function saveEvents(events) {
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function upsertEvent(events, payload) {
  const id = makeId();
  const next = [...events];
  next.push({
    id,
    dateISO: payload.dateISO,
    title: payload.title,
    note: payload.note,
    done: false,
    createdAt: Date.now(),
  });
  return next;
}

export function getEventsByDate(events, iso) {
  const out = [];
  let i = 0;
  while (i < events.length) {
    if (events[i].dateISO === iso) out.push(events[i]);
    i = i + 1;
  }
  return out;
}

export function toggleEventDone(events, id) {
  const next = [];
  let i = 0;
  while (i < events.length) {
    const ev = events[i];
    if (ev.id === id) {
      next.push({ ...ev, done: ev.done === true ? false : true });
    } else {
      next.push(ev);
    }
    i = i + 1;
  }
  return next;
}

function makeId() {
  return "ev_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}
