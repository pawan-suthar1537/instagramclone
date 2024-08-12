import express from "express";
import { isAuthenticated } from "../utils/Token.js";
import { getmessages, sendmessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/sendmessage/:id", isAuthenticated, sendmessage);
router.get("/all/:id", isAuthenticated, getmessages);

export default router;
