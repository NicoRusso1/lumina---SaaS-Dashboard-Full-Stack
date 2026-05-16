import api from './api'
import { ApiResponse, Task, Priority } from '../types'

interface TaskPayload {
  title: string
  description?: string
  priority?: Priority
  completed?: boolean
  categoryId?: number | null
}

export const taskService = {
  async getByBoard(boardId: number) {
    const res = await api.get<ApiResponse<Task[]>>(`/tasks/board/${boardId}`)
    return res.data.data
  },

  async create(boardId: number, data: TaskPayload) {
    const res = await api.post<ApiResponse<Task>>(`/tasks/board/${boardId}`, data)
    return res.data.data
  },

  async update(id: number, data: Partial<TaskPayload>) {
    const res = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data)
    return res.data.data
  },

  async remove(id: number) {
    await api.delete(`/tasks/${id}`)
  },
}
