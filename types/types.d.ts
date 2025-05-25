
// import 'express'
//
// declare module "express" {
//   export interface Request {
//     user: {
//       userId: number,
//       name: string
//     }
//   }
// }

import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    name: string;
  };
}

