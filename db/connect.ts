
import mongoose from "mongoose";

mongoose.set('sanitizeFilter', true)

export const connectDB = async(url: string) => {
  try {
    await mongoose.connect(url, {connectTimeoutMS: 3000, sanitizeFilter: true})
    console.log('DB up')

  } catch (e) {
    console.error('DB connection failed: ', e)
    process.exit(1)
  }
}

