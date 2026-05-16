import api from './api'
import { ApiResponse, AuthResponse } from '../types'

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password })
    return res.data.data
  },

  async register(username: string, email: string, password: string) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', { username, email, password })
    return res.data.data
  },
}
