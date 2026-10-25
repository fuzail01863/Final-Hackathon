import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Activity, ArrowRight, ArrowUpRight, BadgeCheck, BriefcaseBusiness, CalendarCheck, CalendarDays,
  ChartNoAxesCombined, Check, ChevronDown, CircleDollarSign, Clock3, Download, FileClock,
  Filter, HelpCircle, MoreHorizontal, Plus, Search, Send, ShieldCheck, Sparkles, Users, Wallet,
  Trash2, AlertCircle, CheckCircle2, RefreshCw,
} from 'lucide-react'
import useApp from '../hooks/useApp'
import {
  getDashboard, getOrganization, updateOrganization, createUnit, deleteUnit,
  getEmployees, getEmployee, createEmployee, updateEmployee,
  getAttendance, checkIn, checkOut,
  getLeaves, applyLeave, getLeaveBalance, decideLeave, cancelLeave,
  getPayrolls, createPayroll, finalizePayroll, getPayslips,
  getAnnouncements, createAnnouncement,
  getNotifications, markNotificationRead,
  getAuditLogs, aiChat, aiSmartLeave,
} from '../services/api'
import DataTable from '../components/DataTable'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FormField from '../components/FormField'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

function PageHeading({ eyebrow, title, description, action, onAction }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && (
        <button className="button button-primary" onClick={onAction}>
          <Plus size={16} />{action}
        </button>
      )}
    </div>
  )
}

// ---------------- DASHBOARD ----------------
function Dashboard({ role, onAction, navigate }) {
  const isEmployee = role === 'Employee'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = isEmployee
    ? [
        ['Attendance this month', CalendarCheck, 'teal', data?.attendanceCount ?? '—'],
        ['Leave balance', CalendarDays, 'teal', data?.leaveBalance ?? '14 days'],
        ['Next payday', Wallet, 'amber', 'End of month'],
        ['Pending requests', FileClock, 'rose', data?.pendingLeaves ?? 0],
      ]
    : [
        ['Team members', Users, 'indigo', data?.headcount ?? data?.totalEmployees ?? '—'],
        ['Present today', CalendarCheck, 'teal', data?.presentToday ?? '—'],
        ['Pending approvals', Clock3, 'amber', data?.pendingLeaves ?? 0],
        ['Payroll status', CircleDollarSign, 'rose', data?.payrollStatus || 'Draft ready'],
      ]

  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-art"><span /><span /><span /></div>
        <div className="welcome-content">
          <div className="eyebrow">YOUR HCM LITE WORKSPACE</div>
          <h1>{isEmployee ? 'Your workday, made simpler.' : 'A better view of your people.'}</h1>
          <p>
            {isEmployee
              ? 'Your personal people hub is active. Check in, request time off, or query workplace policies.'
              : 'Your workspace is connected and operational. Manage employees, track attendance, and process payroll.'}
          </p>
          <div className="welcome-actions">
            <button className="button button-white" onClick={() => navigate(isEmployee ? '/my-attendance' : '/employees')}>
              {isEmployee ? 'View my attendance' : 'Manage employees'}
              <ArrowRight size={15} />
            </button>
            <span><ShieldCheck size={14} /> Connected & secure workspace</span>
          </div>
        </div>
        <div className="welcome-decoration">
          <div className="deco-orbit orbit-one" />
          <div className="deco-orbit orbit-two" />
          <div className="deco-center"><Activity size={30} /></div>
          <i className="deco-dot dot-one" /><i className="deco-dot dot-two" /><i className="deco-dot dot-three" />
        </div>
      </div>

      <div className="section-title-row">
        <div>
          <h2>{isEmployee ? 'Your overview' : `${role} overview`}</h2>
          <p>{loading ? 'Loading live workspace metrics...' : 'Real-time metrics from your HCM Lite system.'}</p>
        </div>
        <button className="select-button">This month <ChevronDown size={14} /></button>
      </div>

      <div className="stats-grid">
        {stats.map(([label, Icon, accent, val]) => (
          <div key={label} className={`stat-card accent-${accent}`}>
            <div className="stat-card-icon"><Icon size={20} /></div>
            <div className="stat-card-content">
              <span className="stat-card-label">{label}</span>
              <strong className="stat-card-value">{val}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>{isEmployee ? 'My recent attendance' : 'People & Activity Overview'}</h3>
              <p>System operational</p>
            </div>
            <button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button>
          </div>
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
            <ChartNoAxesCombined size={32} style={{ margin: '0 auto 12px auto', display: 'block', color: '#6366f1' }} />
            <p style={{ margin: 0, fontWeight: 500, color: '#1e293b' }}>Active Workspace Connection</p>
            <small style={{ color: '#64748b' }}>Data is synchronizing live with the HCM Lite backend API.</small>
          </div>
        </section>

        <section className="panel setup-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick navigation</h3>
              <p>Frequently accessed actions</p>
            </div>
          </div>
          <div className="checklist">
            {(isEmployee
              ? [
                  ['Check my attendance', '/my-attendance'],
                  ['Apply for leave', '/leave/new'],
                  ['Ask the AI assistant', '/ai-assistant'],
                  ['View payslips', '/payslips'],
                ]
              : [
                  ['Employee directory', '/employees'],
                  ['Review leave requests', '/leave-approvals'],
                  ['Departments & structure', '/departments'],
                  ['Company announcements', '/announcements'],
                ]
            ).map(([label, path]) => (
              <button key={label} onClick={() => navigate(path)} className="checklist-item">
                <span className="check-circle"><Check size={12} /></span>
                <span>{label}</span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="panel activity-panel">
        <div className="panel-heading">
          <div>
            <h3>Announcements & Updates</h3>
            <p>Recent notices</p>
          </div>
          <button className="text-link" onClick={() => navigate('/announcements')}>
            View all announcements <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Stay tuned to company announcements and team policy updates via the announcements board.
          </p>
        </div>
      </section>
    </>
  )
}

// ---------------- EMPLOYEE DIRECTORY & FORM ----------------
function EmployeeForm({ title, notify }) {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [resultNotice, setResultNotice] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    code: `EMP${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    email: '',
    departmentId: '',
    designationId: '',
    joiningDate: new Date().toISOString().slice(0, 10),
    status: 'active',
    basicSalary: 50000,
    phone: '',
    address: '',
    gender: 'unspecified',
    emergencyContact: '',
  })

  useEffect(() => {
    getOrganization()
      .then((res) => {
        const units = res?.units || []
        setDepartments(units.filter((u) => u.kind === 'department' && u.active !== false))
        setDesignations(units.filter((u) => u.kind === 'designation' && u.active !== false))
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSubmitting(true)

    try {
      const payload = {
        ...form,
        basicSalary: Number(form.basicSalary),
      }
      if (!payload.departmentId && departments.length) {
        payload.departmentId = departments[0]._id
      }
      if (!payload.designationId && designations.length) {
        payload.designationId = designations[0]._id
      }

      const res = await createEmployee(payload)
      setResultNotice(res)
      notify(`Employee ${form.name} created successfully!`)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create employee.')
    } finally {
      setSubmitting(false)
    }
  }

  if (resultNotice) {
    return (
      <div className="panel" style={{ maxWidth: '600px', margin: '40px auto', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
          <h2>Employee Created Successfully!</h2>
          <p style={{ color: '#64748b' }}>Account credentials have been generated.</p>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <p><strong>Employee Code:</strong> {resultNotice.employee?.code || form.code}</p>
          <p><strong>Email:</strong> {resultNotice.employee?.email || form.email}</p>
          <p><strong>Temporary Password:</strong> <code style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{resultNotice.temporaryPassword || '(Provided to user)'}</code></p>
          <small style={{ color: '#64748b' }}>Please share these credentials securely with the employee.</small>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="button button-primary" onClick={() => navigate('/employees')}>
            Back to Directory
          </button>
          <button className="button button-secondary" onClick={() => { setResultNotice(null); setForm(f => ({ ...f, code: `EMP${Math.floor(100 + Math.random() * 900)}`, name: '', email: '' })) }}>
            Add Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeading eyebrow="PEOPLE DIRECTORY" title={title || 'Add employee'} description="Register an employee profile with linked login credentials." />
      <div className="content-two-col">
        <section className="panel form-panel">
          <h3>Personal details</h3>
          <p className="panel-subtitle">Required information for employee record</p>

          {errorMsg && (
            <div className="inline-notice error-notice" style={{ background: '#fef2f2', color: '#b91c1c', marginBottom: '16px' }}>
              <AlertCircle size={15} /> <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormField
                label="Employee code"
                placeholder="EMP001"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
              <FormField
                label="Full name"
                placeholder="First and last name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <FormField
              label="Work email"
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="form-grid">
              <FormField
                label="Phone number"
                placeholder="+92 300 0000000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <FormField
                label="Gender"
                as="select"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                options={[
                  { value: 'unspecified', label: 'Unspecified' },
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>

            <h3 className="form-section-heading">Work details</h3>

            <div className="form-grid">
              <FormField
                label="Department"
                as="select"
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                options={[
                  { value: '', label: departments.length ? 'Select department' : 'No departments yet (will create)' },
                  ...departments.map((d) => ({ value: d._id, label: d.name })),
                ]}
              />
              <FormField
                label="Designation"
                as="select"
                value={form.designationId}
                onChange={(e) => setForm({ ...form, designationId: e.target.value })}
                options={[
                  { value: '', label: designations.length ? 'Select designation' : 'No designations yet (will create)' },
                  ...designations.map((d) => ({ value: d._id, label: d.name })),
                ]}
              />
            </div>

            <div className="form-grid">
              <FormField
                label="Joining date"
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                required
              />
              <FormField
                label="Basic monthly salary (PKR)"
                type="number"
                min={1}
                value={form.basicSalary}
                onChange={(e) => setForm({ ...form, basicSalary: e.target.value })}
                required
              />
            </div>

            <FormField
              label="Home address"
              placeholder="Residential address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <div className="form-actions">
              <button type="button" className="button button-secondary" onClick={() => window.history.back()}>Cancel</button>
              <button type="submit" className="button button-primary" disabled={submitting}>
                {submitting ? 'Saving employee...' : 'Save employee'}
              </button>
            </div>
          </form>
        </section>

        <section className="panel side-info-panel">
          <Users size={24} color="#6366f1" />
          <h3>Employee profile</h3>
          <p>When you register an employee, the system automatically creates their linked user account and temporary credentials.</p>
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
            <p>Departments and designations can be created under <strong>Departments & designations</strong>.</p>
          </div>
        </section>
      </div>
    </>
  )
}

function EmployeeProfile({ notify, navigate }) {
  const { employeeId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmployee(employeeId)
      .then((res) => setProfile(res))
      .catch((err) => notify(err.message))
      .finally(() => setLoading(false))
  }, [employeeId, notify])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading employee profile...</div>

  const emp = profile?.employee || profile || {}

  return (
    <>
      <PageHeading
        eyebrow="EMPLOYEE 360"
        title={emp.name || 'Employee profile'}
        description={`Code: ${emp.code || '—'} · Email: ${emp.email || '—'}`}
      />
      <div className="employee-summary panel">
        <div className="avatar avatar-large avatar-indigo">{(emp.name?.[0] || 'E').toUpperCase()}</div>
        <div className="employee-summary-info">
          <span className="eyebrow">EMPLOYEE RECORD</span>
          <h2>{emp.name || 'Unnamed Employee'}</h2>
          <p>{emp.email || '—'} · Joined {emp.joiningDate || '—'}</p>
        </div>
        <StatusBadge>{emp.status || 'Active'}</StatusBadge>
      </div>

      <div className="dashboard-grid">
        <section className="panel form-panel">
          <h3>Personal & Work Information</h3>
          <div className="detail-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
            <div><small style={{ color: '#64748b' }}>Work Email</small><p><strong>{emp.email || '—'}</strong></p></div>
            <div><small style={{ color: '#64748b' }}>Phone Number</small><p><strong>{emp.phone || '—'}</strong></p></div>
            <div><small style={{ color: '#64748b' }}>Joining Date</small><p><strong>{emp.joiningDate || '—'}</strong></p></div>
            <div><small style={{ color: '#64748b' }}>Status</small><p><strong>{emp.status || 'Active'}</strong></p></div>
            <div><small style={{ color: '#64748b' }}>Address</small><p><strong>{emp.address || '—'}</strong></p></div>
            <div><small style={{ color: '#64748b' }}>Gender</small><p><strong>{emp.gender || '—'}</strong></p></div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Quick actions</h3>
              <p>Employee management</p>
            </div>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="button button-secondary" onClick={() => navigate('/leave-approvals')}>
              View leave requests
            </button>
            <button className="button button-secondary" onClick={() => navigate('/attendance')}>
              View attendance records
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

// ---------------- ORGANIZATION PROFILE ----------------
function OrganizationView({ notify }) {
  const [data, setData] = useState(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadOrg = useCallback(() => {
    getOrganization()
      .then((res) => {
        setData(res)
        setName(res?.company?.name || '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadOrg() }, [loadOrg])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateOrganization({
        name,
        effectiveDate: new Date().toISOString().slice(0, 10),
        policy: data?.company?.policies?.[0] || {
          timezone: 'Asia/Karachi',
          officeStart: '09:00',
          officeEnd: '18:00',
          graceMinutes: 15,
          halfDayHours: 5,
        },
      })
      notify('Organization settings updated successfully!')
      loadOrg()
    } catch (err) {
      notify(err.message || 'Failed to update organization.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading organization profile...</div>

  const currentPolicy = data?.company?.policies?.[0] || {}

  return (
    <>
      <PageHeading
        eyebrow="COMPANY PROFILE"
        title="Set up your organization"
        description="Configure the details used across your HCM workspace."
      />
      <div className="content-two-col">
        <section className="panel form-panel">
          <h3>Company Information</h3>
          <p className="panel-subtitle">Core organization details</p>
          <form onSubmit={handleSave}>
            <FormField
              label="Company name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="form-grid">
              <FormField label="Timezone" value={currentPolicy.timezone || 'Asia/Karachi'} readOnly />
              <FormField label="Office Start" value={currentPolicy.officeStart || '09:00'} readOnly />
            </div>
            <div className="form-grid">
              <FormField label="Office End" value={currentPolicy.officeEnd || '18:00'} readOnly />
              <FormField label="Grace Minutes" value={currentPolicy.graceMinutes || 15} readOnly />
            </div>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Saving changes...' : 'Save changes'}
            </button>
          </form>
        </section>

        <section className="panel side-info-panel">
          <BriefcaseBusiness size={24} color="#6366f1" />
          <h3>Organization Policy</h3>
          <p>These policy rules govern automated attendance, late marks, and monthly payroll calculations.</p>
          <div style={{ marginTop: '16px' }}>
            <StatusBadge>Configured</StatusBadge>
          </div>
        </section>
      </div>
    </>
  )
}

// ---------------- DEPARTMENTS & DESIGNATIONS ----------------
function DepartmentsView({ notify }) {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [newKind, setNewKind] = useState('department')
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    getOrganization()
      .then((res) => setUnits(res?.units || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createUnit({ kind: newKind, name: newName.trim(), active: true })
      setNewName('')
      notify(`${newKind === 'department' ? 'Department' : 'Designation'} created!`)
      load()
    } catch (err) {
      notify(err.message || 'Failed to create unit.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteUnit(id)
      notify('Unit deleted successfully.')
      load()
    } catch (err) {
      notify(err.message || 'Cannot delete referenced unit.')
    }
  }

  const depts = units.filter((u) => u.kind === 'department')
  const desigs = units.filter((u) => u.kind === 'designation')

  return (
    <>
      <PageHeading
        eyebrow="YOUR ORG CHART"
        title="Departments & designations"
        description="Structure teams and job titles in one place."
      />
      <div className="stats-grid compact-stats">
        <StatCard label="Departments" icon={BriefcaseBusiness} accent="indigo" />
        <StatCard label="Designations" icon={BadgeCheck} accent="teal" />
      </div>

      <div className="panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3>Add department or designation</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <select value={newKind} onChange={(e) => setNewKind(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option value="department">Department</option>
            <option value="designation">Designation</option>
          </select>
          <input
            placeholder={`Enter ${newKind} name...`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
          <button className="button button-primary" type="submit" disabled={creating}>
            <Plus size={15} /> {creating ? 'Adding...' : `Add ${newKind}`}
          </button>
        </form>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Departments ({depts.length})</h3>
              <p>Organizational divisions</p>
            </div>
          </div>
          {depts.length === 0 ? (
            <EmptyState title="No departments yet" description="Add your first department above." />
          ) : (
            <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0 }}>
              {depts.map((d) => (
                <li key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span><strong>{d.name}</strong></span>
                  <button className="icon-button" onClick={() => handleDelete(d._id)} title="Delete"><Trash2 size={16} color="#ef4444" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Designations ({desigs.length})</h3>
              <p>Job titles & roles</p>
            </div>
          </div>
          {desigs.length === 0 ? (
            <EmptyState title="No designations yet" description="Add your first designation above." />
          ) : (
            <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0 }}>
              {desigs.map((d) => (
                <li key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span><strong>{d.name}</strong></span>
                  <button className="icon-button" onClick={() => handleDelete(d._id)} title="Delete"><Trash2 size={16} color="#ef4444" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

// ---------------- ATTENDANCE ----------------
function MyAttendanceView({ notify }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const load = useCallback(() => {
    getAttendance()
      .then((res) => setRecords(res?.items || res || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleCheckIn = async () => {
    setActing(true)
    try {
      await checkIn()
      notify('Checked in successfully!')
      load()
    } catch (err) {
      notify(err.message || 'Check-in failed.')
    } finally {
      setActing(false)
    }
  }

  const handleCheckOut = async () => {
    setActing(true)
    try {
      await checkOut()
      notify('Checked out successfully!')
      load()
    } catch (err) {
      notify(err.message || 'Check-out failed.')
    } finally {
      setActing(false)
    }
  }

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <PageHeading eyebrow="YOUR TIME" title="My attendance" description="Your individual attendance and check-in tools." />
      <div className="attendance-hero panel">
        <div className="attendance-clock">
          <span className="live-dot" /> TODAY — {todayStr}
        </div>
        <p>Record your workday attendance using the buttons below.</p>
        <div className="attendance-actions" style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <button className="button button-primary" onClick={handleCheckIn} disabled={acting}>
            <CalendarCheck size={16} /> Check in
          </button>
          <button className="button button-secondary" onClick={handleCheckOut} disabled={acting}>
            Check out
          </button>
        </div>
      </div>

      <section className="panel" style={{ marginTop: '24px' }}>
        <div className="panel-heading">
          <div>
            <h3>Attendance history</h3>
            <p>Your recent recorded sessions</p>
          </div>
          <button className="icon-button" onClick={load} title="Refresh"><RefreshCw size={16} /></button>
        </div>
        <DataTable
          columns={['Date', 'Check-in', 'Check-out', 'Hours', 'Status']}
          rows={records.map((r) => ({
            Date: r.date || '—',
            'Check-in': r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—',
            'Check-out': r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—',
            Hours: r.hoursWorked ? `${r.hoursWorked} hrs` : '—',
            Status: r.status || 'present',
          }))}
          emptyTitle="No attendance records"
          emptyDescription="Your check-in records will appear here."
        />
      </section>
    </>
  )
}

// ---------------- LEAVES & SMART LEAVE ----------------
function SmartLeave({ notify }) {
  const navigate = useNavigate()
  const [type, setType] = useState('annual')
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10))
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 10))
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await applyLeave({ type, start, end, reason })
      notify('Leave application submitted successfully!')
      navigate('/leave')
    } catch (err) {
      notify(err.message || 'Failed to submit leave request.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAiSuggest = async () => {
    if (!reason.trim()) {
      notify('Please describe your leave reason first to get an AI suggestion.')
      return
    }
    setAiLoading(true)
    try {
      const res = await aiSmartLeave(reason)
      if (res?.type) setType(res.type)
      notify('AI parsed your request!')
    } catch (err) {
      notify(err.message || 'AI assistant unavailable.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <>
      <PageHeading eyebrow="TIME OFF" title="Smart leave request" description="Apply for time off and manage your leave requests." />
      <div className="content-two-col">
        <section className="panel form-panel">
          <h3>Request details</h3>
          <p className="panel-subtitle">Select leave type and dates</p>
          <form onSubmit={handleSubmit}>
            <FormField
              label="Leave type"
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'annual', label: 'Annual Leave' },
                { value: 'sick', label: 'Sick Leave' },
                { value: 'casual', label: 'Casual Leave' },
                { value: 'unpaid', label: 'Unpaid Leave' },
              ]}
              required
            />
            <div className="form-grid">
              <FormField
                label="Start date"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
              <FormField
                label="End date"
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </div>
            <FormField
              label="Reason"
              as="textarea"
              rows={4}
              placeholder="State the reason for taking time away..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <div className="form-actions">
              <button type="button" className="button button-secondary" onClick={() => window.history.back()}>Cancel</button>
              <button type="submit" className="button button-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit request'}
              </button>
            </div>
          </form>
        </section>

        <section className="panel smart-tip">
          <div className="chat-sparkle"><Sparkles size={20} /></div>
          <h3>Need help with leave?</h3>
          <p>Our smart policy assistant can analyze your workplace leave rules and suggest optimal leave types.</p>
          <button className="button button-secondary" style={{ marginTop: '12px' }} onClick={handleAiSuggest} disabled={aiLoading}>
            {aiLoading ? 'Analyzing...' : 'Parse reason with AI'}
          </button>
        </section>
      </div>
    </>
  )
}

function LeaveView({ role, notify, navigate }) {
  const [leaves, setLeaves] = useState([])
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    Promise.all([
      getLeaves().catch(() => ({ items: [] })),
      getLeaveBalance('me').catch(() => null),
    ]).then(([resL, resB]) => {
      setLeaves(resL?.items || resL || [])
      setBalance(resB)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleCancel = async (id) => {
    try {
      await cancelLeave(id)
      notify('Leave request cancelled.')
      load()
    } catch (err) {
      notify(err.message || 'Cannot cancel leave.')
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="TIME OFF"
        title="Leave applications"
        description="Track your requests and available leave balance."
        action="Request leave"
        onAction={() => navigate('/leave/new')}
      />
      {balance && (
        <div className="stats-grid compact-stats" style={{ marginBottom: '24px' }}>
          {Object.entries(balance.balances || {}).map(([t, count]) => (
            <StatCard key={t} label={`${t} balance`} accent="teal" icon={CalendarDays} />
          ))}
        </div>
      )}
      <section className="panel">
        <DataTable
          columns={['Leave type', 'Date range', 'Reason', 'Status', 'Actions']}
          rows={leaves.map((l) => ({
            'Leave type': l.type,
            'Date range': `${l.start} to ${l.end}`,
            Reason: l.reason,
            Status: l.status || 'pending',
            Actions: l.status === 'pending' ? (
              <button className="button button-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleCancel(l._id)}>
                Cancel
              </button>
            ) : '—',
          }))}
          emptyTitle="No leave applications"
          emptyDescription="You have not submitted any leave requests yet."
        />
      </section>
    </>
  )
}

function LeaveApprovalsView({ notify }) {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    getLeaves({ state: 'pending' })
      .then((res) => setLeaves(res?.items || res || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleDecide = async (id, decision) => {
    try {
      await decideLeave(id, { decision, comment: `Decision: ${decision}` })
      notify(`Leave marked as ${decision}!`)
      load()
    } catch (err) {
      notify(err.message || 'Failed to update leave.')
    }
  }

  return (
    <>
      <PageHeading eyebrow="HR INBOX" title="Leave approval inbox" description="Review leave requests from your team." />
      <section className="panel">
        <DataTable
          columns={['Employee', 'Leave type', 'Date range', 'Reason', 'Actions']}
          rows={leaves.map((l) => ({
            Employee: l.employeeId || 'Employee',
            'Leave type': l.type,
            'Date range': `${l.start} to ${l.end}`,
            Reason: l.reason,
            Actions: (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="button button-primary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleDecide(l._id, 'approved')}>
                  Approve
                </button>
                <button className="button button-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => handleDecide(l._id, 'rejected')}>
                  Reject
                </button>
              </div>
            ),
          }))}
          emptyTitle="No pending leave requests"
          emptyDescription="There are no pending requests to review."
        />
      </section>
    </>
  )
}

// ---------------- PAYROLL & PAYSLIPS ----------------
function PayrollView({ role, notify }) {
  const [runs, setRuns] = useState([])
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    getPayrolls()
      .then((res) => setRuns(Array.isArray(res) ? res : res?.items || []))
      .catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await createPayroll(month)
      notify(`Payroll draft created for ${month}!`)
      load()
    } catch (err) {
      notify(err.message || 'Failed to generate payroll.')
    } finally {
      setCreating(false)
    }
  }

  const handleFinalize = async (id) => {
    try {
      await finalizePayroll(id)
      notify('Payroll finalized and locked!')
      load()
    } catch (err) {
      notify(err.message || 'Cannot finalize payroll.')
    }
  }

  return (
    <>
      <PageHeading eyebrow="PAY & BENEFITS" title="Payroll processing" description="Prepare, review, and finalize payroll runs." />
      <div className="panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3>Create or Recalculate Monthly Payroll Draft</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 500 }}>Month (YYYY-MM):</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            required
          />
          <button className="button button-primary" type="submit" disabled={creating}>
            <CircleDollarSign size={15} /> {creating ? 'Processing...' : 'Run Payroll Draft'}
          </button>
        </form>
      </div>

      <section className="panel">
        <DataTable
          columns={['Month', 'Employees', 'Total Gross', 'Total Net', 'Status', 'Actions']}
          rows={runs.map((r) => ({
            Month: r.month,
            Employees: r.employeesCount || r.items?.length || 0,
            'Total Gross': r.totalGross ? `PKR ${r.totalGross}` : '—',
            'Total Net': r.totalNet ? `PKR ${r.totalNet}` : '—',
            Status: r.status || 'draft',
            Actions: role === 'Admin' && r.status !== 'finalized' ? (
              <button className="button button-primary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleFinalize(r._id)}>
                Finalize Run
              </button>
            ) : 'Locked',
          }))}
          emptyTitle="No payroll runs yet"
          emptyDescription="Create a draft payroll run above."
        />
      </section>
    </>
  )
}

function PayslipsView() {
  const [slips, setSlips] = useState([])

  useEffect(() => {
    getPayslips()
      .then((res) => setSlips(Array.isArray(res) ? res : res?.items || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHeading eyebrow="YOUR PAY" title="Payslips" description="Access your monthly salary statements." />
      <section className="panel">
        <DataTable
          columns={['Month', 'Gross Pay', 'Net Pay', 'Deductions', 'Status']}
          rows={slips.map((s) => ({
            Month: s.month,
            'Gross Pay': s.grossPay ? `PKR ${s.grossPay}` : '—',
            'Net Pay': s.netPay ? `PKR ${s.netPay}` : '—',
            Deductions: s.deductions ? `PKR ${s.deductions}` : '0',
            Status: s.status || 'Processed',
          }))}
          emptyTitle="No payslips yet"
          emptyDescription="Payslips will appear once monthly payroll is finalized."
        />
      </section>
    </>
  )
}

// ---------------- AI ASSISTANT ----------------
function AiAssistantView() {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! I am your HCM Lite Policy Assistant. You can ask me questions about company policies, leave entitlements, office hours, and workplace guidelines.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userText = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { sender: 'user', text: userText }])
    setLoading(true)

    try {
      const res = await aiChat(userText)
      const reply = res?.message || res?.content || (typeof res === 'string' ? res : 'I could not retrieve an answer.')
      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }])
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'assistant', text: `Error: ${err.message || 'Unable to connect to AI assistant.'}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeading eyebrow="HCM LITE AI" title="Your policy assistant" description="Ask questions about company leave, attendance, and benefits." />
      <section className="panel chat-panel" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['What is the leave policy?', 'How many sick leave days are allowed?', 'What are the official working hours?'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="select-button"
                onClick={() => { setInput(suggestion) }}
                style={{ fontSize: '12px' }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: m.sender === 'user' ? '#6366f1' : '#f1f5f9',
                color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                lineHeight: 1.5,
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: '#6366f1', fontStyle: 'italic', padding: '8px' }}>
              Assistant is thinking...
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-compose" style={{ display: 'flex', padding: '16px', gap: '12px', borderTop: '1px solid #e2e8f0' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about workplace rules..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
          <button className="button button-primary" type="submit" disabled={!input.trim() || loading}>
            <Send size={15} /> Send
          </button>
        </form>
      </section>
    </>
  )
}

// ---------------- ANNOUNCEMENTS ----------------
function AnnouncementsView({ role, notify }) {
  const [items, setItems] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(() => {
    getAnnouncements()
      .then((res) => setItems(res?.items || res || []))
      .catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  const handlePost = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createAnnouncement({ title, body })
      notify('Announcement posted successfully!')
      setTitle('')
      setBody('')
      setShowAdd(false)
      load()
    } catch (err) {
      notify(err.message || 'Failed to post announcement.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="STAY IN THE LOOP"
        title="Announcements"
        description="Company updates and important messages."
        action={role !== 'Employee' ? (showAdd ? 'Close form' : 'New announcement') : undefined}
        onAction={() => setShowAdd(!showAdd)}
      />

      {showAdd && (
        <section className="panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>Create Company Announcement</h3>
          <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <input
              placeholder="Announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
            <textarea
              placeholder="Announcement message..."
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
            <button className="button button-primary" type="submit" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
              {submitting ? 'Publishing...' : 'Publish announcement'}
            </button>
          </form>
        </section>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.length === 0 ? (
          <EmptyState title="No announcements yet" description="When company updates are posted, they will appear here." />
        ) : (
          items.map((item) => (
            <div key={item._id} className="panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                <small style={{ color: '#64748b' }}>{new Date(item.createdAt).toLocaleDateString()}</small>
              </div>
              <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}

// ---------------- NOTIFICATIONS ----------------
function NotificationsView({ notify }) {
  const [items, setItems] = useState([])

  const load = useCallback(() => {
    getNotifications()
      .then((res) => setItems(res?.items || res || []))
      .catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id)
      load()
    } catch {}
  }

  return (
    <>
      <PageHeading eyebrow="YOUR INBOX" title="Notifications" description="Updates and notices that need your attention." />
      <section className="panel">
        <DataTable
          columns={['Title', 'Date', 'Status']}
          rows={items.map((n) => ({
            Title: n.title,
            Date: new Date(n.createdAt).toLocaleDateString(),
            Status: n.readAt ? 'Read' : (
              <button className="button button-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleRead(n._id)}>
                Mark read
              </button>
            ),
          }))}
          emptyTitle="You're all caught up"
          emptyDescription="No unread notifications at this time."
        />
      </section>
    </>
  )
}

// ---------------- AUDIT LOGS ----------------
function AuditLogsView() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    getAuditLogs()
      .then((res) => setLogs(res?.items || res || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <PageHeading eyebrow="ADMINISTRATION" title="Audit logs" description="An immutable record of important workspace events." />
      <section className="panel">
        <DataTable
          columns={['Action', 'Entity', 'Entity ID', 'Date & Time']}
          rows={logs.map((l) => ({
            Action: l.action,
            Entity: l.entity,
            'Entity ID': l.entityId || '—',
            'Date & Time': new Date(l.createdAt).toLocaleString(),
          }))}
          emptyTitle="No audit logs recorded yet"
          emptyDescription="Administrative actions will be recorded here."
        />
      </section>
    </>
  )
}

// ---------------- SETTINGS ----------------
function SettingsView({ navigate }) {
  const { user, role, logout } = useApp()

  return (
    <>
      <PageHeading eyebrow="YOUR ACCOUNT" title="Profile settings" description="Manage your personal details and account preferences." />
      <div className="content-two-col">
        <section className="panel form-panel">
          <h3>Account Information</h3>
          <p className="panel-subtitle">Your user account metadata</p>
          <div className="form-grid">
            <FormField label="Email" value={user?.email || '—'} readOnly />
            <FormField label="Role" value={role || '—'} readOnly />
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button className="button button-secondary" onClick={() => navigate('/change-password')}>
              Change password
            </button>
            <button className="button button-primary" onClick={logout} style={{ background: '#dc2626' }}>
              Sign out
            </button>
          </div>
        </section>

        <section className="panel side-info-panel">
          <div className="avatar avatar-large avatar-indigo">{(user?.email?.[0] || role?.[0] || 'U').toUpperCase()}</div>
          <h3>{user?.email || `${role} account`}</h3>
          <p>Role: {role}</p>
          <StatusBadge>Active</StatusBadge>
        </section>
      </div>
    </>
  )
}

// ---------------- EMPLOYEE DIRECTORY ----------------
function EmployeesDirectory({ notify, navigate }) {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    getEmployees({ search })
      .then((res) => setEmployees(res?.items || res || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])

  return (
    <>
      <PageHeading
        eyebrow="PEOPLE DIRECTORY"
        title="Employee directory"
        description="Manage your people and their work details."
        action="Add employee"
        onAction={() => navigate('/employees/new')}
      />
      <section className="panel">
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
          <label className="search-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px' }}>
            <Search size={16} />
            <input
              placeholder="Search employees by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none' }}
            />
          </label>
        </div>
        <DataTable
          columns={['Code', 'Name', 'Email', 'Joining date', 'Status', 'Actions']}
          rows={employees.map((e) => ({
            Code: e.code || '—',
            Name: e.name || '—',
            Email: e.email || '—',
            'Joining date': e.joiningDate || '—',
            Status: e.status || 'Active',
            Actions: (
              <button
                className="button button-secondary"
                style={{ padding: '4px 8px', fontSize: '12px' }}
                onClick={() => navigate(`/employees/${e._id}`)}
              >
                View 360
              </button>
            ),
          }))}
          emptyTitle="No employees found"
          emptyDescription="Add your first team member using the 'Add employee' button above."
        />
      </section>
    </>
  )
}

// ---------------- MAIN WORKSPACE DISPATCHER ----------------
export default function WorkspacePage({ title }) {
  const location = window.location.pathname
  const slug = location.split('/')[1] || 'dashboard'
  const { role, notify } = useApp()
  const navigate = useNavigate()
  const params = useParams()

  if (slug === 'dashboard') return <Dashboard role={role} navigate={navigate} />
  if (slug === 'employees') {
    if (location.endsWith('/new')) return <EmployeeForm title="Add employee" notify={notify} />
    if (params.employeeId) return <EmployeeProfile notify={notify} navigate={navigate} />
    return <EmployeesDirectory notify={notify} navigate={navigate} />
  }
  if (slug === 'organization') return <OrganizationView notify={notify} />
  if (slug === 'departments') return <DepartmentsView notify={notify} />
  if (slug === 'my-attendance') return <MyAttendanceView notify={notify} />
  if (slug === 'attendance') return <MyAttendanceView notify={notify} />
  if (slug === 'leave') {
    if (location.endsWith('/new')) return <SmartLeave notify={notify} />
    return <LeaveView role={role} notify={notify} navigate={navigate} />
  }
  if (slug === 'leave-approvals') return <LeaveApprovalsView notify={notify} />
  if (slug === 'payroll') return <PayrollView role={role} notify={notify} />
  if (slug === 'payslips') return <PayslipsView />
  if (slug === 'salary-structure') return <OrganizationView notify={notify} />
  if (slug === 'ai-assistant') return <AiAssistantView />
  if (slug === 'announcements') return <AnnouncementsView role={role} notify={notify} />
  if (slug === 'notifications') return <NotificationsView notify={notify} />
  if (slug === 'audit-logs') return <AuditLogsView />
  if (slug === 'settings') return <SettingsView navigate={navigate} />

  return <EmptyState title={title} description="This workspace section is active." />
}
