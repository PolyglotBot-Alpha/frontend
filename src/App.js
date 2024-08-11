import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Payment from "./pages/Payment.js";
import SenddingAlert from "./components/SenddingAlert.js";
function App() {
  return (
    // <BrowserRouter> already in index.js
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/alert" element={<SenddingAlert />} />
    </Routes>
    // </BrowserRouter>
  );
}

export default App;
