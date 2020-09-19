const User = require("../models/user");
const { validationResult } = require("express-validator");
const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs"); //fs=filesystem
const user = require("../models/user");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  let form = formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: `ERROR: ${err}`,
      });
    }

    const { firstname, lastname, email, city, state } = fields;

    if (!city) {
      return res.status(400).json({
        error: "Please select the city!",
      });
    } else if (!state) {
      return res.status(400).json({
        error: "Please select the state!",
      });
    } else if (!files.photo) {
      return res.status(400).json({
        error: "Please upload a photo!",
      });
    }

    let User = new User(fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "FILE SIZE IS TOO BIG!",
        });
      }
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "FAILED TO SAVE USER IN DB",
        });
      }
      user.photo = undefined;
      res.json(user);
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: `Error: ${err}`,
      });
    }
    if (!user) {
      return res.status(400).json({
        error: "USER IS NOT REGISTERED!",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Invalid EmailID or Password!",
      });
    }

    //GENERATING TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //putting token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //Response to frontEnd
    const { _id, firstname, lastname, email } = user;
    return res.json({ token, user: { _id, firstname, lastname, email } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User SignOut Successfully",
  });
};

//MIDDLEWARES
exports.isSignedIn = expressJWT({
  secret: process.env.SECRET,
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED!",
    });
  }
  next();
};
