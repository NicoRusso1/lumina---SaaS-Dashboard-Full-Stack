import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../validators";
import { config } from "../config/env";

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existing) {
      const field = existing.email === data.email ? "Email" : "Username";
      throw new Error(`${field} is already in use`);
    }

    const hashedPassword = await bcrypt.hash(data.password, config.bcryptRounds);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },
};
