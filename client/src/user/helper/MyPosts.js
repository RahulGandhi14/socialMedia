import React, { useState, useEffect, Fragment } from "react";
import { isAuthenticated } from "../../authHelper";
import ImageHelper from "./ImageHelper";
import { getPosts } from "./userapicalls";

const MyPosts = ({ reload = undefined }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const { user, token } = isAuthenticated();

  const preload = (userId, token) => {
    getPosts(userId, token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setPosts(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const likePost = (event, post) => {
    //
  };

  useEffect(() => {
    preload(user._id, token);
  }, [reload]);

  const postCard = (post) => (
    <div className="card my-3">
      <div className="card-header">
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

  return (
    <div>
      <h4 className="alert alert-info mt-3">My Posts</h4>
      {posts.map((post, index) => {
        return <Fragment key={index}>{postCard(post)}</Fragment>;
      })}
    </div>
  );
};

export default MyPosts;
