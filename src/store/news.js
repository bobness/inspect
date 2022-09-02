import { instance } from "./api";

const getUnreadNews = () => {
  return instance.get("/unread_summaries").then((res) => res.data);
};

const markAsRead = (id) => {
  return instance.put(`/unread_summaries/${id}`).then((res) => res.data);
};

const getAllNews = () => {
  return instance.get("/summaries").then((res) => res.data);
};

const searchInformation = (keyword) => {
  return instance.get("/search?keyword=" + keyword).then((res) => res.data);
};

const getNewsById = (newsId) => {
  return instance.get("/summaries/id/" + newsId).then((res) => res.data);
};

const postComment = (commentData) => {
  return instance.post("/comments", commentData);
};

const postReaction = (reactionData) => {
  return instance.post("/reactions", reactionData);
};

const getSuggestAuthors = () => {
  return instance.get("/summaries/suggest-authors").then((res) => res.data);
};

const followAuthor = (followerData) => {
  return instance.post("/followers", followerData);
};

export {
  getUnreadNews,
  markAsRead,
  getAllNews,
  searchInformation,
  getNewsById,
  postComment,
  postReaction,
  getSuggestAuthors,
  followAuthor,
};
