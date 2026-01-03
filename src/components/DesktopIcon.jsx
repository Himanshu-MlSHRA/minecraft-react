import { GRID_SIZE, ICON_SIZE } from "../constants/desktop";

export default function DesktopIcon({
  icon,
  selected,
  onMouseDown,
  onDoubleClick,
}) {
  return (
    <div
      className={`desktop-item ${selected ? "selected" : ""}`}
      onMouseDown={(e) => onMouseDown(icon, e)}
      onDoubleClick={onDoubleClick}
      style={{
        left: icon.col * GRID_SIZE + (GRID_SIZE - ICON_SIZE) / 2,
        top: icon.row * GRID_SIZE + 10,
      }}
    >
      <img src={icon.icon} />
      <span>{icon.name}</span>
    </div>
  );
}
