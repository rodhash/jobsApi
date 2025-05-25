
import { Application } from "express";
import { connectDB } from "./db/connect";

export const server = async (app: Application) => {
  const PORT     = process.env.PORT || 3000
  const mongoUri = process.env.MONGO_URI
  if (!mongoUri) {
    throw new Error("Mongo connection string missing")
  }

  try {
    await connectDB(mongoUri)
    app.listen(PORT, _ => console.log(`App up on ${PORT}`))

  } catch (e) {
    console.error('Failed to spin up server: ', e)
  }
}

