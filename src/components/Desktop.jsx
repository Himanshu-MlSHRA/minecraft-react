import { useState, useRef, useEffect } from "react";
import { initialIcons } from "../data/desktopIcons";
import { useDesktopDrag } from "../hooks/useDesktopDrag";
import DesktopIcon from "./DesktopIcon";
import DragGhost from "./DragGhost";
import FolderWindow from "./FolderWindow";
import Taskbar from "./Taskbar";

export default function Desktop() {
  const [icons, setIcons] = useState(initialIcons);
  const [openWindow, setOpenWindow] = useState(null);

  const wallpapers = [
    "/bg/minecraft1.png",
    "/bg/minecraft2.png",
    "/bg/minecraft3.png",
    "/bg/minecraft4.jpg",
    "/bg/minecraft5.png",
  ];

  const [bgIndex, setBgIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const audioRef = useRef(null);

  const {
    selectedId,
    dragGhost,
    onIconMouseDown,
    onMouseMove,
    onMouseUp,
    clearSelection,
  } = useDesktopDrag(icons, setIcons);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.25;
    audio.muted = true;
    audio.play().catch(() => {});
  }, []);

  const unlockAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted) {
      audio.muted = false;
      audio.play().catch(() => {});
    }
  };

  const changeWallpaper = () => {
    if (fading) return;

    setFading(true);

    setTimeout(() => {
      setBgIndex((prev) => (prev + 1) % wallpapers.length);
    }, 300);

    setTimeout(() => {
      setFading(false);
    }, 1000);
  };

  return (
    <div
      className="desktop-root"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseDown={(e) => {
        unlockAudio();
        clearSelection(e);
      }}
    >
      <audio ref={audioRef} src="/song/UI.mp3" loop />

      <img
        src={wallpapers[bgIndex]}
        className={`fullscreen-bg ${fading ? "fade" : ""}`}
        draggable={false}
      />

      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          selected={selectedId === icon.id}
          onMouseDown={(e) => {
            unlockAudio();
            onIconMouseDown(e, icon.id);
          }}
          onDoubleClick={() => setOpenWindow(icon.name)}
        />
      ))}

      {dragGhost && <DragGhost icon={dragGhost} />}

      {openWindow && (
        <FolderWindow
          title={openWindow}
          onClose={() => setOpenWindow(null)}
        />
      )}

      <Taskbar
        icons={icons}
        onOpenApp={(name) => setOpenWindow(name)}
        onRefresh={changeWallpaper}
        audioRef={audioRef}
      />
    </div>
  );
}
