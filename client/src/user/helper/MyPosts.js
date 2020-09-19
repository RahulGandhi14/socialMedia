import React, { useState, useEffect, Fragment } from "react";
import { isAuthenticated } from "../../authHelper";
import ImageHelper from "./ImageHelper";
import { getPosts } from "./userapicalls";

const MyPosts = () => {
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
  }, []);

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
              class="far fa-heart fa-3x"
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
      <h1>Posts</h1>
      {posts.map((post, index) => {
        return <Fragment key={index}>{postCard(post)}</Fragment>;
      })}
    </div>
  );
};

export default MyPosts;
