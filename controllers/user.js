const User = require("../models/user");
const _ = require("lodash");

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
  User.find()
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
