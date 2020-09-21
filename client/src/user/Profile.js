import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../authHelper";
import Base from "../core/Base";
import Feed from "./Feed";
import FriendReq from "./helper/FriendReq";
import ImageHelper from "./helper/ImageHelper";
import { getUser } from "./helper/userapicalls";

const Profile = () => {
  const { user, token } = isAuthenticated();
  const [users, setUsers] = useState({
    firstname: "",
    lastname: "",
    city: "",
  });
  const [error, setError] = useState("");

  const { firstname, lastname } = users;

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

  useEffect(() => {
    preload(user._id);
  }, []);

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
        </div>
        <div className="col-6">
          <Feed />
        </div>
        <div className="col-3">
          <FriendReq />
        </div>
      </div>
      {/* {console.log(users)} */}
    </Base>
  );
};

export default Profile;
