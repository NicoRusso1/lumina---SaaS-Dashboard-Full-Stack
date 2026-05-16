import { prisma } from "../lib/prisma";

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { boards: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        boards: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            _count: { select: { tasks: true } },
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user;
  },
};
