import React, { useState, useRef } from "react";

const GRID_SIZE = 100;
const ICON_SIZE = 64;
const DRAG_THRESHOLD = 6;

const initialIcons = [
  { id: 1, name: "About me", icon: "/icons/chest.ico", col: 0, row: 0 },
  { id: 2, name: "Projects", icon: "/icons/bookshelf.ico", col: 0, row: 1 },
  { id: 3, name: "Skills", icon: "/icons/creeper-flat.ico", col: 0, row: 2 },
  { id: 4, name: "Photos", icon: "/icons/noteblock.ico", col: 0, row: 3 },
];

const App = () => {
  const [icons, setIcons] = useState(initialIcons);
  const [selectedId, setSelectedId] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragGhost, setDragGhost] = useState(null);

  const mouseStart = useRef(null);
  const activeIcon = useRef(null);

  const onIconMouseDown = (icon, e) => {
    e.stopPropagation();
    setSelectedId(icon.id);

    mouseStart.current = { x: e.clientX, y: e.clientY };
    activeIcon.current = icon;
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!mouseStart.current || !activeIcon.current) return;

    const dx = Math.abs(e.clientX - mouseStart.current.x);
    const dy = Math.abs(e.clientY - mouseStart.current.y);

    if (!isDragging && (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD)) {
      setIsDragging(true);
      setDragGhost({
        id: activeIcon.current.id,
        icon: activeIcon.current.icon,
        name: activeIcon.current.name,
        x: e.clientX,
        y: e.clientY,
      });
    }

    if (isDragging) {
      setDragGhost((prev) =>
        prev ? { ...prev, x: e.clientX, y: e.clientY } : prev
      );
    }
  };

  const onMouseUp = (e) => {
  if (!isDragging || !dragGhost) {
    // reset
    setIsDragging(false);
    setDragGhost(null);
    mouseStart.current = null;
    activeIcon.current = null;
    return;
  }

  const targetCol = Math.floor(e.clientX / GRID_SIZE);
  const targetRow = Math.floor(e.clientY / GRID_SIZE);

  setIcons((prevIcons) => {
    const dragged = prevIcons.find(i => i.id === dragGhost.id);
    const target = prevIcons.find(
      i => i.col === targetCol && i.row === targetRow && i.id !== dragged.id
    );

    // CASE 1: kisi aur icon ke upar drop kiya → SWAP
    if (target) {
      return prevIcons.map(icon => {
        if (icon.id === dragged.id) {
          return { ...icon, col: targetCol, row: targetRow };
        }
        if (icon.id === target.id) {
          return { ...icon, col: dragged.col, row: dragged.row };
        }
        return icon;
      });
    }

    // CASE 2: empty cell → normal move
    return prevIcons.map(icon =>
      icon.id === dragged.id
        ? { ...icon, col: targetCol, row: targetRow }
        : icon
    );
  });

  // reset drag state
  setIsDragging(false);
  setDragGhost(null);
  mouseStart.current = null;
  activeIcon.current = null;
};


  const onDesktopClick = () => {
    setSelectedId(null);
  };

  return (
    <div onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseDown={onDesktopClick}>
      <img src="/bg/minecraft.png" className="fullscreen-bg" />

      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`desktop-item ${selectedId === icon.id ? "selected" : ""}`}
          onMouseDown={(e) => onIconMouseDown(icon, e)}
          style={{
            left: icon.col * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2,
            top: icon.row * GRID_SIZE + 10,
          }}
        >
          <img src={icon.icon} />
          <span>{icon.name}</span>
        </div>
      ))}

      {dragGhost && (
        <div
          className="ghost-item"
          style={{
            left: dragGhost.x - ICON_SIZE / 2,
            top: dragGhost.y - ICON_SIZE / 2,
          }}
        >
          <img src={dragGhost.icon} />
          <span>{dragGhost.name}</span>
        </div>
      )}
    </div>
  );
};

export default App;
