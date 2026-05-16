import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, "Account created successfully", 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      return sendError(res, message, 400);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, "Login successful");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return sendError(res, message, 401);
    }
  },
};
