import { instance } from "./api";

const getAllNews = () => {
    return instance.get('/summaries').then(res => res.data);
};

const searchInformation = (keyword) => {
    return instance.get('/search?keyword=' + keyword).then(res => res.data);
};

const getNewsById = (newsId) => {
    return instance.get('/summaries/id/' + newsId).then(res => res.data);
};

const postComment = (newsId, commentData) => {
    return instance.post('/summaires/comment/' + newsId, commentData);
};

const postReaction = (newsId, reaction) => {
    return instance.post('/summaries/reaction/' + newsId, { reaction });
};

export {
    getAllNews,
    searchInformation,
    getNewsById,
    postComment,
    postReaction,
}