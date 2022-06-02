import { instance } from "./api";

const getAllNews = () => {
    return instance.get('/summaries').then(res => res.data);
};

const searchInformation = (keyword) => {
    return instance.get('/search?keyword=' + keyword).then(res => res.data);
};

const getNewsById = (newsId) => {
    return instance.get('/summaries/' + newsId).then(res => res.data);
};

const postComment = (newsId, commentData) => {
    return instance.post('/comments/' + newsId, commentData);
};

const addReaction = (newsId, reaction) => {
    return instance.post('/reactions/' + newsId, { reaction });
};

export {
    getAllNews,
    searchInformation,
    getNewsById,
    postComment,
    getAllComments,
    addReaction,
}