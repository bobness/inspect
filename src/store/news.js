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

const postComment = (commentData) => {
    return instance.post('/comments', commentData);
};

const postReaction = (reactionData) => {
    return instance.post('/reactions', reactionData);
};

export {
    getAllNews,
    searchInformation,
    getNewsById,
    postComment,
    postReaction,
}