import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Activity, ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness, CalendarCheck, CalendarDays,
  ChartNoAxesCombined, Check, ChevronDown, CircleDollarSign, Clock3, Download, FileClock,
  Filter, HelpCircle, MoreHorizontal, Plus, Search, Send, ShieldCheck, Sparkles, Users, Wallet,
} from 'lucide-react'
import useApp from '../hooks/useApp'
import { backendPending } from '../services/api'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FormField from '../components/FormField'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

const pageIntros = {
  organization: ['COMPANY PROFILE', 'Set up your organization', 'Configure the foundational details of your company.'],
  departments: ['YOUR ORG CHART', 'Departments & designations', 'Structure teams and job titles in one place.'],
  employees: ['PEOPLE DIRECTORY', 'Employee directory', 'Manage your people and their work details.'],
  attendance: ['TIME & ATTENDANCE', 'Attendance management', 'Review attendance records and manage corrections.'],
  'my-attendance': ['YOUR TIME', 'My attendance', 'Your personal attendance at a glance.'],
  leave: ['TIME OFF', 'Leave applications', 'Track your requests and available leave balance.'],
  'leave-approvals': ['HR INBOX', 'Leave approval inbox', 'Review leave requests from your team.'],
  'salary-structure': ['COMPENSATION', 'Salary structure', 'Manage salary components and compensation policies.'],
  payroll: ['PAY & BENEFITS', 'Payroll processing', 'Prepare, review, and finalize payroll runs.'],
  payslips: ['YOUR PAY', 'Payslips', 'Access your monthly payslips.'],
  analytics: ['INSIGHTS', 'Dashboards & analytics', 'Understand the health of your people operations.'],
  'ai-assistant': ['HCM LITE AI', 'Your policy assistant', 'Get help understanding your workplace policies.'],
  announcements: ['STAY IN THE LOOP', 'Announcements', 'Company updates and important messages.'],
  notifications: ['YOUR INBOX', 'Notifications', 'Updates that need your attention.'],
  'audit-logs': ['ADMINISTRATION', 'Audit logs', 'A record of important workspace activity.'],
  settings: ['YOUR ACCOUNT', 'Profile settings', 'Manage your personal details and preferences.'],
}

const actionNames = {
  organization: 'Save organization profile', departments: 'Add department', employees: 'Add employee',
  attendance: 'Record correction', 'my-attendance': 'Check in', leave: 'Request leave',
  'leave-approvals': 'Review requests', 'salary-structure': 'Add salary component', payroll: 'Create payroll draft',
  payslips: 'Download payslip', analytics: 'Export report', 'ai-assistant': 'Send message',
  announcements: 'New announcement', notifications: 'Mark all as read', 'audit-logs': 'Export logs',
  settings: 'Save changes',
}

function PageHeading({ eyebrow, title, description, action, onAction }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="button button-primary" onClick={onAction}><Plus size={16} />{action}</button>}</div>
}

function Dashboard({ role, onAction, navigate }) {
  const isEmployee = role === 'Employee'
  const stats = isEmployee
    ? [['Attendance this month', CalendarCheck, 'indigo'], ['Leave balance', CalendarDays, 'teal'], ['Next payday', Wallet, 'amber'], ['Pending requests', FileClock, 'rose']]
    : [['Team members', Users, 'indigo'], ['Present today', CalendarCheck, 'teal'], ['Pending approvals', Clock3, 'amber'], ['Payroll status', CircleDollarSign, 'rose']]
  return (
    <>
      <div className="welcome-banner"><div className="welcome-art"><span /><span /><span /></div><div className="welcome-content"><div className="eyebrow">YOUR HCM LITE WORKSPACE</div><h1>{isEmployee ? 'Your workday, made simpler.' : 'A better view of your people.'}</h1><p>{isEmployee ? 'Your personal people hub is ready. Check in, take time off, or find a policy.' : 'Your workspace is ready to connect. Start by setting up your organization and team.'}</p><div className="welcome-actions"><button className="button button-white" onClick={() => navigate(isEmployee ? '/my-attendance' : '/organization')}>{isEmployee ? 'View my attendance' : 'Set up organization'}<ArrowRight size={15} /></button><span><ShieldCheck size={14} /> Preview workspace · no data connected</span></div></div><div className="welcome-decoration"><div className="deco-orbit orbit-one" /><div className="deco-orbit orbit-two" /><div className="deco-center"><Activity size={30} /></div><i className="deco-dot dot-one" /><i className="deco-dot dot-two" /><i className="deco-dot dot-three" /></div></div>
      <div className="section-title-row"><div><h2>{isEmployee ? 'Your overview' : `${role} overview`}</h2><p>Live data will appear here once your workspace is connected.</p></div><button className="select-button">This month <ChevronDown size={14} /></button></div>
      <div className="stats-grid">{stats.map(([label, Icon, accent]) => <StatCard key={label} label={label} icon={Icon} accent={accent} />)}</div>
      <div className="dashboard-grid">
        <section className="panel chart-panel"><div className="panel-heading"><div><h3>{isEmployee ? 'Attendance overview' : 'People overview'}</h3><p>Activity will be displayed when data is available.</p></div><button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button></div><div className="chart-empty"><div className="chart-skeleton"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="chart-empty-note"><ChartNoAxesCombined size={19} /><span>Chart will populate with live workspace data</span></div></div></section>
        <section className="panel setup-panel"><div className="panel-heading"><div><h3>Getting started</h3><p>Prepare your HCM workspace</p></div><span className="setup-count">0/4</span></div><div className="checklist">{(isEmployee ? [['Review your profile', '/settings'], ['Explore attendance', '/my-attendance'], ['Check leave policies', '/ai-assistant'], ['Read announcements', '/announcements']] : [['Set up your organization', role === 'Admin' ? '/organization' : '/employees'], ['Add your departments', '/departments'], ['Invite your employees', '/employees'], ['Configure people policies', '/analytics']]).map(([label, path]) => <button key={label} onClick={() => navigate(path)} className="checklist-item"><span className="check-circle"><Check size={12} /></span><span>{label}</span><ArrowUpRight size={14} /></button>)}</div></section>
      </div>
      <section className="panel activity-panel"><div className="panel-heading"><div><h3>{isEmployee ? 'Your recent activity' : 'Recent activity'}</h3><p>Updates across your workspace</p></div><button className="text-link" onClick={() => navigate('/notifications')}>View notifications <ArrowRight size={14} /></button></div><EmptyState title="All quiet for now" description="Recent updates and activity will show up here once connected." /></section>
      <div className="footnote"><Sparkles size={14} /> No sample data is displayed. All metrics are waiting for your backend connection.</div>
      {role !== 'Employee' && <button className="dashboard-quick-action" onClick={onAction}><Plus size={16} /> Quick action</button>}
    </>
  )
}

function GenericContent({ slug, title, role, onAction, notify, navigate }) {
  const params = useParams()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('Overview')
  const [chatMessage, setChatMessage] = useState('')
  const actions = actionNames[slug]
  const isTable = ['employees', 'departments', 'attendance', 'leave', 'leave-approvals', 'payroll', 'payslips', 'notifications', 'audit-logs'].includes(slug)

  if (slug === 'employees' && location.pathname.endsWith('/new')) {
    return <EmployeeForm title={title} notify={notify} />
  }
  if (params.employeeId && slug === 'employees') {
    return <EmployeeProfile notify={notify} navigate={navigate} />
  }
  if (slug === 'ai-assistant') {
    return <><PageHeading eyebrow="HCM LITE AI" title="Your policy assistant" description="Ask questions about your workplace policies. Answers will be available once the AI service is connected." /><section className="panel chat-panel"><div className="chat-welcome"><div className="chat-sparkle"><Sparkles size={22} /></div><h2>How can I help?</h2><p>Ask about leave, benefits, company policies, or where to find something.</p><div className="suggestion-row">{['How much leave can I take?', 'Where can I find my payslip?', 'What is the leave policy?'].map((text) => <button key={text} onClick={() => setChatMessage(text)}>{text}<ArrowUpRight size={13} /></button>)}</div></div><div className="chat-messages"><EmptyState title="Start a conversation" description="No messages yet. AI responses are not available until backend integration." /></div><form className="chat-compose" onSubmit={(e) => { e.preventDefault(); notify(backendPending()); setChatMessage('') }}><input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Ask a question about your workplace..." aria-label="Message" /><button className="button button-primary" type="submit" disabled={!chatMessage.trim()}><Send size={15} /> Send</button></form><div className="chat-disclaimer">AI responses are not connected. Please verify policy details with your HR team.</div></section></>
  }
  if (slug === 'leave' && location.pathname.endsWith('/new')) return <SmartLeave notify={notify} />
  if (slug === 'my-attendance') return <><PageHeading eyebrow="YOUR TIME" title="My attendance" description="Your individual attendance and check-in tools." /><div className="attendance-hero panel"><div className="attendance-clock"><span className="live-dot" />TODAY'S ATTENDANCE</div><div className="clock-time">—:— <span>--</span></div><p>Attendance information is not connected yet.</p><div className="attendance-actions"><button className="button button-primary" onClick={() => notify(backendPending())}><CalendarCheck size={16} /> Check in</button><button className="button button-secondary" onClick={() => notify(backendPending())}>Check out</button></div><div className="attendance-summary"><span><small>Check-in</small><strong>—</strong></span><span><small>Check-out</small><strong>—</strong></span><span><small>Hours today</small><strong>—</strong></span></div></div><section className="panel"><div className="panel-heading"><div><h3>Attendance history</h3><p>Your recent records</p></div><button className="select-button">This month <ChevronDown size={14} /></button></div><DataTable columns={['Date', 'Check-in', 'Check-out', 'Hours', 'Status']} /></section></>
  if (slug === 'payslips' && !params.payslipId) return <><PageHeading eyebrow="YOUR PAY" title="Payslips" description="Your salary statements will be available here when payroll is connected." /><section className="panel"><div className="toolbar"><label className="search-field"><Search size={16} /><input placeholder="Search payslips..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><button className="select-button">All years <ChevronDown size={14} /></button></div><DataTable columns={['Pay period', 'Pay date', 'Gross pay', 'Net pay', 'Status', '']} emptyTitle="No payslips yet" emptyDescription="Your payslips will appear here after payroll is set up." /></section></>
  if (params.payslipId) return <Payslip notify={notify} />
  if (slug === 'organization') return <><PageHeading eyebrow="COMPANY PROFILE" title="Set up your organization" description="Configure the details used across your HCM workspace." action="Save changes" onAction={() => notify(backendPending())} /><div className="content-two-col"><section className="panel form-panel"><h3>Company information</h3><p className="panel-subtitle">Core details about your organization</p><div className="form-grid"><FormField label="Company name" placeholder="Enter company name" /><FormField label="Legal name" placeholder="Enter legal name" /></div><div className="form-grid"><FormField label="Work email" type="email" placeholder="name@company.com" /><FormField label="Phone number" placeholder="+1 (555) 000-0000" /></div><FormField label="Company website" placeholder="https://" /><FormField label="Company address" as="textarea" rows={3} placeholder="Street, city, region, postal code" /><div className="form-grid"><FormField label="Country" as="select" options={[{ value: '', label: 'Select country' }]} /><FormField label="Timezone" as="select" options={[{ value: '', label: 'Select timezone' }]} /></div></section><section className="panel side-info-panel"><div className="side-info-icon"><Building2Icon /></div><h3>Your company profile</h3><p>This information helps personalize your workspace and will be used in company documents.</p><ErrorState message="Changes will not be saved until backend integration is available." /></section></div></>
  if (slug === 'departments') return <><PageHeading eyebrow="YOUR ORG CHART" title={title} description="Create departments and job titles to reflect your organization." action="Add department" onAction={onAction} /><div className="stats-grid compact-stats"><StatCard label="Departments" icon={BriefcaseBusiness} /><StatCard label="Designations" icon={BadgeCheck} /><StatCard label="Reporting lines" icon={Activity} /></div><section className="panel"><div className="toolbar"><label className="search-field"><Search size={16} /><input placeholder="Search departments or titles..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><button className="button button-secondary" onClick={onAction}><Plus size={15} /> Add designation</button></div><DataTable columns={['Department', 'Designations', 'Team lead', 'Employees', 'Status', '']} emptyTitle="No departments created" emptyDescription="Your department structure will appear here once configured." /></section></>
  if (slug === 'salary-structure') return <><PageHeading eyebrow="COMPENSATION" title={title} description="Set salary components and compensation policies for your organization." action="Add component" onAction={onAction} /><div className="notice-banner"><ShieldCheck size={17} /><span><strong>Restricted information</strong> Salary details are sensitive and access should be limited to authorized admins.</span></div><section className="panel"><div className="toolbar"><div className="toolbar-note">Salary components</div><button className="button button-secondary" onClick={onAction}><Plus size={15} /> Add component</button></div><DataTable columns={['Component', 'Type', 'Calculation', 'Taxable', 'Status', '']} emptyTitle="No salary components" emptyDescription="Add your organization's salary components when ready." /></section></>
  if (slug === 'analytics') return <><PageHeading eyebrow="PEOPLE INSIGHTS" title={title} description="Explore trends across your organization. Reports require connected, real workspace data." /><div className="notice-banner"><ChartNoAxesCombined size={17} /><span><strong>No reports yet</strong> Analytics will populate only with real data from your connected backend. No sample metrics are shown.</span></div><div className="stats-grid">{[['Headcount', Users, 'indigo'], ['Attendance', CalendarCheck, 'teal'], ['Leave utilization', CalendarDays, 'amber'], ['Payroll costs', CircleDollarSign, 'rose']].map(([label, Icon, accent]) => <StatCard key={label} label={label} icon={Icon} accent={accent} />)}</div><div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h3>Workforce trends</h3><p>Headcount over time</p></div><button className="select-button">Last 12 months <ChevronDown size={14} /></button></div><EmptyState title="Waiting for workforce data" description="Connect a backend to generate this report." /></section><section className="panel chart-panel"><div className="panel-heading"><div><h3>Leave overview</h3><p>Leave by type</p></div></div><EmptyState title="No leave data available" description="Leave analytics will appear when records are connected." /></section></div></>
  if (slug === 'announcements') return <><PageHeading eyebrow="STAY IN THE LOOP" title={title} description="Company updates and messages for your workspace." action={role === 'Employee' ? undefined : 'New announcement'} onAction={onAction} /><div className="filter-tabs">{['All', 'Company', 'Team', 'Policy'].map((item) => <button key={item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)}>{item}</button>)}</div><section className="panel announcement-empty"><EmptyState title="No announcements yet" description="When your organization shares an update, it will appear here." action={role !== 'Employee' && <button className="button button-secondary" onClick={onAction}><Plus size={15} /> Create announcement</button>} /></section></>
  if (slug === 'settings') return <><PageHeading eyebrow="YOUR ACCOUNT" title={title} description="Manage your personal details and account preferences." action="Save changes" onAction={() => notify(backendPending())} /><div className="settings-tabs">{['Profile', 'Preferences', 'Security'].map((item) => <button key={item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)}>{item}</button>)}</div><div className="content-two-col"><section className="panel form-panel"><h3>{tab === 'Profile' ? 'Personal information' : tab === 'Preferences' ? 'Workspace preferences' : 'Security settings'}</h3><p className="panel-subtitle">Your changes will be applied after the backend is connected.</p>{tab === 'Profile' ? <><div className="form-grid"><FormField label="First name" placeholder="First name" /><FormField label="Last name" placeholder="Last name" /></div><FormField label="Work email" type="email" placeholder="you@company.com" /><FormField label="Job title" placeholder="Your job title" /><FormField label="Phone number" placeholder="Your phone number" /></> : tab === 'Preferences' ? <><FormField label="Language" as="select" options={[{ value: '', label: 'Select language' }]} /><FormField label="Timezone" as="select" options={[{ value: '', label: 'Select timezone' }]} /><FormField label="Date format" as="select" options={[{ value: '', label: 'Select date format' }]} /></> : <><FormField label="Current password" type="password" placeholder="Current password" /><button className="button button-secondary" onClick={() => navigate('/change-password')}>Change password</button></>}</section><section className="panel side-info-panel"><div className="avatar avatar-large avatar-indigo">{role?.[0]}</div><h3>{role} preview</h3><p>This is a local preview profile. Your actual profile will load from your HCM workspace.</p><StatusBadge>Preview account</StatusBadge></section></div></>
  if (slug === 'notifications') return <><PageHeading eyebrow="YOUR INBOX" title={title} description="Important updates from your workspace." action="Mark all as read" onAction={() => notify(backendPending())} /><div className="filter-tabs">{['All', 'Unread', 'Read'].map((item) => <button key={item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)}>{item}</button>)}</div><section className="panel"><DataTable columns={['Notification', 'Type', 'Date', 'Status']} emptyTitle="You’re all caught up" emptyDescription="New notifications will show here when connected." /></section></>
  if (slug === 'audit-logs') return <><PageHeading eyebrow="ADMINISTRATION" title={title} description="Review the history of important actions across your workspace." action="Export logs" onAction={onAction} /><div className="notice-banner"><ShieldCheck size={17} /><span>Audit events will be recorded when the application backend is connected.</span></div><section className="panel"><div className="toolbar"><label className="search-field"><Search size={16} /><input placeholder="Search activity..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><button className="select-button"><Filter size={14} /> Filters</button></div><DataTable columns={['Action', 'User', 'Resource', 'Date & time', 'IP address']} emptyTitle="No audit events" emptyDescription="Workspace activity will be recorded here after backend integration." /></section></>
  if (isTable) {
    const configs = {
      employees: { columns: ['Employee', 'Department', 'Designation', 'Work email', 'Status', ''], description: 'Your people directory will appear here when employee records are connected.', filters: ['All employees', 'Department', 'Status'] },
      attendance: { columns: ['Employee', 'Date', 'Check-in', 'Check-out', 'Hours', 'Status', ''], description: 'Attendance records will appear once connected to your workforce data.', filters: ['All teams', 'Date range', 'Status'] },
      leave: { columns: ['Leave type', 'Date range', 'Days', 'Applied on', 'Status', ''], description: 'Your leave requests will appear here.', filters: ['All requests', 'Leave type', 'Status'] },
      'leave-approvals': { columns: ['Employee', 'Leave type', 'Date range', 'Days', 'Applied on', 'Status', ''], description: 'There are no leave requests to review yet.', filters: ['All requests', 'Department', 'Status'] },
      payroll: { columns: ['Pay period', 'Employees', 'Gross payroll', 'Net payroll', 'Status', ''], description: 'Your payroll runs will appear here once configured.', filters: ['All runs', 'Pay period', 'Status'] },
      payslips: { columns: ['Pay period', 'Pay date', 'Gross pay', 'Net pay', 'Status', ''], description: 'Your payslips will appear here after payroll is set up.', filters: ['All years'] },
      notifications: { columns: ['Notification', 'Type', 'Date', 'Status'], description: 'New notifications will show here when connected.', filters: [] },
      'audit-logs': { columns: ['Action', 'User', 'Resource', 'Date & time', 'IP address'], description: 'Workspace activity will appear here once audit logging is connected.', filters: [] },
    }
    const config = configs[slug]
    const pageAction = slug === 'payroll' && role === 'Admin' ? 'Review & finalize payroll' : actions
    return <><PageHeading eyebrow={pageIntros[slug]?.[0] || 'WORKSPACE'} title={pageIntros[slug]?.[1] || title} description={pageIntros[slug]?.[2] || config.description} action={pageAction} onAction={onAction} /><section className="panel"><div className="toolbar"><label className="search-field"><Search size={16} /><input placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={(e) => setQuery(e.target.value)} /></label><div className="toolbar-actions">{config.filters.map((filter) => <button key={filter} className="select-button"><Filter size={14} />{filter}<ChevronDown size={13} /></button>)}</div></div><DataTable columns={config.columns} emptyTitle={`No ${slug === 'employees' ? 'employees' : slug === 'leave-approvals' ? 'requests' : 'records'} yet`} emptyDescription={config.description} /></section></>
  }
  return <EmptyState title={title} description="This workspace section is being prepared." />
}

function EmployeeForm({ title, notify }) {
  return <><PageHeading eyebrow="PEOPLE DIRECTORY" title={title || 'Add employee'} description="Add employee details to your organization." /><div className="content-two-col"><section className="panel form-panel"><h3>Personal details</h3><p className="panel-subtitle">Required information for the employee profile</p><div className="form-grid"><FormField label="First name" placeholder="First name" required /><FormField label="Last name" placeholder="Last name" required /></div><FormField label="Work email" type="email" placeholder="name@company.com" required /><div className="form-grid"><FormField label="Phone number" placeholder="+1 (555) 000-0000" /><FormField label="Date of birth" type="date" /></div><h3 className="form-section-heading">Work details</h3><div className="form-grid"><FormField label="Department" as="select" options={[{ value: '', label: 'Select department' }]} /><FormField label="Designation" as="select" options={[{ value: '', label: 'Select designation' }]} /></div><div className="form-grid"><FormField label="Employment type" as="select" options={[{ value: '', label: 'Select type' }]} /><FormField label="Start date" type="date" /></div><FormField label="Reporting manager" as="select" options={[{ value: '', label: 'Select manager' }]} /><div className="form-actions"><button className="button button-secondary" onClick={() => window.history.back()}>Cancel</button><button className="button button-primary" onClick={() => notify(backendPending())}>Save employee</button></div></section><section className="panel side-info-panel"><Users size={21} /><h3>Employee profile</h3><p>Employee records are private. Access is limited to authorized HR and admin roles.</p><ErrorState message="This form is a preview. No employee record will be created." /></section></div></>
}

function EmployeeProfile({ notify, navigate }) {
  const { employeeId } = useParams()
  return <><PageHeading eyebrow="EMPLOYEE 360" title="Employee profile" description={`Profile ${employeeId} · Detailed employee information and activity.`} action="Edit profile" onAction={() => navigate(`/employees/${employeeId}/edit`)} /><div className="employee-summary panel"><div className="avatar avatar-large avatar-indigo">—</div><div className="employee-summary-info"><span className="eyebrow">EMPLOYEE RECORD</span><h2>Employee details unavailable</h2><p>Connect your backend to load this employee's information.</p></div><StatusBadge>Not connected</StatusBadge><button className="icon-button" aria-label="More options" onClick={() => notify(backendPending())}><MoreHorizontal size={19} /></button></div><div className="settings-tabs">{['Overview', 'Attendance', 'Leave', 'Documents'].map((item) => <button key={item} className={item === 'Overview' ? 'selected' : ''}>{item}</button>)}</div><div className="dashboard-grid"><section className="panel form-panel"><h3>Personal information</h3><div className="detail-list">{['Work email', 'Phone number', 'Department', 'Designation', 'Employment type', 'Start date', 'Manager'].map((label) => <div key={label}><small>{label}</small><strong>—</strong></div>)}</div></section><section className="panel"><div className="panel-heading"><div><h3>Recent activity</h3><p>Employee history</p></div></div><EmptyState title="No activity available" description="Activity will appear when records are connected." /></section></div></>
}

function SmartLeave({ notify }) {
  return <><PageHeading eyebrow="TIME OFF" title="Smart leave request" description="Tell us when you need time away. Your policy assistant can help with questions." /><div className="content-two-col"><section className="panel form-panel"><h3>Request details</h3><p className="panel-subtitle">Your request won't be submitted until backend integration is complete.</p><FormField label="Leave type" as="select" options={[{ value: '', label: 'Select leave type' }]} required /><div className="form-grid"><FormField label="Start date" type="date" required /><FormField label="End date" type="date" required /></div><FormField label="Reason (optional)" as="textarea" rows={4} placeholder="Add a note for your manager..." /><div className="error-state"><HelpCircle size={17} /><span>Leave balance and policy details will load when connected.</span></div><div className="form-actions"><button className="button button-secondary" onClick={() => window.history.back()}>Cancel</button><button className="button button-primary" onClick={() => notify(backendPending())}>Submit request <ArrowRight size={15} /></button></div></section><section className="panel smart-tip"><div className="chat-sparkle"><Sparkles size={20} /></div><h3>Need help with leave?</h3><p>Ask the HCM Lite policy assistant about your workplace leave policies.</p><button className="text-link" onClick={() => window.location.assign('/ai-assistant')}>Ask the policy assistant <ArrowRight size={14} /></button></section></div></>
}

function Payslip({ notify }) {
  return <><PageHeading eyebrow="YOUR PAY" title="Payslip details" description="Review a payroll statement." action="Download PDF" onAction={() => notify(backendPending())} /><section className="payslip-sheet panel"><div className="payslip-top"><div className="brand-mark"><Activity size={18} /></div><span>HCM LITE · PAY STATEMENT</span><StatusBadge>Not available</StatusBadge></div><EmptyState title="Payslip not found" description="Payslip details are not available because payroll is not connected." /><button className="button button-secondary" onClick={() => notify(backendPending())}><Download size={15} /> Download PDF</button></section></>
}

function Building2Icon() {
  return <BriefcaseBusiness size={21} />
}

export default function WorkspacePage({ title }) {
  const location = window.location.pathname
  const slug = location.split('/')[1] || 'dashboard'
  const { role, notify } = useApp()
  const navigate = useNavigate()
  const params = useParams()
  const onAction = () => {
    if (slug === 'employees') navigate('/employees/new')
    else if (slug === 'leave' && role === 'Employee') navigate('/leave/new')
    else notify(backendPending())
  }
  if (slug === 'dashboard') return <Dashboard role={role} onAction={onAction} navigate={navigate} />
  if (slug === 'employees' && params.employeeId) {
    if (location.endsWith('/edit')) return <EmployeeForm title="Edit employee" notify={notify} />
    return <EmployeeProfile notify={notify} navigate={navigate} />
  }
  return <GenericContent slug={slug} title={title} role={role} onAction={onAction} notify={notify} navigate={navigate} />
}
