import { instance } from "./api";

const getAllNews = () => {
    return instance.get('/news').then(res => res.data);
};

const searchInformation = (keyword) => {
    return instance.get('/search?keyword=' + keyword).then(res => res.data);
};

const getNewsById = (newsId) => {
    return instance.get('/news/' + newsId).then(res => res.data);
};

const postComment = (newsId, commentData) => {
    return instance.post('/comments/' + newsId, commentData);
};

const getAllComments = (newsId) => {
    return instance.get('/comments/' + newsId).then(res => res.data);
};

const addReaction = (newsId, reaction) => {
    return instance.post('/news/' + newsId + '/reaction', { reaction });
};

export {
    getAllNews,
    searchInformation,
    getNewsById,
    postComment,
    getAllComments,
    addReaction,
}