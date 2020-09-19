import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ user }) => {
  const imageUrl = user
    ? `${API}/user/photo/${user._id}`
    : "https://images.pexels.com/photos/3577561/pexels-photo-3577561.jpeg?cs=srgb&dl=pexels-hitesh-choudhary-3577561.jpg&fm=jpg";

  return (
    <div className="">
      <img
        src={imageUrl}
        alt="photo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-3 rounded"
      />
    </div>
  );
};

export default ImageHelper;
