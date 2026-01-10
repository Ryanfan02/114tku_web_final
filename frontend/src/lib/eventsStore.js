import { isGuestMode, loadGuestEvents, saveGuestEvents } from "./storage";
import {
  listEventsApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
} from "./api/events";

function sortByCreatedAt(a, b) {
  const x = a.createdAt || 0;
  const y = b.createdAt || 0;
  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
}

function filterByDate(events, iso) {
  if (!iso) return events;
  const out = [];
  let i = 0;
  while (i < events.length) {
    if (events[i].dateISO === iso) out.push(events[i]);
    i = i + 1;
  }
  return out;
}

function makeId() {
  return "ev_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}

/**
 * ✅ 相容舊版 UI：WeekView / MiniMonth / AppPage 可能還在用
 * getEventsByDate(events, iso)
 */
export function getEventsByDate(events, iso) {
  return filterByDate(events, iso);
}

/**
 * ✅ 相容舊版 UI：AppPage 原本用 upsertEvent(events, payload)
 * 這個只做「純前端陣列新增」，不打後端。
 *（建議你之後逐步改用 createEvent(payload)）
 */
export function upsertEvent(events, payload) {
  const id = makeId();
  const next = [...events];
  next.push({
    id,
    dateISO: payload.dateISO,
    title: payload.title,
    note: payload.note || "",
    done: false,
    createdAt: Date.now(),
  });
  return next;
}

// ===== 對外：載入（登入走後端 / 訪客走 localStorage）=====
export async function loadEvents(dateISO) {
  if (isGuestMode()) {
    const all = loadGuestEvents();
    const filtered = filterByDate(all, dateISO);
    filtered.sort(sortByCreatedAt);
    return filtered;
  }

  const data = await listEventsApi(dateISO);
  const arr = Array.isArray(data) ? data : [];
  arr.sort(sortByCreatedAt);
  return arr;
}

// ===== 對外：新增（建議 UI 用這個）=====
export async function createEvent(payload) {
  if (isGuestMode()) {
    const all = loadGuestEvents();
    const item = {
      id: makeId(),
      dateISO: payload.dateISO,
      title: payload.title,
      note: payload.note || "",
      done: false,
      createdAt: Date.now(),
    };
    all.push(item);
    saveGuestEvents(all);
    return item;
  }

  return createEventApi(payload);
}

// ===== 對外：切換 done =====
export async function toggleEventDone(event) {
  if (isGuestMode()) {
    const all = loadGuestEvents();
    const next = [];
    let i = 0;
    while (i < all.length) {
      const ev = all[i];
      if (ev.id === event.id) {
        next.push({ ...ev, done: ev.done === true ? false : true });
      } else {
        next.push(ev);
      }
      i = i + 1;
    }
    saveGuestEvents(next);
    return;
  }

  await updateEventApi(event.id, { done: event.done === true ? false : true });
}

// ===== 對外：更新 =====
export async function updateEvent(eventId, patch) {
  if (isGuestMode()) {
    const all = loadGuestEvents();
    const next = [];
    let i = 0;
    while (i < all.length) {
      const ev = all[i];
      if (ev.id === eventId) {
        next.push({ ...ev, ...patch });
      } else {
        next.push(ev);
      }
      i = i + 1;
    }
    saveGuestEvents(next);
    return;
  }

  await updateEventApi(eventId, patch);
}

// ===== 對外：刪除 =====
export async function deleteEvent(eventId) {
  if (isGuestMode()) {
    const all = loadGuestEvents();
    const next = [];
    let i = 0;
    while (i < all.length) {
      if (all[i].id !== eventId) next.push(all[i]);
      i = i + 1;
    }
    saveGuestEvents(next);
    return;
  }

  await deleteEventApi(eventId);
}
