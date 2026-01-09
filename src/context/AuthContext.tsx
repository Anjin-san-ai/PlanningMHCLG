import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

export type UserPersona = 'LPA Officer' | 'Planning Officer'
export type LocalCouncil = 'Barnet' | 'Doncaster' | 'West Berkshire' | 'Newcastle' | 'Manchester City'

interface AuthContextType {
  isAuthenticated: boolean
  user: string | null
  userPersona: UserPersona | null
  localCouncil: LocalCouncil | null
  login: (username: string, password: string, userPersona: UserPersona, localCouncil: LocalCouncil) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded credentials as per requirements
const VALID_CREDENTIALS = {
  username: 'planning_officer',
  password: 'planning_officer'
}

const AUTH_STORAGE_KEY = 'mhclg_auth'
const USER_PERSONA_KEY = 'mhclg_user_persona'
const LOCAL_COUNCIL_KEY = 'mhclg_local_council'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
    return stored === 'true'
  })
  
  const [user, setUser] = useState<string | null>(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
    return stored === 'true' ? VALID_CREDENTIALS.username : null
  })

  const [userPersona, setUserPersona] = useState<UserPersona | null>(() => {
    const stored = sessionStorage.getItem(USER_PERSONA_KEY)
    return stored as UserPersona | null
  })

  const [localCouncil, setLocalCouncil] = useState<LocalCouncil | null>(() => {
    const stored = sessionStorage.getItem(LOCAL_COUNCIL_KEY)
    return stored as LocalCouncil | null
  })

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true')
      if (userPersona) sessionStorage.setItem(USER_PERSONA_KEY, userPersona)
      if (localCouncil) sessionStorage.setItem(LOCAL_COUNCIL_KEY, localCouncil)
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
      sessionStorage.removeItem(USER_PERSONA_KEY)
      sessionStorage.removeItem(LOCAL_COUNCIL_KEY)
    }
  }, [isAuthenticated, userPersona, localCouncil])

  const login = useCallback((username: string, password: string, persona: UserPersona, council: LocalCouncil): boolean => {
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      setIsAuthenticated(true)
      setUser(username)
      setUserPersona(persona)
      setLocalCouncil(council)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
    setUserPersona(null)
    setLocalCouncil(null)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    sessionStorage.removeItem(USER_PERSONA_KEY)
    sessionStorage.removeItem(LOCAL_COUNCIL_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userPersona, localCouncil, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

