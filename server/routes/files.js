// routes/files.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const router = express.Router();
const {
  uploadFileToHDFS,
  checkFileExistsInHDFS,
  listFilesInHDFS,
  downloadFileFromHDFS,
  deleteFileFromHDFS,
  renameFileInHDFS,
} = require("../hdfsHelper");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  const localFilePath = req.file.path;
  const hdfsFilePath = `/uploads/${req.file.originalname}`;

  try {
    await uploadFileToHDFS(localFilePath, hdfsFilePath);

    const fileExists = await checkFileExistsInHDFS(hdfsFilePath);
    if (fileExists) {
      res.status(201).send({ message: "File uploaded to HDFS successfully" });
    } else {
      res.status(500).send({ message: "File not found in HDFS after upload" });
    }
  } catch (error) {
    console.error("Error during file upload:", error.message);
    res
      .status(500)
      .send({ message: "Failed to upload file to HDFS", error: error.message });
  }
});

router.get("/download/:filename", async (req, res) => {
  const localFilePath = path.join("downloads", req.params.filename);
  const hdfsFilePath = `/uploads/${req.params.filename}`;

  try {
    await downloadFileFromHDFS(hdfsFilePath, localFilePath);
    res.download(localFilePath);
  } catch (error) {
    console.error("Error during file download:", error.message);
    res.status(500).send({
      message: "Failed to download file from HDFS",
      error: error.message,
    });
  }
});

router.get("/share/:filename", (req, res) => {
  // Implement file sharing logic here
  res.json({ message: "File shared successfully" });
});

router.delete("/delete/:filename", async (req, res) => {
  const hdfsFilePath = `/uploads/${req.params.filename}`;

  try {
    await deleteFileFromHDFS(hdfsFilePath);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error during file deletion:", error.message);
    res.status(500).send({
      message: "Failed to delete file from HDFS",
      error: error.message,
    });
  }
});

// Add this route to fetch the list of files
router.get("/", async (req, res) => {
  try {
    const files = await listFilesInHDFS("/uploads");
    res.status(200).json(files);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching files. Please try again." });
  }
});

router.post("/rename/:filename", async (req, res) => {
  const oldHdfsFilePath = `/uploads/${req.params.filename}`;
  const newHdfsFilePath = `/uploads/${req.body.newName}`;

  try {
    await renameFileInHDFS(oldHdfsFilePath, newHdfsFilePath);
    res.json({ message: "File renamed successfully" });
  } catch (error) {
    console.error("Error during file renaming:", error.message);
    res
      .status(500)
      .send({ message: "Failed to rename file in HDFS", error: error.message });
  }
});

module.exports = router;
