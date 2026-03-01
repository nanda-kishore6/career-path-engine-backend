import { Request, Response } from "express"
import { getCareerOptions } from "../services/options.service"

export async function fetchCareerOptions(req: Request, res: Response) {
  try {
    const options = await getCareerOptions()
    res.status(200).json(options)
  } catch (error) {
    console.error("Error fetching options:", error)
    res.status(500).json({ message: "Failed to fetch career options" })
  }
}