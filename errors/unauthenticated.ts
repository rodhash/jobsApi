
import { CustomApiError } from "./custom-error"
import { StatusCodes } from "http-status-codes"

// export class UnauthenticatedError extends CustomApiError {
export class UnauthenticatedError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

// export const createCustomError = (msg: string, code: number) => {
//   return new CustomApiError(msg)
// }

