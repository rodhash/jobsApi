
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createJWT(): string;
  comparePassword(candidatePassword: string): boolean
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
})

UserSchema.pre('save', async function(_next) {
  const salt    = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  // next()
})

UserSchema.methods.createJWT = function() {

  const jwtSecret = process.env.JWT_SECRET
  const jwtLifetime = process.env.JWT_LIFETIME

  if (!jwtSecret) {
    throw new Error("JWT Secret missing")
  }

  return jwt.sign({userId: this._id, name: this.name}, jwtSecret, {expiresIn: '10d'})
}

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export const User = mongoose.model<IUser>('User', UserSchema)

