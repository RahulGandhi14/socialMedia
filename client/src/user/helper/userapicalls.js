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

export const sendRequest = (userId, friend, token) => {
  return fetch(`${API}/user/sendrequest/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(friend),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getRequests = (userId, token) => {
  return fetch(`${API}/user/myrequests/${userId}`, {
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

export const acceptRequest = (userId, friend, token) => {
  return fetch(`${API}/user/acceptrequest/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(friend),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const rejectRequest = (userId, friend, token) => {
  return fetch(`${API}/user/rejectrequest/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(friend),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const loadFeed = (userId, token) => {
  return fetch(`${API}/user/feed/${userId}`, {
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

export const postLike = (userId, postId, token) => {
  return fetch(`${API}/post/like/${postId}/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
