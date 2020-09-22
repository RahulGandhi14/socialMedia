const express = require("express");
const router = express.Router();

const {
  getPostById,
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  getAllPostsByUserId,
  photo,
  likePost,
  unLikePost,
  commentOnPost,
} = require("../controllers/post");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("postId", getPostById);

router.post("/post/create/:userId", isSignedIn, isAuthenticated, createPost);
router.get("/post/:postId", isSignedIn, getPost);
router.get("/posts", isSignedIn, getAllPosts);
router.get("/posts/:userId", isSignedIn, isAuthenticated, getAllPostsByUserId);
router.get("/post/photo/:postId", photo);
router.put("/post/:postId/:userId", isSignedIn, isAuthenticated, updatePost);
router.delete(
  "/post/delete/:userId/:postId",
  isSignedIn,
  isAuthenticated,
  deletePost
);
router.put("/post/like/:postId/:userId", isSignedIn, isAuthenticated, likePost);
router.put(
  "/post/unlike/:postId/:userId",
  isSignedIn,
  isAuthenticated,
  unLikePost
);

router.post(
  "/post/comment/:postId/:userId",
  isSignedIn,
  isAuthenticated,
  commentOnPost
);

module.exports = router;
