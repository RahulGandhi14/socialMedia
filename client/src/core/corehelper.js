import { API } from "../backend";

export const getAllUsers = (userId, token) => {
  return fetch(`${API}/users/${userId}`, {
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
  return fetch(`${API}/user/acceptrequests/${userId}`, {
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
