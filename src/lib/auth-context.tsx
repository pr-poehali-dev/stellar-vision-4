import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getMe, logout as apiLogout } from './api'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  birth_date?: string
  passport_series?: string
  passport_number?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (u: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, setUser: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('delta_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('delta_token'))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, setUser, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
