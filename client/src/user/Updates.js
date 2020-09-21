import React, { useState, useEffect, Fragment } from "react";
import { isAuthenticated } from "../authHelper";
import PostCard from "./helper/PostCard";
import { loadFeed } from "./helper/userapicalls";

const Updates = () => {
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState("");
  const { user, token } = isAuthenticated();
  const [reload, setReload] = useState(false);

  const preloadFeed = () => {
    loadFeed(user._id, token).then((data) => {
      if (data?.error) {
        setError(data.error);
      } else {
        setFeed(data);
      }
    });
  };

  useEffect(() => {
    preloadFeed();
  }, [reload]);

  return (
    <Fragment>
      {feed.length > 0 ? (
        <div>
          {feed.map((post, index) => (
            <PostCard
              post={post}
              key={index}
              setReload={setReload}
              reload={reload}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-primary">NO UPDATES! MAKE NEW FRIENDS</div>
      )}
    </Fragment>
  );
};

export default Updates;
