import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  login: (userInfo) => { },
  logout: () => { },
  setUserInfo: () => { },
  userInfo: {},
});