import { useEffect, useRef, useState } from "react";
import ClockPanel from "./ClockPanel";
import MusicControl from "./MusicControl";

export default function Taskbar({ icons, onOpenApp, onRefresh, audioRef }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState(new Date());

  const searchRef = useRef(null);
  const calendarRef = useRef(null);
  const searchBtnRef = useRef(null);
  const clockBtnRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        showSearch &&
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !searchBtnRef.current.contains(e.target)
      ) {
        setShowSearch(false);
        setQuery("");
      }

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
                <img src={app.icon} />
                <div>
                  <div className="search-title">{app.name}</div>
                  <div className="search-desc">{app.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCalendar && (
        <div ref={calendarRef}>
          <ClockPanel />
        </div>
      )}

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
            <img src="/icons/windows-logo.png" />
          </button>
        </div>

        <div className="taskbar-right">
          <div className="system-tray">
            <button className="tray-arrow">▲</button>

            <div className="tray-lang">
              <div>ENG</div>
              <div className="tray-sub">IN</div>
            </div>

            <img src="/icons/wifi.png" className="tray-icon" />

            <MusicControl audioRef={audioRef} />

            <img
              src="/icons/refresh.png"
              className={`tray-icon refresh-btn ${refreshing ? "spin" : ""}`}
              style={{ pointerEvents: locked ? "none" : "auto", opacity: locked ? 0.6 : 1 }}
              onClick={() => {
                if (locked) return;

                setRefreshing(true);
                setLocked(true);

                onRefresh && onRefresh();

                setTimeout(() => {
                  setRefreshing(false);
                }, 1000);

                setTimeout(() => {
                  setLocked(false);
                }, 2400);
              }}
            />
          </div>

          <div
            ref={clockBtnRef}
            className="clock"
            onClick={() => {
              setShowCalendar(prev => !prev);
              setShowSearch(false);
            }}
          >
            <div>
              {now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div>
              {now.toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
