import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const notFound = (req: Request, res: Response) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);
  return sendError(res, err.message || "Internal server error", 500);
};
