import { prisma } from "../lib/prisma";
import { BoardInput } from "../validators";

export const boardService = {
  async getAll(userId: number) {
    return prisma.board.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(boardId: number, userId: number) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        tasks: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!board) {
      throw new Error("Board not found");
    }

    if (board.userId !== userId) {
      throw new Error("You don't have access to this board");
    }

    return board;
  },

  async create(data: BoardInput, userId: number) {
    return prisma.board.create({
      data: {
        title: data.title,
        userId,
      },
    });
  },

  async update(boardId: number, data: BoardInput, userId: number) {
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) throw new Error("Board not found");
    if (board.userId !== userId) throw new Error("You don't own this board");

    return prisma.board.update({
      where: { id: boardId },
      data: { title: data.title },
    });
  },

  async delete(boardId: number, userId: number) {
    const board = await prisma.board.findUnique({ where: { id: boardId } });

    if (!board) throw new Error("Board not found");
    if (board.userId !== userId) throw new Error("You don't own this board");

    return prisma.board.delete({ where: { id: boardId } });
  },
};
