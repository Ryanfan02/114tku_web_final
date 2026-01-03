import { getEventsByDate } from "../../lib/eventsStore";

export default function WeekView({
  weekDays,
  selectedISO,
  events,
  onPickDay,
  onPickEvent,
}) {
  return (
    <div className="week">
      <div className="week-head">
        {weekDays.map((iso) => {
          const isActive = iso === selectedISO;
          const cls = isActive ? "week-day active" : "week-day";
          return (
            <button key={iso} className={cls} onClick={() => onPickDay(iso)}>
              <div className="week-date">{iso.slice(5, 10)}</div>
              <div className="week-dow">{dowText(iso)}</div>
            </button>
          );
        })}
      </div>

      <div className="week-body">
        {weekDays.map((iso) => {
          const list = getEventsByDate(events, iso);
          return (
            <div key={iso} className="day-col">
              {list.length === 0 ? (
                <div className="empty">（無事項）</div>
              ) : (
                list.map((ev) => (
                  <button
                    key={ev.id}
                    className="event-chip"
                    onClick={() => onPickEvent(ev.id)}
                    title={ev.note || ev.title}
                  >
                    {ev.title}
                  </button>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function dowText(iso) {
  const d = new Date(iso + "T00:00:00");
  const idx = d.getDay();
  if (idx === 0) return "日";
  if (idx === 1) return "一";
  if (idx === 2) return "二";
  if (idx === 3) return "三";
  if (idx === 4) return "四";
  if (idx === 5) return "五";
  return "六";
}
