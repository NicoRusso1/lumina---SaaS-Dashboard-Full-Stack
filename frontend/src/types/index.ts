export type Role = 'USER' | 'ADMIN'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface User {
  id: number
  username: string
  email: string
  role: Role
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Board {
  id: number
  title: string
  userId: number
  createdAt: string
  _count?: { tasks: number }
}

export interface Category {
  id: number
  name: string
  color: string
}

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: Priority
  boardId: number
  categoryId?: number
  createdAt: string
  category?: Category
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
