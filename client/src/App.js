import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/files" element={<FileList />} />
      </Routes>
    </Router>
  );
}

export default App;
