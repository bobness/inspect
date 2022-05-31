import axios from 'axios';
const baseUrl = 'https://api.inspection.com';

const instance = axios.create({ baseURL: baseUrl });

const setToken = (token) => {
    axios.defaults.headers.common['Authorization'] = token;
};

const removeToken = () => {
    axios.defaults.headers.common['Authorization'] = '';
};

export {
    instance,
    setToken,
    removeToken,
}