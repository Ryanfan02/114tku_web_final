import {
  monthLabel,
  getMonthMatrix,
  addMonths,
  sameISODate,
} from "../../lib/dateUtils";

export default function MiniMonth({
  focusedMonthISO,
  selectedISO,
  onPrevMonth,
  onNextMonth,
  onPickDay,
  hasEvents,
}) {
  const matrix = getMonthMatrix(focusedMonthISO); // 6x7 of ISO dates (含上/下月補齊)

  function prev() {
    onPrevMonth(addMonths(focusedMonthISO, -1));
  }

  function next() {
    onNextMonth(addMonths(focusedMonthISO, 1));
  }

  return (
    <div className="mini">
      <div className="mini-head">
        <div className="mini-title">{monthLabel(focusedMonthISO)}</div>
        <div className="mini-nav">
          <button className="icon-btn" onClick={prev}>
            &lt;
          </button>
          <button className="icon-btn" onClick={next}>
            &gt;
          </button>
        </div>
      </div>

      <div className="mini-dow">
        <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
      </div>

      <div className="mini-grid">
        {matrix.map((iso) => {
          const cls = [];
          cls.push("mini-cell");

          if (sameISODate(iso, selectedISO)) cls.push("active");
          if (hasEvents(iso)) cls.push("dot");

          return (
            <button
              key={iso}
              className={cls.join(" ")}
              onClick={() => onPickDay(iso)}
              title={iso}
            >
              {iso.slice(8, 10)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
