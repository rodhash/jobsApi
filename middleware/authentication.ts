
import { User } from "../models/User";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UnauthenticatedError } from "../errors";
import { Request, Response, NextFunction } from "express";
import { asyncWrapper as AW } from "./asyncWrap";
import { AuthenticatedRequest } from "../types/types";

interface TokenPayload {
  userId: number;
  name: string;
}

export const authMW = AW(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // check header
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(new UnauthenticatedError("Auth failed"))
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET || ''
    // const payload = jwt.verify(token, secret)
    // const payload = jwt.verify(token, secret) as JwtPayload
    const payload = jwt.verify(token, secret) as TokenPayload


    if (typeof payload === "object" && payload !== null) {
      // Attach user to the job routes
      req.user = { userId: payload.userId, name: payload.name }

      // Alternative
      // const user = User.findById(payload.userId).select('-password')
      // req.user = user
      return next();
    }

  } catch (e) {
    return next(new UnauthenticatedError("Auth invalid"))
  }

  // req.user = undefined
  // next()
})


