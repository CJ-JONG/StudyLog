import axios from "axios";

import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredAuth,
  getStoredAccessToken,
} from "../utils/authStorage";

function isPublicAuthRequest(
  url?: string,
  method?: string
): boolean {
  const requestMethod = method?.toLowerCase();

  return (
    (url === "/members" && requestMethod === "post") ||
    url === "/members/login"
  );
}

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (
    accessToken &&
    !isPublicAuthRequest(config.url, config.method)
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isPublicAuthRequest(
        error.config?.url,
        error.config?.method
      )
    ) {
      clearStoredAuth();
      window.dispatchEvent(
        new Event(AUTH_UNAUTHORIZED_EVENT)
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
