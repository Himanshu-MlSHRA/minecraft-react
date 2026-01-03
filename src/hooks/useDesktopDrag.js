import { useRef, useState } from "react";
import { GRID_SIZE, DRAG_THRESHOLD } from "../constants/desktop";

export function useDesktopDrag(icons, setIcons) {
  const [selectedId, setSelectedId] = useState(null);
  const [dragGhost, setDragGhost] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
      setDragGhost({ ...activeIcon.current, x: e.clientX, y: e.clientY });
    }

    if (isDragging) {
      setDragGhost(prev => prev && { ...prev, x: e.clientX, y: e.clientY });
    }
  };

  const onMouseUp = (e) => {
    if (!isDragging || !dragGhost) {
      reset();
      return;
    }

    const col = Math.floor(e.clientX / GRID_SIZE);
    const row = Math.floor(e.clientY / GRID_SIZE);

    setIcons(prev => {
      const dragged = prev.find(i => i.id === dragGhost.id);
      const target = prev.find(
        i => i.col === col && i.row === row && i.id !== dragged.id
      );

      if (target) {
        return prev.map(i =>
          i.id === dragged.id
            ? { ...i, col, row }
            : i.id === target.id
            ? { ...i, col: dragged.col, row: dragged.row }
            : i
        );
      }

      return prev.map(i =>
        i.id === dragged.id ? { ...i, col, row } : i
      );
    });

    reset();
  };

  const reset = () => {
    setIsDragging(false);
    setDragGhost(null);
    mouseStart.current = null;
    activeIcon.current = null;
  };

  return {
    selectedId,
    dragGhost,
    onIconMouseDown,
    onMouseMove,
    onMouseUp,
    clearSelection: () => setSelectedId(null),
  };
}
