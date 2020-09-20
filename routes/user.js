const express = require("express");
const router = express.Router();

const {
  getUserById,
  photo,
  getUser,
  updateUser,
  getAllUsers,
  sendFriendRequest,
  fetchIncomingReqs,
  acceptRequest,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", getUser);
router.get("/user/photo/:userId", photo);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get("/users/:userId", isSignedIn, isAuthenticated, getAllUsers);

//FriendReq Routes
router.post(
  "/user/sendrequest/:userId",
  isSignedIn,
  isAuthenticated,
  sendFriendRequest
);
router.get(
  "/user/myrequests/:userId",
  isSignedIn,
  isAuthenticated,
  fetchIncomingReqs
);
router.post(
  "/user/acceptrequests/:userId",
  isSignedIn,
  isAuthenticated,
  acceptRequest
);

module.exports = router;
