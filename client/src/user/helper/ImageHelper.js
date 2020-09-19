import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ obj, getFor }) => {
  const imageUrl =
    getFor === "user"
      ? `${API}/user/photo/${obj._id}`
      : `${API}/post/photo/${obj._id}`;

  return (
    <div>
      <img
        src={imageUrl}
        alt="photo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="rounded"
      />
    </div>
  );
};

export default ImageHelper;
