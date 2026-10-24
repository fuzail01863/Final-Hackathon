import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import useApp from '../hooks/useApp'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { notice, clearNotice } = useApp()
  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-column">
        <Navbar onMenu={() => setSidebarOpen(true)} />
        <main className="page-content"><Outlet /></main>
      </div>
      {notice && <div className="toast" role="status"><span>{notice}</span><button onClick={clearNotice} aria-label="Dismiss notification">×</button></div>}
    </div>
  )
}
