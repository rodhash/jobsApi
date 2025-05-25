
import { CustomApiError } from "./custom-error"
import { StatusCodes } from "http-status-codes"

// export class BadRequest extends CustomApiError {
export class BadRequest extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

// export const createCustomError = (msg: string, code: number) => {
//   return new CustomApiError(msg)
// }

