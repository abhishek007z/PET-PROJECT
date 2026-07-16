import { Router } from "express";
import {
  signup,
  verifyOTP,
  login,
  getProfile,
  logout,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logout);

export default router;
