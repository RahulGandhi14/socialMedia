const mongoose = require("mongoose");
const { ObjectID } = require("mongodb");

const friendRequestSchema = new mongoose.Schema(
  {
    requester: {
      required: true,
      type: ObjectID,
      ref: "User",
    },
    recipient: {
      required: true,
      type: ObjectID,
      ref: "User",
    },
    status: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

friendRequestSchema.index(
  {
    requester: 1,
    recipient: 1,
  },
  { unique: true }
);
module.exports = mongoose.model("FriendReq", friendRequestSchema);
