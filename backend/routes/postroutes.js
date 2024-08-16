import express from "express";
import {
  addcomment,
  addpost,
  bookmarkpost,
  deletepost,
  getallcommentsofpost,
  getallposts,
  getmyallposts,
  likedislikepost,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";

import { isAuthenticated } from "../utils/Token.js";

const router = express.Router();

router.post("/createpost", isAuthenticated, upload.single("image"), addpost); //
router.delete("/deletepost/:id", isAuthenticated, deletepost); //
router.get("/allposts", getallposts); //
router.get("/myallposts", isAuthenticated, getmyallposts); //
router.post("/likedislikepost/:postid", isAuthenticated, likedislikepost); //
router.post("/comment/:id", isAuthenticated, addcomment); //
router.get("/comments/:id", getallcommentsofpost); //
router.get("/bookmark/:id", isAuthenticated, bookmarkpost); //

export default router;
