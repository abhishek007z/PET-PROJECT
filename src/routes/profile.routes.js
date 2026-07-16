import { Router } from "express";
import {
  completeProfile,
} from "../controllers/profile.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.put("/complete-profile", authMiddleware, completeProfile);

export default router;
