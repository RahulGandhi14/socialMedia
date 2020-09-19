const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs"); //fs=filesystem
const _ = require("lodash");
const { sortBy } = require("lodash");

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

    if (!caption) {
      res.status(400).json({
        error: "Please enter the caption",
      });
    } else if (!files.photo) {
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
          error: "FAILED TO SAVE PRODUCT IN DB",
        });
      }
      post.photo = undefined;
      res.json(post);
    });
  });
};

exports.getPost = (req, res) => {
  req.post.photo.data = undefined;
  return res.json(req.post);
};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, deletedPost) => {
    if (err) {
      return res.status(400).json({
        error: "FAILED TO DELETE THE POST",
      });
    }
    res.json({
      message: "SUCCESSFULLY DELETED THE POST",
    });
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
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: "NO POSTs FOUND!",
        });
      }
      res.json(posts);
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
