import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatRoomPage from "./pages/ChatroomPage";
import AllGroupPage from "./pages/AllGroup";
import CreateGroupPage from "./pages/CreateGroup";

function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="login" />}></Route>
    <Route path="/login" element={<LoginPage />}></Route>
    <Route path="/register" element={<RegisterPage />}></Route>
    <Route path="/chatroom" element={<ChatRoomPage />}></Route>
    <Route path="/all-group" element={<AllGroupPage />}></Route>
    <Route path="/create-group" element={<CreateGroupPage />}></Route>
  </Routes>
}

export default App;
