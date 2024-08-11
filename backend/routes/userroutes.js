import express from "express";
import {
  editprofile,
  followOrUnfollow,
  getprofile,
  loginUser,
  logoutUser,
  registerUser,
  suggestedusers,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../utils/Token.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", registerUser); //
router.post("/login", loginUser); //
router.get("/logout", logoutUser); //
router.get("/:id/profile", isAuthenticated, getprofile); //
router.post(
  "/profile/edit",
  isAuthenticated,
  upload.single("profilepic"),
  editprofile
); //

router.get("/suggestedusers", isAuthenticated, suggestedusers);
router.post("/followunfollow/:id", isAuthenticated, followOrUnfollow);

export default router;
