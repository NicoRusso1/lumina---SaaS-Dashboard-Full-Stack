import { prisma } from "../lib/prisma";
import { TaskInput } from "../validators";
import { Role } from "@prisma/client";

export const taskService = {
  // Check that the board belongs to the user before touching tasks
  async verifyBoardOwnership(boardId: number, userId: number) {
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) throw new Error("Board not found");
    if (board.userId !== userId) throw new Error("You don't have access to this board");

    return board;
  },

  async getByBoard(boardId: number, userId: number) {
    await this.verifyBoardOwnership(boardId, userId);

    return prisma.task.findMany({
      where: { boardId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(taskId: number, userId: number) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        category: true,
        board: true,
      },
    });

    if (!task) throw new Error("Task not found");

    await this.verifyBoardOwnership(task.boardId, userId);

    return task;
  },

  async create(boardId: number, data: TaskInput, userId: number) {
    await this.verifyBoardOwnership(boardId, userId);

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority ?? "MEDIUM",
        categoryId: data.categoryId,
        boardId,
      },
      include: { category: true },
    });
  },

  async update(taskId: number, data: Partial<TaskInput>, userId: number) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) throw new Error("Task not found");

    await this.verifyBoardOwnership(task.boardId, userId);

    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
      include: { category: true },
    });
  },

  async delete(taskId: number, userId: number, userRole: Role) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { board: true },
    });

    if (!task) throw new Error("Task not found");

    // Admins can delete any task, regular users only their own
    if (userRole !== Role.ADMIN && task.board.userId !== userId) {
      throw new Error("You can't delete this task");
    }

    return prisma.task.delete({ where: { id: taskId } });
  },
};
