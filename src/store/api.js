import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { httpsAgent } from "../globals";

// const baseUrl = "https://inspect.datagotchi.net";
const baseUrl = "https://localhost";

const instance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
  httpsAgent,
});

const setToken = async (token = "") => {
  if (!token) {
    token = await AsyncStorage.getItem("@access_token");
  }
  instance.defaults.headers.common["x-access-token"] = token;
};

const removeToken = () => {
  instance.defaults.headers.common["x-access-token"] = "";
};

setToken();

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status } = error.response;
    if (status === 401) {
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("@access_token");
    }
    throw error;
  }
);

export { instance, setToken, removeToken };
