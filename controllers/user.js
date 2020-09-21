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
  console.log("REQ-SENDING");
  // console.log(req.body);
  let friendReq = new FriendReq();
  friendReq.requester = new ObjectId(req.profile._id);
  friendReq.recipient = new ObjectId(req.body._id);
  friendReq.status = 1;

  friendReq.save((err, success) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED SEND REQUEST!",
      });
    }
    User.findByIdAndUpdate(req.profile._id, {
      $push: { reqSent: new ObjectID(req.body._id) },
    }).exec((err) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED PUSH SENT REQUEST IN DB!",
        });
      }
    });
    console.log("Success", success);
    res.json(success);
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

exports.acceptRequest = (req, res) => {
  console.log("Accepting...");
  console.log("Req-body", req.body);

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
        $pull: { reqSent: new ObjectID(req.profile._id) },
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
  friendRequest.deleteOne({ _id: req.body._id }).exec((err, deleted) => {
    if (err) {
      return res.status(400).json({
        error: "UNABLE TO REJECT REQ",
      });
    }
    res.json("FRIEND-REQ Rejected Successfully!");
  });
};

exports.showFeed = (req, res) => {
  Post.find({ user: { $in: req.profile.friends } })
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

exports.showUserFriends = (req, res) => {
  User.findById(req.profile._id, { friends: 1, _id: 0 })
    .populate("friends", "_id firstname lastname city")
    .exec((err, friends) => {
      if (err || !friends) {
        return res.status(400).json({
          error: "NO FRIENDS FOUND IN DB!",
        });
      }

      res.json(friends);
    });
};
