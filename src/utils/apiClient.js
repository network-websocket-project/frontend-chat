import axios from "axios";
import { API_URL } from "../config/env";
import { getAccessToken } from "./auth";

export const apiClient=axios.create({
    baseURL:API_URL
})

apiClient.interceptors.request.use(
    async (config) => {
      const accessToken = await getAccessToken()
      if (!accessToken) {
        // TODO: Handle error
        return config
      }
      return {
        ...config,
        headers: { ...config.headers, Authorization: accessToken },
      }
    },
    // TODO: Handle other error
    (err) => Promise.reject(err)
  )