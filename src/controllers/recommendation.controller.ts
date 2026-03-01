import { Request, Response } from "express"
import { generateRecommendations } from "../services/recommendation.service"
import { pool } from "../config/db"

export async function recommendCareer(req: Request, res: Response) {
  try {
    const { skills, interests, lifestyle, career_goals } = req.body

    // 🔹 Basic validation
    if (
      !Array.isArray(skills) ||
      !Array.isArray(interests) ||
      !Array.isArray(lifestyle) ||
      !Array.isArray(career_goals)
    ) {
      return res.status(400).json({
        message: "All fields must be arrays."
      })
    }

    const userId = (req as any).user.userId

    // 🔹 Save preference snapshot
    await pool.query(
  `INSERT INTO user_preferences
   (user_id, skills, interests, lifestyle, career_goals)
   VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb)`,
  [
    userId,
    JSON.stringify(skills),
    JSON.stringify(interests),
    JSON.stringify(lifestyle),
    JSON.stringify(career_goals)
  ]
)

    // 🔹 Generate recommendation
    const recommendations = await generateRecommendations({
      skills,
      interests,
      lifestyle,
      career_goals
    })

    return res.json(recommendations)

  } catch (error) {
    console.error("Recommendation error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}