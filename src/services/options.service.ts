import { pool } from "../config/db"

export async function getCareerOptions() {
  const result = await pool.query("SELECT required_skills, required_interests, lifestyle_tags, goal_tags FROM public.career_paths")

  const skillsSet = new Set<string>()
  const interestsSet = new Set<string>()
  const lifestyleSet = new Set<string>()
  const goalsSet = new Set<string>()

  result.rows.forEach((career) => {
    career.required_skills?.forEach((skill: string) =>
      skillsSet.add(skill.toLowerCase().trim())
    )

    career.required_interests?.forEach((interest: string) =>
      interestsSet.add(interest.toLowerCase().trim())
    )

    career.lifestyle_tags?.forEach((tag: string) =>
      lifestyleSet.add(tag.toLowerCase().trim())
    )

    career.goal_tags?.forEach((goal: string) =>
      goalsSet.add(goal.toLowerCase().trim())
    )
  })

  return {
    skills: Array.from(skillsSet).sort(),
    interests: Array.from(interestsSet).sort(),
    lifestyle: Array.from(lifestyleSet).sort(),
    career_goals: Array.from(goalsSet).sort(),
  }
}