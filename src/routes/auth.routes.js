import { Router } from "express";
import {
  signup,
  verifyOTP,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
  updateProfileImage,
} from "../controllers/auth.controller.js";
import {
  googleLogin,
  facebookLogin,
  appleLogin,
} from "../controllers/socialAuth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { completeProfile } from "../controllers/profile.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);
router.post("/apple", appleLogin);
router.patch(
  "/profile/image",
  authMiddleware,
  upload.single("profileImage"),
  updateProfileImage,
);
router.put(
  "/profile/complete",
  authMiddleware,
  completeProfile
);


export default router;
