import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseUrl = 'http://1211-66-154-105-197.ngrok.io';

const instance = axios.create({ baseURL: baseUrl });

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