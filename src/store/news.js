import { instance } from "./api";

const getUnreadNews = () => {
  return instance.get(`/api/unread_summaries`);
};

const markAsRead = (id) => {
  return instance.put(`/api/unread_summaries/${id}`).then((res) => res.data);
};

const getAllNews = () => {
  return instance.get("/api/summaries").then((res) => res.data);
};

const searchSummaries = (keyword) => {
  return instance
    .get("/api/search/summaries?keyword=" + keyword)
    .then((res) => res.data);
};

const searchUsers = (keyword) => {
  return instance
    .get("/api/search/users?keyword=" + keyword)
    .then((res) => res.data);
};

const getNewsById = (newsId) => {
  return instance.get("/api/summaries/id/" + newsId).then((res) => res.data);
};

const getNewsByUid = (newsUid) => {
  return instance.get("/api/summaries/uid/" + newsUid).then((res) => res.data);
};

const createSummary = (summary) => {
  return instance.post("/api/summaries", summary).then((res) => res.data);
};

const updateSummary = (id, updateBlock) => {
  return instance
    .put(`/api/summaries/${id}`, updateBlock)
    .then((res) => res.data);
};

const postComment = (commentData) => {
  return instance.post("/api/comments", commentData);
};

const deleteComment = (commentId) => {
  return instance.delete(`/api/comments/${commentId}`);
};

const postReaction = (reactionData) => {
  return instance.post("/api/reactions", reactionData);
};

const deleteSummary = (summaryId) => {
  return instance.delete(`/api/summaries/${summaryId}`);
};

const getSuggestAuthors = () => {
  return instance.get("/api/summaries/suggest-authors").then((res) => res.data);
};

const followAuthor = (followerData) => {
  return instance.post("/api/followers", followerData);
};

const unfollowAuthor = (authorId) => {
  return instance.delete(`/api/followers/${authorId}`);
};

const blockUser = (userId) => {
  return instance.post("/api/blocks", { user_id: userId });
};

const unblockUser = (userId) => {
  return instance.delete("/api/blocks/" + userId);
};

const sendNotification = (data) => {
  return instance.post("/api/notification", data).then((res) => res.data);
};

const addToDigests = (data) => {
  return instance.post("/api/digests", data).then((res) => res.data);
};

const getSource = (baseUrl) => {
  return instance.get(`/api/sources/${baseUrl}`).then((res) => res.data);
};

const createSource = (baseUrl) => {
  return instance.post(`/api/sources/${baseUrl}`).then((res) => res.data);
};

const postShare = (summaryId, service, message) => {
  return instance
    .post("/api/shares", { summaryId, service, message })
    .then((res) => res.data);
};

export {
  getUnreadNews,
  markAsRead,
  getAllNews,
  searchSummaries,
  searchUsers,
  getNewsById,
  createSummary,
  postComment,
  deleteComment,
  postReaction,
  deleteSummary,
  getSuggestAuthors,
  followAuthor,
  unfollowAuthor,
  sendNotification,
  addToDigests,
  updateSummary,
  getSource,
  createSource,
  getNewsByUid,
  postShare,
  blockUser,
  unblockUser,
};
