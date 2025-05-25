
import { StatusCodes } from "http-status-codes";

export class NotFound extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

