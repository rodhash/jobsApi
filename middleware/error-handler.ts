
import { Request, Response, NextFunction } from "express"
import {
  CustomApiError,
  NotFound,
  UnauthenticatedError,
  ValidationError,
  MongoError,
  CastError,
} from '../errors';
import { StatusCodes } from "http-status-codes"


// NOTE:   Switched to Class instead of Interface

// interface MongoError {
//   code: number;
//   keyValue: any; // Use `any` since `keyValue` might not always be a number
// }

interface CustomError {
  statusCode: number,
  msg: string | string[]
}

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {

  const isValidationError = (err: any) => {
    return err instanceof ValidationError
  }

  const isMongoError = (err: any): err is MongoError => {
    return typeof err === "object" && err !== null && "code" in err && "keyValue" in err
  };

  const isCastError = (err: any): err is CastError => {
    return (
      typeof err === 'object' &&
      err !== null &&
      'value' in err &&
      err.name === 'CastError' &&
      typeof err.value === 'string'
    );
  }

  let customError: CustomError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong'
  }

  if (err instanceof CustomApiError) {
    res.status(err.statusCode).json({success: false, msg: err.message})
    return
  }

  if (err instanceof NotFound) {
    res.status(StatusCodes.NOT_FOUND).json({success: false, msg: err.message})
    return
  }

  if (err instanceof UnauthenticatedError) {
    res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg: err.message})
    return
  }

  // -- Mongo --
  if (err instanceof Error) {
    customError.msg = err.message
  }

  // NOTE:   Long / verbose way

  // if (typeof err === 'object' && err !== null && 'code' in err && 'keyValue' in err) {
  //   const mongoErr = err as MongoError
  //   if (mongoErr.code === 11000) {
  //     customError.msg = `Duplicated value '${Object.keys(mongoErr.keyValue)}'`
  //     customError.statusCode = StatusCodes.BAD_REQUEST
  //   }
  // }

  // NOTE:   Using custom class - doesnt work

  // if (err instanceof MongoError && err.code === 11000) {
  //   customError.msg = `Duplicated value '${Object.keys(err.keyValue)}'`
  //   customError.statusCode = StatusCodes.BAD_REQUEST
  // }

  // NOTE:   Using cast

  // if (typeof err === 'object' && err !== null && 'name'in err &&  err.name === 'ValidationError') {
  //   // customError.msg = Object.values((err as any).errors)
  //   customError.msg = Object.values((err as ValidationError).errors)
  // }

  // NOTE:   Custom class + if-block + Type Guard - working
  if (isMongoError(err) && err.code === 11000) {
    customError.msg = `Duplicated value '${Object.keys(err.keyValue)}'`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (isCastError(err)) {
    customError.msg = `Invalid ID ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }


  // NOTE:   Using custom class
  if (isValidationError(err)) {
    customError.msg = Object.values(err.errors);
  }

  // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, msg: "Nah, something went wrong"})
  // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, msg: err})
  res.status(customError.statusCode).json({success: false, msg: customError.msg})
}

