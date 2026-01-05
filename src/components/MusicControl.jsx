import { useEffect, useRef, useState } from "react";

export default function MusicControl({ audioRef }) {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = volume === 0;
  }, [volume]);

  return (
    <div className="music-control" ref={panelRef}>
      <img
        src="/icons/speaker.png"
        className={`tray-icon ${open ? "active" : ""}`}
        onClick={() => setOpen(v => !v)}
      />

      {open && (
        <div className="music-panel">
          <div className="music-header">
            <div className="music-title">Minecraft UI Theme</div>
            <div className="music-sub">Ambient Loop</div>
          </div>

          <div className="music-slider-wrap">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>

          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noreferrer"
            className="music-link"
          >
            Open in Spotify
          </a>
        </div>
      )}
    </div>
  );
}
