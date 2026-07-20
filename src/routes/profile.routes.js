import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { completeProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.put(
  "/complete",
  authMiddleware,
  completeProfile
);

export default router;