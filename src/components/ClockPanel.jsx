import { useEffect, useRef, useState } from "react";

export default function ClockPanel({ onClose }) {
  const ref = useRef(null);
  const today = new Date();

  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();

  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const startDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const prevMonthDays = new Date(year, monthIndex, 0).getDate();

  const goPrev = () =>
    setViewDate(new Date(year, monthIndex - 1, 1));

  const goNext = () =>
    setViewDate(new Date(year, monthIndex + 1, 1));

  return (
    <div className="calendar-panel" ref={ref}>
      <div className="calendar-top">
        <div>
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>

      <div className="calendar-header">
        <button onClick={goPrev}>‹</button>
        <span>{monthName}, {year}</span>
        <button onClick={goNext}>›</button>
      </div>

      <div className="calendar-grid">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}

        {Array(startDay).fill(null).map((_, i) => (
          <div key={"p"+i} className="calendar-day muted">
            {prevMonthDays - startDay + i + 1}
          </div>
        ))}

        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const isToday =
            day === today.getDate() &&
            monthIndex === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={day}
              className={`calendar-day ${isToday ? "today" : ""}`}
            >
              {day}
            </div>
          );
        })}

        {Array((42 - (startDay + daysInMonth)) % 7).fill(null).map((_, i) => (
          <div key={"n"+i} className="calendar-day muted">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
