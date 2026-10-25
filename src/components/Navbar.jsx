import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import useApp from '../hooks/useApp'

const pageNames = {
  dashboard: 'Overview', organization: 'Organization setup', departments: 'Departments & designations',
  employees: 'Employee directory', attendance: 'Attendance management', 'my-attendance': 'My attendance',
  leave: 'Leave applications', 'leave-approvals': 'Leave approval inbox', 'salary-structure': 'Salary structure',
  payroll: 'Payroll processing', payslips: 'Payslips', analytics: 'Dashboards & analytics',
  'ai-assistant': 'AI policy assistant', announcements: 'Announcements', notifications: 'Notifications',
  'audit-logs': 'Audit logs', settings: 'Profile settings',
}

export default function Navbar({ onMenu }) {
  const { role, user } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const current = location.pathname.split('/')[1]

  const userInitial = (user?.email?.[0] || role?.[0] || 'U').toUpperCase()
  const userTitle = user?.email || `${role || 'User'}`

  return (
    <header className="topbar">
      <button className="icon-button menu-toggle" aria-label="Open navigation" onClick={onMenu}>
        <Menu size={20} />
      </button>
      <div className="breadcrumbs">
        <span>Workspace</span>
        <span className="crumb-divider">/</span>
        <strong>{pageNames[current] || 'Workspace'}</strong>
      </div>
      <div className="topbar-actions">
        <label className="global-search">
          <Search size={16} />
          <input placeholder="Search workspace..." aria-label="Search" />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button notification-button" aria-label="Notifications" onClick={() => navigate('/notifications')}>
          <Bell size={18} />
          <i />
        </button>
        <div className="topbar-divider" />
        <button className="topbar-profile" onClick={() => navigate('/settings')}>
          <span className="avatar avatar-indigo">{userInitial}</span>
          <span className="profile-label">
            <strong>{userTitle}</strong>
            <small>{role} account</small>
          </span>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  )
}
