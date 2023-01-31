import { instance } from "./api";

// TODO: remove the res.data thens because that breaks debugging

const userLogin = (data) => {
  return instance.post("/login", data);
};

const userRegister = (data) => {
  return instance.post("/register", data).then((res) => res.data);
};

const userLogout = () => {
  return instance.post("/logout");
};

const getAuthUser = () => {
  return instance.get("/users");
};

const getProfileInformation = (userId) => {
  return instance.get("/users/" + userId).then((res) => res.data);
};

const updateProfile = (data) => {
  return instance.put("/users", data).then((res) => res.data);
};

const deleteAccount = (userId) => {
  return instance.delete("/users/" + userId);
};

const updateUserExpoToken = (expo_token) => {
  return instance.put("/notification", { expo_token }).then((res) => res.data);
};

const resetPassword = (email) => {
  return instance.post("/reset-password", { email });
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
