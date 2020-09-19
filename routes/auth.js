const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const { signin, signout, signup } = require("../controllers/auth");

router.post(
  "/signup",
  // [
  //   body("city", "Select a city").isEmpty(),
  //   body("email", "Invalid Email Address").isEmail(),
  //   body("password").isLength({ min: 3 }),
  // ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required!").isEmail(),
    check("password", "Password is required!").isLength({ min: 3 }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
