import { useEffect, useMemo, useState } from "react";
import { getTheme, setTheme } from "../lib/storage";
import MiniMonth from "../components/calendar/MiniMonth";
import WeekView from "../components/calendar/WeekView";
import EventModal from "../components/calendar/EventModal";
import EventDetail from "../components/calendar/EventDetail";
import {
  loadEvents,
  saveEvents,
  upsertEvent,
  getEventsByDate,
  toggleEventDone,
} from "../lib/eventsStore";
import { toISODate, startOfWeek, addDays, sameISODate } from "../lib/dateUtils";

export default function AppPage() {
  const todayISO = toISODate(new Date());

  const [events, setEvents] = useState(() => loadEvents());
  const [selectedISO, setSelectedISO] = useState(todayISO);
  const [focusedMonthISO, setFocusedMonthISO] = useState(todayISO);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const weekStartISO = useMemo(() => startOfWeek(selectedISO), [selectedISO]);

  const weekDays = useMemo(() => {
    const arr = [];
    let i = 0;
    while (i < 7) {
      arr.push(addDays(weekStartISO, i));
      i = i + 1;
    }
    return arr;
  }, [weekStartISO]);

  const eventsOfSelectedDay = useMemo(() => {
    return getEventsByDate(events, selectedISO);
  }, [events, selectedISO]);

  function handlePickDay(iso) {
    setSelectedISO(iso);
    setSelectedEventId("");
    setFocusedMonthISO(iso);
  }

  function handleCreate() {
    setIsCreateOpen(true);
  }

  function handleSubmitCreate(payload) {
    const next = upsertEvent(events, payload);
    setEvents(next);
    setSelectedISO(payload.dateISO);
    setSelectedEventId(payload.id);
    setIsCreateOpen(false);
  }

  function handlePickEvent(eventId) {
    setSelectedEventId(eventId);
  }

  // ✅ 完成 / 取消完成
  function handleComplete(eventId) {
    const next = toggleEventDone(events, eventId);
    setEvents(next);
  }

  const selectedEvent = useMemo(() => {
    let found = null;
    let i = 0;
    while (i < events.length) {
      if (events[i].id === selectedEventId) {
        found = events[i];
        break;
      }
      i = i + 1;
    }
    return found;
  }, [events, selectedEventId]);

  function toggleTheme() {
    setThemeState(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="app-title">📅 List Planner</div>

        <div className="app-right">
          <button className="icon-btn" onClick={toggleTheme}>🌗</button>
          <button className="btn primary" onClick={handleCreate}>建立</button>
        </div>
      </div>

      <div className="app-layout">
        <div className="sidebar">
          <div className="panel mini">
            <MiniMonth
              focusedMonthISO={focusedMonthISO}
              selectedISO={selectedISO}
              onPrevMonth={setFocusedMonthISO}
              onNextMonth={setFocusedMonthISO}
              onPickDay={handlePickDay}
              hasEvents={(iso) => getEventsByDate(events, iso).length > 0}
            />
          </div>

          <div className="panel detail-card">
            <div className="detail-title">
              {sameISODate(selectedISO, todayISO) ? "今天" : selectedISO}
            </div>

            <EventDetail
              dateISO={selectedISO}
              events={eventsOfSelectedDay}
              selectedEventId={selectedEventId}
              selectedEvent={selectedEvent}
              onPickEvent={handlePickEvent}
              onComplete={handleComplete}
            />
          </div>
        </div>

        <div className="main">
          <div className="panel week-panel">
            <WeekView
              weekDays={weekDays}
              selectedISO={selectedISO}
              events={events}
              onPickDay={handlePickDay}
              onPickEvent={handlePickEvent}
            />
          </div>
        </div>
      </div>

      <EventModal
        open={isCreateOpen}
        defaultDateISO={selectedISO}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleSubmitCreate}
      />
    </div>
  );
}
