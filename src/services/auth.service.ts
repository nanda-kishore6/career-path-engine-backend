import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "../config/db"

const SALT_ROUNDS = 10

export async function registerUser(name: string, email: string, password: string) {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  )

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword]
  )

  return result.rows[0]
}

export async function loginUser(email: string, password: string) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  )

  const user = result.rows[0]

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isMatch = await bcrypt.compare(password, user.password_hash)

  if (!isMatch) {
    throw new Error("Invalid credentials")
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}