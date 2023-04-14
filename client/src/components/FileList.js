// src/components/FileList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import FileItem from "./FileItem"; // Import the FileItem component

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/files");
        if (response.status === 200) {
          setFiles(response.data);
        } else {
          alert("Error fetching files. Please try again.");
        }
      } catch (error) {
        alert("Error fetching files. Please try again.");
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="file-list">
      <h2>File List</h2>
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.filename}>
              <FileItem file={file} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
