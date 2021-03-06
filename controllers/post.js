const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const formidable = require("formidable");
const fs = require("fs"); //fs=filesystem
const _ = require("lodash");
const { sortBy } = require("lodash");
const { ObjectID, ObjectId } = require("mongodb");

exports.getPostById = (req, res, next, id) => {
  Post.findById(id).exec((err, post) => {
    if (err || !post) {
      return res.status(400).json({
        error: "NO POST FOUND IN DB!",
      });
    }
    req.post = post;
    next();
  });
};

exports.createPost = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    const { caption } = fields;

    if (!files.photo) {
      return res.status(400).json({
        error: "Please upload a photo!",
      });
    }

    let post = new Post(fields);
    post.user = req.profile._id;

    //handle file
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "FILE IS TOO BIG",
        });
      }

      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, post) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO SAVE POST IN DB",
        });
      }
      post.photo = undefined;
      let id = post._id;
      User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { posts: { _id: id } } },
        { new: true },
        (err, update) => {
          if (err) {
            return res.status(400).json({
              error: "UNABLE TO SAVE INTO POSTS LIST",
            });
          }
        }
      );
      res.json(post);
    });
  });
};

exports.getPost = (req, res) => {
  // req.post.photo.data = undefined;
  return res.json(req.post);
};

exports.getAllPosts = (req, res) => {
  //
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, deletedPost) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED TO DELETE THE POST",
      });
    }
    Comment.deleteOne({ post: new ObjectId(deletedPost._id) }).exec(
      (err, deletedComment) => {
        if (err) {
          return res.status(400).json({
            error: "FAILED TO DELETE THE COMMENT FOR GIVEN POST",
          });
        }
        res.json({
          message: "SUCCESSFULLY DELETED THE POST",
        });
      }
    );
  });
};

exports.updatePost = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    const { caption } = fields;

    let post = req.post;
    post = _.extend(post, fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "FILE IS TOO BIG",
        });
      }

      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, post) => {
      if (err) {
        return res.status(400).json({
          error: "UPDATION OF POST FAILED",
        });
      }
      post.photo = undefined;
      res.json(post);
    });
  });
};

exports.getAllPostsByUserId = (req, res) => {
  Post.find({ user: req.profile._id })
    .select("-photo")
    .populate("user comments.comment")
    .sort({ updatedAt: -1 })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: "NO POSTs FOUND!",
        });
      }
      res.json(posts);
    });
};

exports.likePost = (req, res) => {
  // console.log("Like Post");
  Post.findOneAndUpdate(
    { _id: req.post._id, likes: { $ne: req.profile._id } },
    { $inc: { likeCounts: 1 }, $push: { likes: new ObjectID(req.profile._id) } }
  )
    .select("-photo")
    .exec((err, postLiked) => {
      if (err) {
        return res.status(400).json({
          error: "UNABLE TO LIKE THE POST!",
        });
      }
      res.json(postLiked);
    });
};

exports.unLikePost = (req, res) => {
  // console.log("Like Post");
  Post.findOneAndUpdate(
    { _id: req.post._id, likes: req.profile._id },
    {
      $inc: { likeCounts: -1 },
      $pull: { likes: new ObjectID(req.profile._id) },
    }
  )
    .select("-photo")
    .exec((err, postUnLiked) => {
      if (err) {
        return res.status(400).json({
          error: "UNABLE TO UN-LIKE THE POST!",
        });
      }
      res.json(postUnLiked);
    });
};

exports.commentOnPost = (req, res) => {
  // console.log("INSIDE-COMMENT", req.body);
  let newComment = new Comment();
  newComment.post = new ObjectID(req.post._id);
  newComment.user = new ObjectID(req.profile._id);
  newComment.text = req.body.comment;

  let fullName = `${req.profile.firstname}_${req.profile.lastname}`;

  newComment.save((err, commentSaved) => {
    if (err) {
      return res.status(400).json({
        error: "UNABLE SAVE COMMENT IN DB!",
      });
    }
    Post.findByIdAndUpdate(req.post._id, {
      $push: {
        comments: {
          comment: new ObjectID(commentSaved._id),
          postedBy: fullName,
        },
      },
    }).exec((err, updated) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO PUSH COMMENT!",
        });
      }
    });
    res.json(commentSaved);
  });
};

//MIDDLEWARE
exports.photo = (req, res, next) => {
  if (req.post.photo.data) {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
  }
  next();
};
