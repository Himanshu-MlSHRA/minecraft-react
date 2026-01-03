import { useState } from "react";
import { initialIcons } from "../data/desktopIcons";
import { useDesktopDrag } from "../hooks/useDesktopDrag";
import DesktopIcon from "./DesktopIcon";
import DragGhost from "./DragGhost";
import FolderWindow from "./FolderWindow";
import Taskbar from "./Taskbar";

export default function Desktop() {
  const [icons, setIcons] = useState(initialIcons);
  const [openWindow, setOpenWindow] = useState(null);

  const {
    selectedId,
    dragGhost,
    onIconMouseDown,
    onMouseMove,
    onMouseUp,
    clearSelection,
  } = useDesktopDrag(icons, setIcons);

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseDown={clearSelection}
    >
      <img src="/bg/minecraft.png" className="fullscreen-bg" />

      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          selected={selectedId === icon.id}
          onMouseDown={onIconMouseDown}
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
      />
    </div>
  );
}
