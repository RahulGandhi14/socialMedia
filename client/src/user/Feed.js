import React, { useState } from "react";
import MyPosts from "./helper/MyPosts";
import PostContent from "./helper/PostContent";

const Feed = () => {
  const [reload, setReload] = useState(false);

  return (
    <div>
      <PostContent setReload={setReload} reload={reload} />
      <MyPosts setReload={setReload} reload={reload} />
    </div>
  );
};

export default Feed;
