import axios from "axios";
import { API_URL } from "../config/env";

export const authClient = axios.create({
  baseURL: API_URL,
});

export const getMyInfo = () => {};

export const getAccessToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }


  // Renew access token if expired
//   const now = new Date();
//   const expiry = new Date(expiresOn);
//   if (now > expiry) {
//     const newAccessToken = await renewAccessToken(reToken);
//     if (!newAccessToken) {
//       return null;
//     }
//     return newAccessToken;
//   }
  return token;
};

// export const renewAccessToken = async (refreshToken) => {
//   let res;
//   try {
//     res = await authClient.post("/auth/refreshToken", {
//       refresh_token: refreshToken,
//     });
//   } catch (err) {
//     return null;
//   }

//   const expiresOn = new Date();
//   expiresOn.setSeconds(expiresOn.getSeconds() + res.data.expires_in);
//   localStorage.setItem(
//     "userData",
//     JSON.stringify({
//       acToken: res.data.access_token,
//       reToken: res.data.refresh_token,
//       expiresOn,
//     })
//   );
//   return res.data.access_token;
// };
