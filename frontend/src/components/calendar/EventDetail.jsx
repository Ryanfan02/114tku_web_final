import { useEffect, useState } from "react";

export default function EventDetail({
  dateISO,
  events,
  selectedEventId,
  selectedEvent,
  onPickEvent,
  onComplete,
  onDelete,
  onUpdate, 
}) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");


  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || "");
      setNote(selectedEvent.note || "");
    } else {
      setTitle("");
      setNote("");
    }
  }, [selectedEventId]);


  useEffect(() => {
    if (!selectedEvent) return;
    if (!onUpdate) return;

    const timer = setTimeout(() => {
      const nextTitle = title.trim();
      const nextNote = note.trim();

      if (!nextTitle) return;

      const oldTitle = selectedEvent.title || "";
      const oldNote = selectedEvent.note || "";

      if (nextTitle === oldTitle && nextNote === oldNote) return;

      onUpdate(selectedEvent.id, { title: nextTitle, note: nextNote });
    }, 500);

    return () => clearTimeout(timer);
  }, [title, note]);

  return (
    <div>
      <div className="detail-sub">日期：{dateISO}</div>

      {events.length === 0 ? (
        <div className="muted">這天沒有事項</div>
      ) : (
        <div className="detail-list">
          {events.map((ev) => {
            const active = ev.id === selectedEventId;
            const cls = active ? "detail-item active" : "detail-item";

            return (
              <div key={ev.id} className={cls}>
                <button
                  className="todo-circle"
                  onClick={() => onComplete(ev.id)}
                  title={ev.done ? "取消完成" : "標示完成"}
                />

                <button
                  className="detail-item-btn"
                  onClick={() => onPickEvent(ev.id)}
                  style={{
                    textDecoration: ev.done ? "line-through" : "none",
                    opacity: ev.done ? 0.55 : 1,
                  }}
                >
                  {ev.title}
                </button>

                <button
                  className="btn"
                  style={{ marginLeft: "auto" }}
                  onClick={() => {
                    if (!onDelete) return;
                    const ok = window.confirm("確定要刪除這筆事項嗎？");
                    if (ok) onDelete(ev.id);
                  }}
                  title="刪除"
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedEvent ? (
        <div className="detail-box">
          <div className="detail-sub">標題</div>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="detail-sub" style={{ marginTop: 10 }}>
            內容
          </div>
          <textarea
            className="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}
