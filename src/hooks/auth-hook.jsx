import React, { useState, useEffect } from "react";
import { apiClient } from "../utils/apiClient";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const login = (userInfo) => {
    const { avatar, id, nickname, token, username } = userInfo;
    setToken(token);
    setUserInfo({ nickname: nickname, avatar: avatar, username: username, _id: id });
    localStorage.setItem("token", token)
  };

  const logout = () => {
    setToken(null);
    setUserInfo(null)
    localStorage.removeItem("token")
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.post("/user/loginme");
      login(res.data);
    };
    const token = localStorage.getItem("token");
    if (token) {
      fetchData();
    }
  }, []);

  return [token, login, logout, userInfo, setUserInfo];
};
