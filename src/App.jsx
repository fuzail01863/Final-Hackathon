import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import { AuthPage, SetupPage } from './pages/AuthPages'
import WorkspacePage from './pages/WorkspacePage'

const workspaceRoutes = [
  { path: 'dashboard', title: 'Dashboard', roles: ['Admin', 'HR', 'Employee'] },
  { path: 'organization', title: 'Organization setup', roles: ['Admin'] },
  { path: 'departments', title: 'Departments & designations', roles: ['Admin', 'HR'] },
  { path: 'employees', title: 'Employee directory', roles: ['Admin', 'HR'] },
  { path: 'employees/new', title: 'Add employee', roles: ['Admin', 'HR'] },
  { path: 'employees/:employeeId/edit', title: 'Edit employee', roles: ['Admin', 'HR'] },
  { path: 'employees/:employeeId', title: 'Employee 360', roles: ['Admin', 'HR'] },
  { path: 'attendance', title: 'Attendance management', roles: ['Admin', 'HR'] },
  { path: 'my-attendance', title: 'My attendance', roles: ['Employee'] },
  { path: 'leave', title: 'Leave applications', roles: ['Employee'] },
  { path: 'leave/new', title: 'Smart leave request', roles: ['Employee'] },
  { path: 'leave-approvals', title: 'Leave approval inbox', roles: ['Admin', 'HR'] },
  { path: 'salary-structure', title: 'Salary structure', roles: ['Admin', 'HR'] },
  { path: 'payroll', title: 'Payroll processing', roles: ['Admin', 'HR'] },
  { path: 'payslips', title: 'Payslips', roles: ['Employee'] },
  { path: 'payslips/:payslipId', title: 'Payslip view', roles: ['Employee'] },
  { path: 'analytics', title: 'Dashboards & analytics', roles: ['Admin', 'HR'] },
  { path: 'ai-assistant', title: 'AI policy assistant', roles: ['Employee'] },
  { path: 'announcements', title: 'Announcements', roles: ['Admin', 'HR', 'Employee'] },
  { path: 'notifications', title: 'Notifications', roles: ['Admin', 'HR', 'Employee'] },
  { path: 'audit-logs', title: 'Audit logs', roles: ['Admin'] },
  { path: 'settings', title: 'Profile settings', roles: ['Admin', 'HR', 'Employee'] },
]

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/change-password" element={<AuthPage passwordMode />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {workspaceRoutes.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={
                  <ProtectedRoute allowedRoles={page.roles}>
                    <WorkspacePage title={page.title} />
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppProvider>
  )
}

export default App
