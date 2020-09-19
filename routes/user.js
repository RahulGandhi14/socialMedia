const express = require("express");
const router = express.Router();

const {
  getUserById,
  photo,
  getUser,
  updateUser,
  getAllUsers,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/user/photo/:userId", isSignedIn, isAuthenticated, photo);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get("/users", getAllUsers);
