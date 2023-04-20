import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatRoomPage from "./pages/ChatroomPage";
function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="login" />}></Route>
    <Route path="/login" element={<LoginPage />}></Route>
    <Route path="/register" element={<RegisterPage />}></Route>
    <Route path="/chatroom" element={<ChatRoomPage />}></Route>
  </Routes>
}

export default App;
