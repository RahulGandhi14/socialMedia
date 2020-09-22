import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../authHelper";
import Base from "../core/Base";
import Feed from "./Feed";
import FriendReq from "./helper/FriendReq";
import ImageHelper from "./helper/ImageHelper";
import {
  getUser,
  fetchFriends,
  removeFromFriendList,
} from "./helper/userapicalls";

const Profile = () => {
  const { user, token } = isAuthenticated();
  const [users, setUsers] = useState({
    firstname: "",
    lastname: "",
    city: "",
  });
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);

  const { firstname, lastname } = users;

  const preloadFriends = () => {
    fetchFriends(user._id, token).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setFriends(data);
      }
    });
  };

  const removeFriend = (friend) => {
    console.log("ONCLICK");
    removeFromFriendList(user._id, token, friend).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setFriends(data);
        setReload(!reload);
      }
    });
  };

  const preload = (userId) => {
    getUser(userId)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setUsers({
            ...users,
            firstname: data.firstname,
            lastname: data.lastname,
            city: data.city,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const showFriends = (friend, index) => (
    <div className="card my-2" key={index}>
      <div className="card-header p-1">
        <h4 className="p-1">
          {friend.firstname} {friend.lastname}
        </h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-7">
            <ImageHelper
              obj={friend}
              getFor="user"
              style={{
                height: "auto",
                width: "150px",
              }}
            />
          </div>
          <div className="col-5">
            <button
              onClick={() => {
                removeFriend(friend);
              }}
              className="btn btn-block btn-danger float-right"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    preload(user._id);
    preloadFriends();
  }, [reload]);

  return (
    <Base>
      <div className="row">
        <div className="col-3">
          <div className="card text-center">
            <ImageHelper className="card-img-top" obj={user} getFor="user" />
            <div className="card-body">
              <h4 className="card-title">
                {firstname} {lastname}
              </h4>
              <p className="card-text">From {user.city}</p>
              <Link
                className="btn btn-primary btn-block"
                to={`/user/update/${user._id}`}
              >
                UPDATE
              </Link>
            </div>
          </div>
          <div>
            <h5 className="alert alert-info my-3">Show Friends</h5>
            {friends.length > 0 ? (
              friends.map((friend, index) => showFriends(friend, index))
            ) : (
              <p>NO FRIENDS</p>
            )}
          </div>
        </div>
        <div className="col-6">
          <Feed />
        </div>
        <div className="col-3">
          <FriendReq setReload={setReload} reload={reload} />
        </div>
      </div>
      {/* {console.log(friends)} */}
    </Base>
  );
};

export default Profile;
