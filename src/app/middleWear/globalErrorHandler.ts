// middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: process.env.NODE_ENV === "development" ? err : undefined,
  });
};

export default globalErrorHandler;
