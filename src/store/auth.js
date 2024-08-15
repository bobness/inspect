import { instance } from "./api";

// TODO: remove the res.data thens because that breaks debugging

const userLogin = (data) => {
  return instance.post("/api/login", data);
};

const userRegister = (data) => {
  return instance.post("/api/register", data).then((res) => res.data);
};

const userLogout = () => {
  return instance.post("/api/logout");
};

const getAuthUser = () => {
  return instance.get("/api/users");
};

const getProfileInformation = (userId) => {
  return instance.get("/api/users/" + userId).then((res) => res.data);
};

const updateProfile = (data) => {
  return instance.put("/api/users", data).then((res) => res.data);
};

const deleteAccount = (userId) => {
  return instance.delete("/api/users/" + userId);
};

const updateUserExpoToken = (expo_token) => {
  return instance
    .put("/api/notification", { expo_token })
    .then((res) => res.data);
};

const resetPassword = (email) => {
  return instance.post("/api/reset-password", { email });
};

export {
  userLogin,
  userRegister,
  userLogout,
  getAuthUser,
  getProfileInformation,
  updateProfile,
  updateUserExpoToken,
  deleteAccount,
  resetPassword,
};
