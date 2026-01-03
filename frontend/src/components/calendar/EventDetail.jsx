export default function EventDetail({
  dateISO,
  events,
  selectedEventId,
  selectedEvent,
  onPickEvent,
  onComplete,
}) {
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
                {/* 空心圓圈 */}
                <button
                  className="todo-circle"
                  onClick={() => onComplete(ev.id)}
                  title={ev.done ? "取消完成" : "標示完成"}
                />

                {/* 標題 */}
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
              </div>
            );
          })}
        </div>
      )}

      {selectedEvent ? (
        <div className="detail-box">
          <div className="detail-strong">{selectedEvent.title}</div>
          <div className="detail-note">
            {selectedEvent.note ? selectedEvent.note : "（無內容）"}
          </div>
        </div>
      ) : null}
    </div>
  );
}
