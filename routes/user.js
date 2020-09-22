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
  rejectRequest,
  showFeed,
  getSentReqs,
  cancelFriendRequest,
  getFriends,
  removeFriend,
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
router.delete(
  "/user/cancelrequest/:userId",
  isSignedIn,
  isAuthenticated,
  cancelFriendRequest
);
router.get(
  "/user/myrequests/:userId",
  isSignedIn,
  isAuthenticated,
  fetchIncomingReqs
);
router.post(
  "/user/acceptrequest/:userId",
  isSignedIn,
  isAuthenticated,
  acceptRequest
);
router.delete(
  "/user/rejectrequest/:userId",
  isSignedIn,
  isAuthenticated,
  rejectRequest
);

//NEWS-FEED Routes
router.get("/user/feed/:userId", isSignedIn, isAuthenticated, showFeed);

router.get(
  "/user/sentrequests/:userId",
  isSignedIn,
  isAuthenticated,
  getSentReqs
);

router.get("/user/friends/:userId", isSignedIn, isAuthenticated, getFriends);
router.delete(
  "/user/removefriend/:userId",
  isSignedIn,
  isAuthenticated,
  removeFriend
);

module.exports = router;
