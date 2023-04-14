const axios = require("axios");
const fs = require("fs");
const HDFS_API_URL = "http://127.0.0.1:9870/webhdfs/v1";

const HDFS_USER = "mahmo";

const hdfsAxios = axios.create({
  baseURL: HDFS_API_URL,
  params: {
    "user.name": HDFS_USER,
  },
});
async function uploadFileToHDFS(localFilePath, hdfsFilePath) {
  try {
    const fileStream = fs.createReadStream(localFilePath);

    const response = await hdfsAxios.put(
      `${hdfsFilePath}?op=CREATE`,
      fileStream,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "Transfer-Encoding": "chunked",
        },
      }
    );

    if (response.status === 201) {
      console.log(`File uploaded to HDFS: ${hdfsFilePath}`);
    } else {
      throw new Error(`Failed to upload file to HDFS: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error uploading file to HDFS: ${error.message}`);
    throw error;
  }
}
async function checkFileExistsInHDFS(hdfsFilePath) {
  try {
    const response = await hdfsAxios.get(`${hdfsFilePath}?op=GETFILESTATUS`);

    if (response.status === 200) {
      console.log(`File exists in HDFS: ${hdfsFilePath}`);
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`File not found in HDFS: ${hdfsFilePath}`);
      return false;
    }
    console.error(`Error checking file existence in HDFS: ${error.message}`);
    throw error;
  }
}
async function listFilesInHDFS(directoryPath) {
  try {
    const response = await hdfsAxios.get(`${directoryPath}?op=LISTSTATUS`);

    if (response.status === 200 && response.data.FileStatuses) {
      const files = response.data.FileStatuses.FileStatus.map((fileStatus) => ({
        filename: fileStatus.pathSuffix,
        length: fileStatus.length,
        modificationTime: fileStatus.modificationTime,
      }));

      console.log(`Files in HDFS directory (${directoryPath}):`, files);
      return files;
    } else {
      throw new Error(
        `Failed to list files in HDFS directory (${directoryPath}): ${response.status}`
      );
    }
  } catch (error) {
    console.error(
      `Error listing files in HDFS directory (${directoryPath}): ${error.message}`
    );
    throw error;
  }
}
async function downloadFileFromHDFS(hdfsFilePath, localFilePath) {
  try {
    const response = await hdfsAxios.get(`${hdfsFilePath}?op=OPEN`, {
      responseType: "stream",
    });

    if (response.status === 200) {
      const writer = fs.createWriteStream(localFilePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } else {
      throw new Error(`Failed to download file from HDFS: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error downloading file from HDFS: ${error.message}`);
    throw error;
  }
}

async function deleteFileFromHDFS(hdfsFilePath) {
  try {
    const response = await hdfsAxios.delete(`${hdfsFilePath}?op=DELETE`);

    if (response.status === 200 && response.data.boolean) {
      console.log(`File deleted from HDFS: ${hdfsFilePath}`);
    } else {
      throw new Error(`Failed to delete file from HDFS: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting file from HDFS: ${error.message}`);
    throw error;
  }
}
async function renameFileInHDFS(oldHdfsFilePath, newHdfsFilePath) {
  try {
    const response = await hdfsAxios.put(
      `${oldHdfsFilePath}?op=RENAME&destination=${encodeURIComponent(
        newHdfsFilePath
      )}`
    );

    if (response.status === 200 && response.data.boolean) {
      console.log(
        `File renamed in HDFS: ${oldHdfsFilePath} -> ${newHdfsFilePath}`
      );
    } else {
      throw new Error(`Failed to rename file in HDFS: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error renaming file in HDFS: ${error.message}`);
    throw error;
  }
}

module.exports = {
  hdfsAxios,
  uploadFileToHDFS,
  checkFileExistsInHDFS,
  listFilesInHDFS,
  downloadFileFromHDFS,
  deleteFileFromHDFS,
  renameFileInHDFS,
};
