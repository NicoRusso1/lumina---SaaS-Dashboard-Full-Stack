export type Role = 'USER' | 'ADMIN'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type KanbanStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type WorkspaceType = 'personal' | 'work' | 'study'

export interface User {
  id: number
  username: string
  email: string
  role: Role
  createdAt: string
  avatar?: string
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
  color?: string
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

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  pinned?: boolean
}

export interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'board_created' | 'task_deleted'
  message: string
  time: string
}

export interface Workspace {
  id: WorkspaceType
  label: string
  emoji: string
}
