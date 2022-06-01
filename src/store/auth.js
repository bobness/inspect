import { instance } from "./api";

const userLogin = (data) => {
    return instance.post('/login', data).then(res => res.data);
};

const userRegister = (data) => {
    return instance.post('/register', data).then(res => res.data);
};

const userLogout = () => {
    return instance.post('/logout').then(res => res.data);
};

const getAuthUser = () => {
    return instance.get('/users').then(res => res.data);
};

const getProfileInformation = (userId) => {
    return instance.get('/users/' + userId).then(res => res.data);
};

export {
    userLogin,
    userRegister,
    userLogout,
    getAuthUser,
    getProfileInformation,
}