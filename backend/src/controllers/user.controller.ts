import { Response } from "express";
import { AuthRequest } from "../types";
import { userService } from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response";

export const userController = {
  async getAll(_req: AuthRequest, res: Response) {
    try {
      const users = await userService.getAll();
      return sendSuccess(res, users, "Users retrieved");
    } catch (error) {
      return sendError(res, "Error fetching users", 500);
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const user = await userService.getById(Number(req.params.id));
      return sendSuccess(res, user, "User retrieved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching user";
      const status = message.includes("not found") ? 404 : 500;
      return sendError(res, message, status);
    }
  },
};
