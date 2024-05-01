import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Main.js';
import GoogleSignIn from "./pages/GoogleSignIn.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<GoogleSignIn />} />
    </Routes>
  );
}

export default App;
