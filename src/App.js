import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
function App() {
  return (
    // <BrowserRouter> already in index.js
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    // </BrowserRouter>
  );
}

export default App;
