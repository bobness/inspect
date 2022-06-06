import axios from 'axios';
const baseUrl = 'http://localhost:5000';

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