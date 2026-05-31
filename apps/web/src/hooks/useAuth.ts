import { useState, useEffect } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Admin',
    email: 'admin@empresa.com',
    role: 'admin',
  })
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    // Placeholder auth logic
    setUser({ id: '1', name: 'Admin', email, role: 'admin' })
    setLoading(false)
  }

  const signOut = () => {
    setUser(null)
  }

  return { user, loading, signIn, signOut }
}
