const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: ObjectID,
      ref: "Post",
    },
    user: {
      type: ObjectID,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
