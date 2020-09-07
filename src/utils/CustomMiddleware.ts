import { Request, Response, NextFunction } from "express";
import { CustomError } from "./CustomError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    res.status(err.status).send({
      error: err.code,
      description: err.message,
    });
  } else {
    console.error(err);
    res.status(500).send({
      error: "GENERIC",
      description: "Something went wrong. Please try again or contact support.",
    });
  }
  next();
}
