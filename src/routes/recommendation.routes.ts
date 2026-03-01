import express from "express"
import { recommendCareer } from "../controllers/recommendation.controller"
import { recommendLimiter } from "../middleware/rateLimit.middleware"
import { authenticate } from "../middleware/auth.middleware"

const router = express.Router()

router.post(
  "/recommend",
  recommendLimiter,
  authenticate,
  recommendCareer
)

export default router