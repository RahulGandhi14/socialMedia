import React, { useState, useEffect, Fragment } from "react";
import { isAuthenticated } from "../authHelper";
import ImageHelper from "./helper/ImageHelper";
import { loadFeed } from "./helper/userapicalls";

const Updates = () => {
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState("");
  const { user, token } = isAuthenticated();

  const preloadFeed = () => {
    loadFeed(user._id, token).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setFeed(data);
      }
    });
  };

  const likePost = (event, post) => {
    //
  };

  const feedCard = (post) => (
    <div className="card my-3">
      <div className="card-header font-weight-bold">
        @{post.user.firstname}_{post.user.lastname}
      </div>
      <div className="card-header text-center">
        <ImageHelper className="card-img-top" obj={post} getFor="post" />
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-3 text-center">
            <i
              onClick={() => likePost(post)}
              className="far fa-heart fa-3x"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <div className="col-9 text-center">
            <h3 className="card-text">{post.caption}</h3>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    preloadFeed();
  }, []);

  return (
    <Fragment>
      {feed.length > 0 ? (
        <div>{feed.map((post, index) => feedCard(post))}</div>
      ) : (
        <div className="alert alert-primary">NO UPDATES! MAKE NEW FRIENDS</div>
      )}
    </Fragment>
  );
};

export default Updates;
