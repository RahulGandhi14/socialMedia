const User = require("../models/user");
const Post = require("../models/post");
const formidable = require("formidable");
const _ = require("lodash");
const { ObjectId } = require("mongodb");
const FriendReq = require("../models/friendRequest");
const friendRequest = require("../models/friendRequest");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "NO USER FOUND IN DB!",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.photo.data = undefined;

  return res.json(req.profile);
};

exports.getSentReqs = (req, res) => {
  return res.json(req.profile.reqSent);
};

exports.photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

exports.updateUser = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: `ERROR: ${err}`,
      });
    }

    const { firstname, lastname, email, city, state } = fields;

    //UPDATE THE USER
    let user = req.profile;
    user = _.extend(user, fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "FILE IS TOO BIG!",
        });
      }
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "USER UPDATION FAILED",
        });
      }
      user.photo = undefined;
      res.json(user);
    });
  });
};

exports.getAllUsers = (req, res) => {
  // console.log("GETTNG ALL USERS");
  User.find({ _id: { $nin: req.profile.friends } })
    .select("-photo")
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          error: "NO USERS FOUND!",
        });
      }
      res.json(users);
    });
};

exports.sendFriendRequest = (req, res) => {
  // console.log("REQ-SENDING");
  // console.log(req.body);
  let friendReq = new FriendReq();
  friendReq.requester = new ObjectId(req.profile._id);
  friendReq.recipient = new ObjectId(req.body._id);
  friendReq.status = 1;
  // console.log(friendReq);

  friendReq.save((err, success) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED SEND REQUEST!",
      });
    }
    User.findByIdAndUpdate(req.profile._id, {
      $push: { reqSent: new ObjectId(req.body._id) },
    }).exec((err) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED PUSH SENT REQUEST IN DB!",
        });
      }
      res.json(success);
    });
    // console.log("Success", success);
    // res.json(success);
  });
};

exports.cancelFriendRequest = (req, res) => {
  // console.log("CANCELING...");
  FriendReq.deleteOne({
    requester: req.profile._id,
    recipient: req.body._id,
  }).exec((err, canceled) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED TO CANCEL REQUEST!",
      });
    }
    User.findByIdAndUpdate(req.profile._id, {
      $pull: { reqSent: new ObjectId(req.body._id) },
    }).then((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO CANCEL REQUEST!",
        });
      }
    });
    res.json(canceled);
  });
};

exports.fetchIncomingReqs = (req, res) => {
  // console.log("FETCHING...");
  FriendReq.find({ recipient: req.profile._id, status: 1 })
    .populate("requester")
    .exec((err, request) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO SEND REQUEST!",
        });
      }
      res.json(request);
    });
};

exports.removeFriend = (req, res) => {
  // console.log("REMOVING FRIEND");
  User.findByIdAndUpdate(req.profile._id, {
    $pull: { friends: new ObjectId(req.body._id) },
  }).exec((err, success) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED TO REMOVE FROM LIST-1",
      });
    }
    User.findByIdAndUpdate(req.body._id, {
      $pull: { friends: new ObjectId(req.profile._id) },
    }).exec((err, success) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO REMOVE FROM LIST-1",
        });
      }
    });
    res.json(success.friends);
  });
};

exports.acceptRequest = (req, res) => {
  // console.log("Accepting...");
  // console.log("Req-body", req.body);

  let query = {
    recipient: new ObjectId(req.profile._id),
    requester: new ObjectId(req.body.requester._id),
  };

  FriendReq.deleteOne({ _id: req.body._id }).exec((err, success) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED TO ACCEPT REQUEST!",
      });
    }
    User.findOneAndUpdate(
      { _id: new ObjectId(req.profile._id) },
      { $push: { friends: [{ _id: new ObjectId(req.body.requester._id) }] } },
      { new: true },
      (err, updated) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save friend's list-1",
          });
        }
      }
    );
    User.findOneAndUpdate(
      { _id: new ObjectId(req.body.requester._id) },
      {
        $push: { friends: [{ _id: new ObjectId(req.profile._id) }] },
        $pull: { reqSent: new ObjectId(req.profile._id) },
      },
      { new: true },
      (err, updated) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save friend's list-2",
          });
        }
      }
    );
    res.json("FRIEND LISTS UPDATED!");
  });
};

exports.rejectRequest = (req, res) => {
  // console.log("IN_REJECT", req.body);
  friendRequest.deleteOne({ _id: req.body._id }).exec((err, deleted) => {
    if (err) {
      return res.status(400).json({
        error: "UNABLE TO REJECT REQ",
      });
    }
    User.findByIdAndUpdate(req.body.requester._id, {
      $pull: { reqSent: new ObjectId(req.body.recipient) },
    }).exec((err) => {
      if (err) {
        return res.status(400).json({
          error: "UNABLE TO PULL REQ FROM USER-DOC!",
        });
      }
    });
    res.json("FRIEND-REQ Rejected Successfully!");
  });
};

exports.showFeed = (req, res) => {
  Post.find({ user: { $in: req.profile.friends } })
    .select("-photo")
    .populate("user comments.comment")
    .sort({ createdAt: -1 })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: "UNABLE FETCH POSTS",
        });
      }
      res.json(posts);
    });
};

exports.getFriends = (req, res) => {
  User.findById(req.profile._id)
    .select("-photo")
    .populate("friends", "_id firstname lastname")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "UNABLE FETCH FRIENDS",
        });
      }
      res.json(user.friends);
    });
};
