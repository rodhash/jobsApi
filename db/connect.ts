
import mongoose from "mongoose";

export const connectDB = async(url: string) => {
  try {
    await mongoose.connect(url, {connectTimeoutMS: 3000})
    console.log('DB up')

  } catch (e) {
    console.error('DB connection failed: ', e)
    process.exit(1)
  }
}

