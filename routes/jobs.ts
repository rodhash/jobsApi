
import express from 'express'
import {
  getAllJobs,
  createJob,
  deleteJob,
  getJob,
  updateJob
} from '../controllers/jobs';

export const jobsRouter = express.Router()

jobsRouter.route('/')
  .get(getAllJobs)
  .post(createJob)

jobsRouter.route('/:id')
  .get(getJob)
  .delete(deleteJob)
  .patch(updateJob)

