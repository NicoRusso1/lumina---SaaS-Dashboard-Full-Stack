import api from './api'
import { ApiResponse, Board } from '../types'

export const boardService = {
  async getAll() {
    const res = await api.get<ApiResponse<Board[]>>('/boards')
    return res.data.data
  },

  async getById(id: number) {
    const res = await api.get<ApiResponse<Board>>(`/boards/${id}`)
    return res.data.data
  },

  async create(title: string) {
    const res = await api.post<ApiResponse<Board>>('/boards', { title })
    return res.data.data
  },

  async update(id: number, title: string) {
    const res = await api.put<ApiResponse<Board>>(`/boards/${id}`, { title })
    return res.data.data
  },

  async remove(id: number) {
    await api.delete(`/boards/${id}`)
  },
}
