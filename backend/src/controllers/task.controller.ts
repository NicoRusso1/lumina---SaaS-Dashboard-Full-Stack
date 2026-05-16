import { Response } from "express";
import { AuthRequest } from "../types";
import { taskService } from "../services/task.service";
import { sendSuccess, sendError } from "../utils/response";

export const taskController = {
  async getByBoard(req: AuthRequest, res: Response) {
    try {
      const tasks = await taskService.getByBoard(
        Number(req.params.boardId),
        req.user!.userId
      );
      return sendSuccess(res, tasks, "Tasks retrieved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching tasks";
      const status = message.includes("not found") ? 404 : message.includes("access") ? 403 : 500;
      return sendError(res, message, status);
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.getById(
        Number(req.params.id),
        req.user!.userId
      );
      return sendSuccess(res, task, "Task retrieved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching task";
      const status = message.includes("not found") ? 404 : message.includes("access") ? 403 : 500;
      return sendError(res, message, status);
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.create(
        Number(req.params.boardId),
        req.body,
        req.user!.userId
      );
      return sendSuccess(res, task, "Task created successfully", 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error creating task";
      const status = message.includes("not found") ? 404 : message.includes("access") ? 403 : 500;
      return sendError(res, message, status);
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.update(
        Number(req.params.id),
        req.body,
        req.user!.userId
      );
      return sendSuccess(res, task, "Task updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error updating task";
      const status = message.includes("not found") ? 404 : message.includes("access") ? 403 : 500;
      return sendError(res, message, status);
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await taskService.delete(
        Number(req.params.id),
        req.user!.userId,
        req.user!.role
      );
      return sendSuccess(res, null, "Task deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error deleting task";
      const status = message.includes("not found") ? 404 : message.includes("can't") ? 403 : 500;
      return sendError(res, message, status);
    }
  },
};
