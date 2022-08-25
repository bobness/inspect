// import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorage } from "react-native"; // expo compatibility
import axios from "axios";

// const baseUrl = "http://inspect.datagotchi.net:5000";
const baseUrl = "http://10.0.0.177:5000";

/*
ar NetworkInfo = require('react-native-network-info');

// Get Local IP
NetworkInfo.getIPAddress(ip => {
  console.log(ip);
});
*/

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

export { instance, setToken, removeToken };
