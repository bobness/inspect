import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseUrl = 'http://18.116.14.240/api';

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