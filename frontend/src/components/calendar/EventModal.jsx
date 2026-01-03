import { useEffect, useState } from "react";

export default function EventModal({ open, defaultDateISO, onClose, onSubmit }) {
  const [dateISO, setDateISO] = useState(defaultDateISO);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setDateISO(defaultDateISO);
  }, [defaultDateISO]);

  if (!open) return null;

  function submit() {
    if (!dateISO) {
      setErr("請選擇日期");
      return;
    }
    if (!title.trim()) {
      setErr("請輸入事項標題");
      return;
    }

    setErr("");
    onSubmit({
      dateISO,
      title: title.trim(),
      note: note.trim(),
    });

    setTitle("");
    setNote("");
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">建立事項</div>

        <div className="modal-row">
          <div className="label">日期</div>
          <input
            className="input"
            type="date"
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
          />
        </div>

        <div className="modal-row">
          <div className="label">標題</div>
          <input
            className="input"
            placeholder="例如：資管作業 / 考試 / 會議"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="modal-row">
          <div className="label">內容</div>
          <textarea
            className="textarea"
            placeholder="可選填"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {err ? <div className="error">{err}</div> : null}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            取消
          </button>
          <button className="btn primary" onClick={submit}>
            建立
          </button>
        </div>
      </div>
    </div>
  );
}
