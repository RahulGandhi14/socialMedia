import React from "react";
import MyPosts from "../user/helper/MyPosts";
import PostContent from "../user/helper/PostContent";

const Feed = () => {
  return (
    <div>
      <PostContent />
      <MyPosts />
    </div>
  );
};

export default Feed;
