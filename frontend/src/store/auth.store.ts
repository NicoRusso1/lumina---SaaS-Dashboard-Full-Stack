import { create } from 'zustand'
import { User } from '../types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

const storedUser = localStorage.getItem('lumina_user')
const storedToken = localStorage.getItem('lumina_token')

export const useAuthStore = create<AuthStore>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,

  setAuth: (user, token) => {
    localStorage.setItem('lumina_token', token)
    localStorage.setItem('lumina_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('lumina_token')
    localStorage.removeItem('lumina_user')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
