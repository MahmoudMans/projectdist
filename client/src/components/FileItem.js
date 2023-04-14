// src/components/FileItem.js
import React from "react";

const FileItem = ({ file }) => {
  const downloadUrl = `http://localhost:3001/api/files/download/${file.filename}`;

  return (
    <div className="file-item">
      <div className="file-name">
        <a href={downloadUrl}>{file.filename}</a>
      </div>
      <div className="file-actions">
        {/* Add action buttons for sharing, renaming, and deleting the file */}
      </div>
    </div>
  );
};

export default FileItem;
