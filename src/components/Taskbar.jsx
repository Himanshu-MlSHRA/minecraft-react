import { useEffect, useRef, useState } from "react";
import ClockPanel from "./ClockPanel";

export default function Taskbar({ icons, onOpenApp }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(new Date());

  const searchRef = useRef(null);
  const calendarRef = useRef(null);
  const searchBtnRef = useRef(null);
  const clockBtnRef = useRef(null);

  // live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // outside click handler (SEARCH + CALENDAR both)
  useEffect(() => {
    const handler = (e) => {
      // close search
      if (
        showSearch &&
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !searchBtnRef.current.contains(e.target)
      ) {
        setShowSearch(false);
        setQuery("");
      }

      // close calendar
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        !clockBtnRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSearch, showCalendar]);

  const results = icons.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* SEARCH PANEL */}
      {showSearch && (
        <div className="search-panel" ref={searchRef}>
          <input
            className="search-input"
            autoFocus
            placeholder="Search for apps"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="search-results">
            {results.length === 0 && (
              <div className="search-empty">No results</div>
            )}

            {results.map(app => (
              <div
                key={app.id}
                className="search-item"
                onClick={() => {
                  onOpenApp(app.name);
                  setShowSearch(false);
                  setQuery("");
                }}
              >
                <img src={app.icon} alt="" />
                <div>
                  <div className="search-title">{app.name}</div>
                  <div className="search-desc">{app.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALENDAR PANEL */}
      {showCalendar && (
        <div ref={calendarRef}>
          <ClockPanel />
        </div>
      )}

      {/* TASKBAR */}
      <div className="taskbar">
        <div className="taskbar-left">
          <button
            ref={searchBtnRef}
            className="win-btn"
            onClick={() => {
              setShowSearch(prev => !prev);
              setShowCalendar(false);
            }}
          >
            <img src="/icons/windows-logo.png" alt="Windows" />
          </button>
        </div>

        <div className="taskbar-right">
          <div
            ref={clockBtnRef}
            className="clock"
            onClick={() => {
              setShowCalendar(prev => !prev);
              setShowSearch(false);
            }}
            title={`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`}
          >
            <div>
              {now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div>{now.toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}</div>
          </div>
        </div>
      </div>
    </>
  );
}
