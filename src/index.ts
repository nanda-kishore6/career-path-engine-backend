import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { pool } from "./config/db"
import recommendationRoutes from "./routes/recommendation.routes"
import authRoutes from "./routes/auth.routes"
import optionsRoutes from "./routes/options.routes"

const app = express()

app.use(cors())
app.use(express.json())

pool.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err: unknown) => {
    console.error("DB connection error", err)
  })

app.get("/", (req, res) => {
  res.send("Career Path Engine API Running 🚀")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use("/api", recommendationRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/options", optionsRoutes)