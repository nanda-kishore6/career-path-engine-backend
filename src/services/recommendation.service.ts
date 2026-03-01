const WEIGHTS = {
  skills: 0.35,
  interests: 0.20,
  lifestyle: 0.15,
  goals: 0.15,
  market: 0.15
}
function calculateMatchScore(
  userArray: string[],
  careerArray: string[],
  weight: number
): number {
  if (!careerArray.length) return 0

  const normalizedUser = userArray.map(item => item.toLowerCase().trim())
  const normalizedCareer = careerArray.map(item => item.toLowerCase().trim())

  const matched = normalizedCareer.filter(item =>
    normalizedUser.includes(item)
  )

  return (matched.length / normalizedCareer.length) * weight
}
import { pool } from "../config/db"

interface UserInput {
  skills: string[]
  interests: string[]
  lifestyle: string[]
  career_goals: string[]
}

export async function generateRecommendations(userInput: UserInput) {
    

  const careersResult = await pool.query("SELECT * FROM public.career_paths")
  const careers = careersResult.rows

  const scoredCareers = careers.map(career => {

    const skillScore = calculateMatchScore(
      userInput.skills,
      career.required_skills,
      WEIGHTS.skills
    )

    const interestScore = calculateMatchScore(
      userInput.interests,
      career.required_interests,
      WEIGHTS.interests
    )

    const lifestyleScore = calculateMatchScore(
      userInput.lifestyle,
      career.lifestyle_tags,
      WEIGHTS.lifestyle
    )

    const goalScore = calculateMatchScore(
      userInput.career_goals,
      career.goal_tags,
      WEIGHTS.goals
    )

    const marketScore = career.market_demand_score * WEIGHTS.market

    const totalScore =
      skillScore +
      interestScore +
      lifestyleScore +
      goalScore +
      marketScore

    const percentage = Math.round(totalScore * 100)

    const missingSkills = career.required_skills.filter(
      (skill: string) =>
        !userInput.skills.map(s => s.toLowerCase())
          .includes(skill.toLowerCase())
    )

    return {
      id: career.id,
      title: career.title,
      description: career.description,
      image_url: career.image_url,
      external_link: career.external_link,
      matchPercentage: percentage,
      missingSkills
    }
  })

  scoredCareers.sort((a, b) => b.matchPercentage - a.matchPercentage)

  return scoredCareers.slice(0, 3)
}