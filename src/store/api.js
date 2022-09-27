import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// const baseUrl = "http://inspect.datagotchi.net:5000";
const baseUrl = "http://localhost:5000";

const instance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
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
