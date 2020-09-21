import React, { useState } from "react";
import { isAuthenticated } from "../../authHelper";
import ImageHelper from "./ImageHelper";
import { postLike, postUnLike, sendComment } from "./userapicalls";

const PostCard = ({ post, setReload = (f) => f, reload = undefined }) => {
  const [error, setError] = useState("");
  const { user, token } = isAuthenticated();

  const [comment, setComment] = useState("");

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const onComment = () => {
    console.log("BUTTON-CLICKED", comment);
    sendComment(user._id, post._id, token, { comment }).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setComment("");
        setReload(!reload);
      }
    });
  };

  const likePost = (post) => {
    postLike(user._id, post._id, token).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        console.log("POST LIKED!");
        setReload(!reload);
      }
    });
  };

  const unLikePost = (post) => {
    postUnLike(user._id, post._id, token).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        console.log("POST UN-LIKED!");
        setReload(!reload);
      }
    });
  };

  return (
    <div className="card my-3">
      <div className="card-header font-weight-bold">
        @ {post.user.firstname}_{post.user.lastname}
      </div>
      <div className="card-header text-center">
        <ImageHelper className="card-img-top" obj={post} getFor="post" />
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-4">
            {post.likes.includes(user._id) ? (
              <svg
                width="2em"
                height="2em"
                onClick={() => unLikePost(post)}
                style={{ cursor: "pointer" }}
                viewBox="0 0 16 16"
                className="bi bi-heart-fill"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                />
              </svg>
            ) : (
              <svg
                width="2em"
                height="2em"
                onClick={() => likePost(post)}
                style={{ cursor: "pointer" }}
                viewBox="0 0 16 16"
                className="bi bi-heart"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
                />
              </svg>
            )}
            {post.likeCounts > 0 && (
              <p className="mx-3" style={{ display: "inline" }}>
                {post.likeCounts}
              </p>
            )}
          </div>
          <div className="col-8">
            <h3 className="card-text">{post.caption}</h3>
          </div>
        </div>
        <div className="row mt-3">
          <form className="col-8">
            <input
              type="text"
              value={comment}
              onChange={handleChange}
              className="form-control"
              placeholder="Write a comment..."
            />
          </form>
          <button className="btn btn-info col-4" onClick={onComment}>
            POST
          </button>
        </div>
        <div className="mt-2">
          <p className="font-weight-bold my-0">Comments:</p>
          {post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <p className="my-0" key={index}>
                <span className="font-weight-bold">@{comment.postedBy}: </span>
                {comment.comment.text}
              </p>
            ))
          ) : (
            <p className="my-0">NO COMMENTS!</p>
          )}
        </div>
      </div>
      {/* {console.log(post)} */}
      {/* <p className="text-dark text-center">{comment}</p> */}
    </div>
  );
};

export default PostCard;
