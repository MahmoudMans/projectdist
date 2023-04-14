// src/components/FileUpload.js
import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        }
      );

      if (response.status === 200) {
        alert("File uploaded successfully.");
        setFile(null);
        setUploadProgress(0);
      } else {
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      alert("Error during file upload. Please try again.");
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">Select File</label>
          <input type="file" name="file" onChange={handleChange} required />
        </div>
        {uploadProgress > 0 && (
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;
