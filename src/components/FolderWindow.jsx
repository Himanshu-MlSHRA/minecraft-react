export default function FolderWindow({ title, onClose }) {
  return (
    <div className="folder-window">
      <div className="folder-header">
        <span>{title}</span>
        <button onClick={onClose}>✕</button>
        
      </div>

      <div className="folder-grid">
        <div className="file-item">
          <div className="file-icon">📄</div>
          File 1
        </div>
        <div className="file-item">
          <div className="file-icon">📁</div>
          Folder
        </div>
      </div>
    </div>
  );
}
