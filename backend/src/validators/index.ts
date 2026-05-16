import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const boardSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title too long"),
});

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  categoryId: z.number().int().positive().optional().nullable(),
});

export const updateTaskSchema = taskSchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BoardInput = z.infer<typeof boardSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
