const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    photo: {
      data: Buffer,
      contentType: String,
    },
    caption: {
      required: true,
      type: String,
      maxlength: 200,
      trim: true,
    },
    likeCounts: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Array,
      default: [],
    },
    user: {
      type: ObjectID,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
