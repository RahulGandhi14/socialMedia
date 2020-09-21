import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../authHelper";
import Base from "./Base";
import ImageHelper from "../user/helper/ImageHelper";
import { getAllUsers } from "./corehelper";
import { sendRequest } from "../user/helper/userapicalls";
import Signup from "../user/Signup";
import Updates from "../user/Updates";

const LandingPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [reqState, setReqState] = useState("Request");

  const { user, token } = isAuthenticated();

  const loadAllUsers = (userId, token) => {
    getAllUsers(userId, token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setUsers(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const sendReq = (friendObj) => {
    sendRequest(user._id, friendObj, token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          console.log("DATA", data);
          if (data.status === 1) {
            setReqState("Sent");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const showUsers = (user, index) => (
    <div className="card m-1" key={index}>
      <div className="card-header">
        {user.firstname} {user.lastname}
      </div>
      <div className="card-body row">
        <div className="col-7">
          <ImageHelper obj={user} getFor="user" />
        </div>
        <div className="col-5">
          <p>From {user.city}</p>
          <button
            onClick={() => sendReq(user)}
            className="btn btn-block btn-success"
          >
            {reqState}
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    loadAllUsers(user._id, token);
  }, []);

  return (
    <Base>
      {isAuthenticated ? (
        <div className="row">
          <div className="col-8">
            <Updates />
          </div>
          <div className="col-4">
            <h4 className="alert alert-info">Make New Friends</h4>
            {users.map((DBuser, index) => {
              if (DBuser._id !== user._id) return showUsers(DBuser, index);
            })}
          </div>
        </div>
      ) : (
        <Signup />
      )}
    </Base>
  );
};

export default LandingPage;
