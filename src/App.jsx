import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/auth-hook";
import { AuthContext } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatRoomPage from "./pages/ChatroomPage";
import AllGroupPage from "./pages/AllGroup";
import CreateGroupPage from "./pages/CreateGroup";
import EditProfilePage from "./pages/EditProfile";
import { SocketContext } from "./contexts/SocketContext";

function App() {
  const [token, login, logout, userInfo, setUserInfo] = useAuth();
  const [socket, setSocket] = useState(null);
  return (
    <AuthContext.Provider
      value={{ token, login, logout, userInfo, setUserInfo }}
    >
      <SocketContext.Provider
        value={{ socket, setSocket }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="login" />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/chatroom" element={<ChatRoomPage />}></Route>
          <Route path="/all-group" element={<AllGroupPage />}></Route>
          <Route path="/create-group" element={<CreateGroupPage />}></Route>
          <Route path="/edit-profile" element={<EditProfilePage />}></Route>
        </Routes>{" "}
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
