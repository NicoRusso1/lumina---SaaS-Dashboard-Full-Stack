import { Response } from "express";
import { AuthRequest } from "../types";
import { boardService } from "../services/board.service";
import { sendSuccess, sendError } from "../utils/response";

export const boardController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const boards = await boardService.getAll(req.user!.userId);
      return sendSuccess(res, boards, "Boards retrieved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching boards";
      return sendError(res, message, 500);
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const board = await boardService.getById(
        Number(req.params.id),
        req.user!.userId
      );
      return sendSuccess(res, board, "Board retrieved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching board";
      const status = message.includes("not found") ? 404 : message.includes("access") ? 403 : 500;
      return sendError(res, message, status);
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const board = await boardService.create(req.body, req.user!.userId);
      return sendSuccess(res, board, "Board created successfully", 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error creating board";
      return sendError(res, message, 500);
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const board = await boardService.update(
        Number(req.params.id),
        req.body,
        req.user!.userId
      );
      return sendSuccess(res, board, "Board updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error updating board";
      const status = message.includes("not found") ? 404 : message.includes("own") ? 403 : 500;
      return sendError(res, message, status);
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await boardService.delete(Number(req.params.id), req.user!.userId);
      return sendSuccess(res, null, "Board deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error deleting board";
      const status = message.includes("not found") ? 404 : message.includes("own") ? 403 : 500;
      return sendError(res, message, status);
    }
  },
};
