const express = require("express");
const router = express.Router();

const {
  getPostById,
  createPost,
  getPost,
  updatePost,
  deletePost,
  getAllPostsByUserId,
  photo,
} = require("../controllers/post");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("postId", getPostById);

router.post("/post/create/:userId", isSignedIn, isAuthenticated, createPost);
router.get("/post/:postId", isSignedIn, getPost);
router.get("/posts", isSignedIn, getAllPosts);
router.get("/posts/:userId", isSignedIn, getAllPostsByUserId);
router.get("/post/photo/:postId", isSignedIn, photo);
router.put("/post/:postId/:userId", isSignedIn, isAuthenticated, updatePost);
router.put("/post/:postId/:userId", isSignedIn, isAuthenticated, deletePost);
