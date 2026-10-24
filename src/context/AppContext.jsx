import { useMemo, useState } from 'react'
import AppContext from './AppContextStore'

export function AppProvider({ children }) {
  const [role, setRoleState] = useState(() => sessionStorage.getItem('hcm-preview-role'))
  const [notice, setNotice] = useState('')

  const setRole = (nextRole) => {
    sessionStorage.setItem('hcm-preview-role', nextRole)
    setRoleState(nextRole)
  }

  const clearRole = () => {
    sessionStorage.removeItem('hcm-preview-role')
    setRoleState(null)
  }

  const value = useMemo(() => ({
    role,
    setRole,
    clearRole,
    notice,
    notify: setNotice,
    clearNotice: () => setNotice(''),
  }), [role, notice])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
