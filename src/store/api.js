import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// const baseUrl = 'http://18.116.14.240/api';
const baseUrl = 'http://4b82-66-154-105-197.ngrok.io';

const instance = axios.create({ baseURL: baseUrl, headers: { 'Content-Type': 'application/json' } });

const setToken = async (token = '') => {
    if (!token) {
        token = await AsyncStorage.getItem('@access_token')
    }
    instance.defaults.headers.common['x-access-token'] = token;
};

const removeToken = () => {
    instance.defaults.headers.common['x-access-token'] = '';
};

setToken();

export {
    instance,
    setToken,
    removeToken,
}