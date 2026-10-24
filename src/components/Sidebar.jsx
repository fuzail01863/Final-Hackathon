import { NavLink, useLocation } from 'react-router-dom'
import { Activity, Bell, BriefcaseBusiness, Building2, CalendarCheck, CalendarDays, ChartNoAxesCombined, ChevronDown, CircleDollarSign, ClipboardList, FileClock, FileText, LayoutDashboard, Megaphone, MessageCircle, Settings2, ShieldCheck, Users, X } from 'lucide-react'
import useApp from '../hooks/useApp'

const menuByRole = {
  Admin: [
    ['Workspace', [['Dashboard', '/dashboard', LayoutDashboard], ['Organization setup', '/organization', Building2], ['Departments', '/departments', BriefcaseBusiness], ['Employee directory', '/employees', Users]]],
    ['Manage', [['Attendance', '/attendance', CalendarCheck], ['Salary structure', '/salary-structure', CircleDollarSign], ['Payroll', '/payroll', CircleDollarSign], ['Analytics', '/analytics', ChartNoAxesCombined], ['Announcements', '/announcements', Megaphone]]],
    ['Administration', [['Notifications', '/notifications', Bell], ['Audit logs', '/audit-logs', ShieldCheck], ['Profile settings', '/settings', Settings2]]],
  ],
  HR: [
    ['Workspace', [['Dashboard', '/dashboard', LayoutDashboard], ['Employee directory', '/employees', Users], ['Departments', '/departments', BriefcaseBusiness]]],
    ['Manage', [['Attendance', '/attendance', CalendarCheck], ['Leave approvals', '/leave-approvals', ClipboardList], ['Salary structure', '/salary-structure', CircleDollarSign], ['Payroll drafts', '/payroll', CircleDollarSign], ['Analytics', '/analytics', ChartNoAxesCombined], ['Announcements', '/announcements', Megaphone]]],
    ['Administration', [['Notifications', '/notifications', Bell], ['Profile settings', '/settings', Settings2]]],
  ],
  Employee: [
    ['Workspace', [['Dashboard', '/dashboard', LayoutDashboard], ['My attendance', '/my-attendance', CalendarCheck], ['My leave', '/leave', CalendarDays], ['My payslips', '/payslips', FileText]]],
    ['Connect', [['AI policy assistant', '/ai-assistant', MessageCircle], ['Announcements', '/announcements', Megaphone]]],
    ['Account', [['Notifications', '/notifications', Bell], ['Profile settings', '/settings', Settings2]]],
  ],
}

export default function Sidebar({ open, onClose }) {
  const { role } = useApp()
  const location = useLocation()
  const sections = menuByRole[role] || []
  return (
    <>
      {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Activity size={19} strokeWidth={2.6} /></div>
          <div><strong>hcm<span>lite</span></strong><small>PEOPLE, SIMPLIFIED</small></div>
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <button className="workspace-switcher"><span className="workspace-avatar">H</span><span><strong>Workspace preview</strong><small>{role} view</small></span><ChevronDown size={15} /></button>
        <nav className="side-nav" aria-label="Main navigation">
          {sections.map(([section, links]) => (
            <div className="nav-section" key={section}>
              <div className="nav-section-title">{section}</div>
              {links.map(([label, to, Icon]) => (
                <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `nav-link ${isActive || (to !== '/dashboard' && location.pathname.startsWith(to + '/')) ? 'active' : ''}`}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                  {to === '/notifications' && <i className="nav-dot" />}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="help-card"><span className="help-icon"><FileClock size={17} /></span><strong>Just getting started?</strong><p>Your workspace is ready to connect.</p><span className="help-progress"><i /></span><small>Setup guide · 0 of 4</small></div>
          <div className="sidebar-user"><div className="avatar avatar-indigo">{role === 'Employee' ? 'E' : role === 'HR' ? 'H' : 'A'}</div><span><strong>{role} preview</strong><small>Demo navigation only</small></span><ChevronDown size={15} /></div>
        </div>
      </aside>
    </>
  )
}
