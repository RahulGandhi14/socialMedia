import { API } from "../../backend";

export const updateUser = (userId, user, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: user,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getUser = (userId, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const createPost = (userId, token, postData) => {
  return fetch(`${API}/post/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: postData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getPosts = (userId, token) => {
  return fetch(`${API}/posts/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
