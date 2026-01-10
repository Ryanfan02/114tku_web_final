import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme, setTheme, logout as doLogout } from "../lib/storage";
import MiniMonth from "../components/calendar/MiniMonth";
import WeekView from "../components/calendar/WeekView";
import EventModal from "../components/calendar/EventModal";
import EventDetail from "../components/calendar/EventDetail";
import {
  loadEvents,
  createEvent,
  toggleEventDone,
  deleteEvent,
  updateEvent,
} from "../lib/eventsStore";
import { toISODate, startOfWeek, addDays, sameISODate } from "../lib/dateUtils";

export default function AppPage() {
  const todayISO = toISODate(new Date());
  const nav = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedISO, setSelectedISO] = useState(todayISO);
  const [focusedMonthISO, setFocusedMonthISO] = useState(todayISO);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [theme, setThemeState] = useState(getTheme());
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setTheme(theme);
  }, [theme]);

  function handleLogout() {
    doLogout();
    nav("/");
  }

  useEffect(() => {
    let alive = true;

    async function run() {
      setErr("");
      setLoading(true);
      try {
        const data = await loadEvents(selectedISO);
        if (!alive) return;
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message ? e.message : "Load events failed");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [selectedISO]);

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

  const eventsOfSelectedDay = useMemo(() => events, [events]);

  function handlePickDay(iso) {
    setSelectedISO(iso);
    setSelectedEventId("");
    setFocusedMonthISO(iso);
  }

  function handleCreate() {
    setIsCreateOpen(true);
  }

  async function handleSubmitCreate(payload) {
    setErr("");
    setLoading(true);
    try {
      const saved = await createEvent(payload);

      setSelectedISO(payload.dateISO);

      if (saved && saved.id) setSelectedEventId(saved.id);
      else setSelectedEventId("");

      const data = await loadEvents(payload.dateISO);
      setEvents(Array.isArray(data) ? data : []);
      setIsCreateOpen(false);
    } catch (e) {
      setErr(e.message ? e.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  function handlePickEvent(eventId) {
    setSelectedEventId(eventId);
  }

  async function handleComplete(eventId) {
    let found = null;
    let i = 0;
    while (i < events.length) {
      if (events[i].id === eventId) {
        found = events[i];
        break;
      }
      i = i + 1;
    }
    if (!found) return;

    setErr("");
    setLoading(true);
    try {
      await toggleEventDone(found);
      const data = await loadEvents(selectedISO);
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message ? e.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(eventId) {
    setErr("");
    setLoading(true);
    try {
      await deleteEvent(eventId);

      if (selectedEventId === eventId) {
        setSelectedEventId("");
      }

      const data = await loadEvents(selectedISO);
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(eventId, patch) {
    setErr("");
    try {
      await updateEvent(eventId, patch);
      const data = await loadEvents(selectedISO);
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message ? e.message : "Update failed");
    }
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

  function hasEvents(iso) {
    if (iso !== selectedISO) return false;
    return events.length > 0;
  }

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <div className="app-title">📅 List Planner</div>


        <div className="app-right" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn" onClick={handleLogout}>登出</button>
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
              hasEvents={hasEvents}
            />
          </div>

          <div className="panel detail-card">
            <div className="detail-title">
              {sameISODate(selectedISO, todayISO) ? "今天" : selectedISO}
            </div>

            {loading ? <div className="hint">載入中...</div> : null}
            {err ? <div className="error">{err}</div> : null}

            <EventDetail
              dateISO={selectedISO}
              events={eventsOfSelectedDay}
              selectedEventId={selectedEventId}
              selectedEvent={selectedEvent}
              onPickEvent={handlePickEvent}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        </div>

        <div className="main">
          <div className="panel week-panel">
            <WeekView
              weekDays={weekDays}
              selectedISO={selectedISO}
              events={eventsOfSelectedDay}
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
