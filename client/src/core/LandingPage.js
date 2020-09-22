import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../authHelper";
import Base from "./Base";
import ImageHelper from "../user/helper/ImageHelper";
import { getAllUsers } from "./corehelper";
import {
  sendRequest,
  fetchSentReqs,
  cancelRequest,
} from "../user/helper/userapicalls";
import Signup from "../user/Signup";
import Updates from "../user/Updates";

const LandingPage = () => {
  const [otherUsers, setOtherUsers] = useState([]);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);
  const [sentReqs, setSentReqs] = useState([]);

  const { user, token } = isAuthenticated();

  const preloadSentReqs = () => {
    fetchSentReqs(user._id, token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setSentReqs(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const loadAllUsers = (userId, token) => {
    getAllUsers(userId, token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setOtherUsers(data);
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
          setReload(!reload);
        }
      })
      .catch((err) => console.log(err));
  };

  const cancelReq = (friendObj) => {
    cancelRequest(user._id, friendObj, token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          // setSentReqs(data);
          setReload(!reload);
        }
      })
      .catch((err) => console.log(err));
  };

  const showUsers = (DBuser, index) => (
    <div className="card m-1" key={index}>
      <div className="card-header">
        {DBuser.firstname} {DBuser.lastname}
      </div>
      <div className="card-body row">
        <div className="col-7">
          <ImageHelper obj={DBuser} getFor="user" />
        </div>
        <div className="col-5">
          <p>From {DBuser.city}</p>
          {sentReqs.includes(DBuser._id) ? (
            <button
              onClick={() => cancelReq(DBuser)}
              className="btn btn-block btn-danger"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => sendReq(DBuser)}
              className="btn btn-block btn-success"
            >
              Request
            </button>
          )}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    preloadSentReqs();
    loadAllUsers(user._id, token);
  }, [reload]);

  return (
    <Base>
      {isAuthenticated ? (
        <div className="row">
          <div className="col-8">
            <Updates />
          </div>
          <div className="col-4">
            <h4 className="alert alert-info">Make New Friends</h4>
            {otherUsers.map((DBuser, index) => {
              if (DBuser._id !== user._id) return showUsers(DBuser, index);
            })}
          </div>
        </div>
      ) : (
        <Signup />
      )}
      {/* {console.log(sentReqs)} */}
    </Base>
  );
};

export default LandingPage;
