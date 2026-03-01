import { Request, Response } from "express"
import { registerUser, loginUser } from "../services/auth.service"

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const user = await registerUser(name, email, password)

    res.status(201).json(user)

  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    const data = await loginUser(email, password)

    res.json(data)

  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}