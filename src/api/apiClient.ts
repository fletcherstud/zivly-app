import axios from "axios";
import * as SecureStore from "expo-secure-store";
import axiosRetry from "axios-retry";
import { Platform } from "react-native";

const axiosClient = axios.create({
  // baseURL: "https://api.knowheresocial.com",
  // baseURL: "http://10.0.0.126:8080",
  baseURL: "http://localhost:8080",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log("Retrying: ", retryCount);
    return retryCount * 1000;
  },
});

axiosClient.interceptors.request.use(
  async function (request) {
    const accessToken = await SecureStore.getItemAsync("userAccessToken");

    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    request.headers["Client-Id"] = "mobile-user";
    request.headers["Platform"] = Platform.OS === "ios" ? "iOS" : "Android";
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
