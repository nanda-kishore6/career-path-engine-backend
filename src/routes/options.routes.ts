import { Router } from "express"
import { fetchCareerOptions } from "../controllers/options.controller"

const router = Router()

router.get("/", fetchCareerOptions)

export default router