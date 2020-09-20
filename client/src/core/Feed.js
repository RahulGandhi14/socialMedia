import React, { useState } from "react";
import MyPosts from "../user/helper/MyPosts";
import PostContent from "../user/helper/PostContent";

const Feed = () => {
  const [reload, setReload] = useState(false);

  return (
    <div>
      <PostContent setReload={setReload} reload={reload} />
      <MyPosts reload={reload} />
    </div>
  );
};

export default Feed;
