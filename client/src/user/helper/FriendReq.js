import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../../authHelper";
import {
  getRequests,
  acceptRequest,
  rejectRequest,
} from "../../user/helper/userapicalls";
import ImageHelper from "./ImageHelper";

const FriendReq = () => {
  const [friendReqs, setFriendReqs] = useState([]);
  const [error, setError] = useState("");
  const { user, token } = isAuthenticated();
  const [reload, setReload] = useState(false);

  const preloadReqs = () => {
    getRequests(user._id, token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setFriendReqs(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    preloadReqs();
  }, [reload]);

  const acceptReq = (req) => {
    // console.log("on click");
    acceptRequest(user._id, req, token).then((data) => {
      if (data?.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        setReload(!reload);
      }
    });
  };

  const rejectReq = (req) => {
    // console.log("on click");
    rejectRequest(user._id, req, token).then((data) => {
      if (data?.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        setReload(!reload);
      }
    });
  };
  const friendReqCard = (req, index) => (
    <div className="card my-2" key={index}>
      <div className="card-header p-1">
        <h4 className="p-1">
          {req.requester.firstname} {req.requester.lastname}
        </h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-7">
            <ImageHelper
              obj={req.requester}
              getFor="user"
              style={{
                height: "auto",
                width: "150px",
              }}
            />
          </div>
          <div className="col-5">
            <button
              onClick={() => acceptReq(req)}
              className="btn btn-block btn-success float-left"
            >
              Accept
            </button>
            <button
              onClick={() => rejectReq(req)}
              className="btn btn-block btn-danger float-right"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {friendReqs.length > 0 ? (
        <h4 className="alert alert-info">Friend requests</h4>
      ) : (
        <h4 className="alert alert-danger">No friend requests</h4>
      )}
      {friendReqs.map((req, index) => friendReqCard(req, index))}
    </div>
  );
};

export default FriendReq;
