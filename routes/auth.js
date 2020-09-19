const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signin, signout, signup } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("firstname", "name should be atleast 3 chars long").isLength({
      min: 3,
    }),
    check("lastname", "name should be atleast 3 chars long").isLength({
      min: 3,
    }),
    check("password", "password should be atleast 3 chars long").isLength({
      min: 3,
    }),
    check("email", "email is required").isEmail(),
  ],
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
