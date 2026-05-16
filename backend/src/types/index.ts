import { Role } from "@prisma/client";
import { Request } from "express";

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

// Extend Express Request to include the authenticated user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}
