const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  photo: {
    data: Buffer,
    contentType: String,
  },
  caption: {
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
});

module.exports = mongoose.model("Post", postSchema);
