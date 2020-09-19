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
