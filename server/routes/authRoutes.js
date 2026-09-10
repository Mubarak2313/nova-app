import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js"
import protect from "../middleware/auth.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe)

export default router;