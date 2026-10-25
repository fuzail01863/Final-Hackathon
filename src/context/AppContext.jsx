import { useEffect, useMemo, useState, useCallback } from 'react'
import AppContext from './AppContextStore'
import { getMe, logoutUser, setStoredToken } from '../services/api'

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hcm_user') || sessionStorage.getItem('hcm_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [roleState, setRoleState] = useState(() => user?.role || sessionStorage.getItem('hcm-preview-role') || null)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)

  const role = user?.role || roleState

  const setRole = useCallback((nextRole) => {
    sessionStorage.setItem('hcm-preview-role', nextRole)
    setRoleState(nextRole)
  }, [])

  const login = useCallback((token, userData) => {
    setStoredToken(token, true)
    localStorage.setItem('hcm_user', JSON.stringify(userData))
    setUser(userData)
    setRoleState(userData.role)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch {
      // Ignore network errors on logout
    } finally {
      setStoredToken('')
      localStorage.removeItem('hcm_user')
      sessionStorage.removeItem('hcm_user')
      sessionStorage.removeItem('hcm-preview-role')
      setUser(null)
      setRoleState(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const me = await getMe()
      setUser(me)
      setRoleState(me.role)
      localStorage.setItem('hcm_user', JSON.stringify(me))
      return me
    } catch (err) {
      if (err.status === 401) {
        logout()
      }
      return null
    }
  }, [logout])

  useEffect(() => {
    const token = localStorage.getItem('hcm_token') || sessionStorage.getItem('hcm_token')
    if (token) {
      refreshUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [refreshUser])

  const value = useMemo(() => ({
    user,
    role,
    setRole,
    login,
    logout,
    refreshUser,
    loading,
    clearRole: logout,
    notice,
    notify: setNotice,
    clearNotice: () => setNotice(''),
  }), [user, role, setRole, login, logout, refreshUser, loading, notice])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
