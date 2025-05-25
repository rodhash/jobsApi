
import { Request, Response, NextFunction } from "express"
import { asyncWrapper as AW } from "../middleware/asyncWrap"
import { Job } from "../models/Jobs"
import { StatusCodes } from "http-status-codes"
import { BadRequest, UnauthenticatedError, NotFound } from "../errors"
import { AuthenticatedRequest } from "../types/types"

export const getAllJobs = AW(async(req: AuthenticatedRequest, res: Response) => {
  const createdById = req.user.userId
  // const jobs = await Job.find({'createdById': {'$eq': createdById}})
  const jobs = await Job.find({'createdById': createdById}).sort("-createdAt")

  res.status(StatusCodes.OK).json({count: jobs.length, jobs})
})

// My solution, long route and more verbosed
// export const getJob = AW(async(req: Request, res: Response, next: NextFunction) => {
//   const jobId = req.params.id
//   const job = await Job.findById(jobId)
//
//   if (!job) {
//     return res.status(StatusCodes.NOT_FOUND).json({success: false, msg: "Job not found"})
//   }
//
//   const authHeader = req.headers.authorization
//   if (!authHeader) {
//     return next(new UnauthenticatedError("User not authed"))
//   }
//
//   const token = authHeader.split(' ')[1]
//   const secret = process.env.JWT_SECRET
//
//   if (!secret) {
//     return next(new Error("Secret not found"))
//   }
//
//   const decoded = jwt.verify(token, secret) as jwt.JwtPayload
//
//   const reqUserId = decoded.userId
//   const jobUserId = job.createdById.toString()
//
//   if (reqUserId === jobUserId) {
//     return res.status(StatusCodes.OK).json(job)
//   }
//
//   return res.status(StatusCodes.NOT_FOUND).json({success: true, msg: "Not found for this user"})
// })

// Smilga version - way cleaner
export const getJob = AW(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const { user: { userId }, params: { id: jobId } } = req
  const job = await Job.findOne({ _id: jobId, createdById: userId }).setOptions({sanitizeFilter: true})

  if (!job) {
    return next(new NotFound(`Job ${jobId} not found`))
  }

  res.status(StatusCodes.OK).json({success: true, job})
})

export const createJob = AW(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.body.createdById = req.user.userId
  const job = await Job.create(req.body)

  res.status(StatusCodes.CREATED).json({job})
})

export const updateJob = AW(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position }
  } = req;

  if (company === '' || position === '') {
    return next(new BadRequest("Missing company / position"))
  }

  const job = await Job.findByIdAndUpdate({_id: jobId, createdById: userId}, req.body, {new: true, runValidators: true})

  if (!job) {
    return next(new NotFound("Job not found"))
  }

  res.status(StatusCodes.OK).json({job})
})

export const deleteJob = AW(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const { user: { userId }, params: { id: jobId } } = req
  const job = await Job.findByIdAndDelete({_id: jobId, createdById: userId})

  if (!job) {
    return next(new NotFound("job not found"))
  }

  res.status(StatusCodes.OK).json({success: true, job})
})

