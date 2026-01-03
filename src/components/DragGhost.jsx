import { ICON_SIZE } from "../constants/desktop";

export default function DragGhost({ icon }) {
  return (
    <div
      className="ghost-item"
      style={{
        left: icon.x - ICON_SIZE / 2,
        top: icon.y - ICON_SIZE / 2,
      }}
    >
      <img src={icon.icon} />
      <span>{icon.name}</span>
    </div>
  );
}
