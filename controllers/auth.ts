
import { Request, Response, NextFunction } from "express"
import { asyncWrapper as AW } from "../middleware/asyncWrap"
import { User } from "../models/User"
import { StatusCodes } from "http-status-codes"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { BadRequest, UnauthenticatedError } from "../errors"

export const register = AW(async(req: Request, res: Response, next: NextFunction) => {

  // Unneeded!
  // const {name, email, password} = req.body
  //
  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword = await bcrypt.hash(password, salt)
  //
  // const tempUser = {name, email, password: hashedPassword}
  // const user = await User.create({...tempUser})

  const user = await User.create({...req.body})
  // const token = jwt.sign({userId: user._id, name: user.name}, 'jwtSecret', {expiresIn: '30d'})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({success: true, user: {name: user.name }, token})
})

export const login = AW(async(req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body

  if (!email || !password) {
    return next(new BadRequest("Missing email/password"))
  }

  const user = await User.findOne({email})

  if (!user) {
    return next(new UnauthenticatedError("Invalid Creds"))
  }

  const isPasswordOk = await user.comparePassword(password)

  // compare password
  if (!isPasswordOk) {
    return next(new UnauthenticatedError("Invalid credsss"))
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({success: true, user: {name: user.name}, token})
})

