const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://backend-hackathon-01.onrender.com/api/v1').replace(/\/+$/, '')

export const apiConfig = Object.freeze({
  baseURL: API_BASE_URL,
  isConfigured: Boolean(API_BASE_URL),
})

function getStoredToken() {
  return localStorage.getItem('hcm_token') || sessionStorage.getItem('hcm_token') || ''
}

export function setStoredToken(token, persist = true) {
  if (token) {
    if (persist) {
      localStorage.setItem('hcm_token', token)
    } else {
      sessionStorage.setItem('hcm_token', token)
    }
  } else {
    localStorage.removeItem('hcm_token')
    sessionStorage.removeItem('hcm_token')
  }
}

export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  const token = getStoredToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  // Handle FormData or non-json if ever needed
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const payload = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const message = (typeof payload === 'object' && payload?.message)
        ? payload.message
        : `Request failed with status ${response.status}`
      const error = new Error(message)
      error.status = response.status
      error.data = payload
      if (typeof payload === 'object' && payload?.errors) {
        error.errors = payload.errors
      }
      if (response.status === 401) {
        setStoredToken('')
      }
      throw error
    }

    return (typeof payload === 'object' && payload !== null && 'data' in payload)
      ? payload.data
      : payload
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to backend server. Make sure backend is running on ' + API_BASE_URL)
    }
    throw error
  }
}

// ----------------- Auth & Setup -----------------
export const getSetupStatus = () => apiRequest('/setup-status')
export const setupCompany = (body) => apiRequest('/setup', { method: 'POST', body: JSON.stringify(body) })
export const loginUser = (body) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) })
export const getMe = () => apiRequest('/auth/me')
export const logoutUser = () => apiRequest('/auth/logout', { method: 'POST', body: JSON.stringify({}) })
export const changePassword = (body) => apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(body) })

// ----------------- Organization -----------------
export const getOrganization = () => apiRequest('/organization')
export const updateOrganization = (body) => apiRequest('/organization', { method: 'PUT', body: JSON.stringify(body) })
export const createUnit = (body) => apiRequest('/organization/units', { method: 'POST', body: JSON.stringify(body) })
export const updateUnit = (id, body) => apiRequest(`/organization/units/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
export const deleteUnit = (id) => apiRequest(`/organization/units/${id}`, { method: 'DELETE' })

// ----------------- Employees -----------------
export const getEmployees = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/employees${query ? `?${query}` : ''}`)
}
export const getEmployee = (id) => apiRequest(`/employees/${id}`)
export const createEmployee = (body) => apiRequest('/employees', { method: 'POST', body: JSON.stringify(body) })
export const updateEmployee = (id, body) => apiRequest(`/employees/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
export const updateEmployeeSalary = (id, body) => apiRequest(`/employees/${id}/salary`, { method: 'PUT', body: JSON.stringify(body) })

// ----------------- Attendance -----------------
export const checkIn = () => apiRequest('/attendance/check-in', { method: 'POST', body: JSON.stringify({}) })
export const checkOut = () => apiRequest('/attendance/check-out', { method: 'POST', body: JSON.stringify({}) })
export const getAttendance = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/attendance${query ? `?${query}` : ''}`)
}
export const requestAttendanceCorrection = (body) => apiRequest('/attendance/corrections', { method: 'POST', body: JSON.stringify(body) })
export const getAttendanceCorrections = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/attendance/corrections${query ? `?${query}` : ''}`)
}
export const decideAttendanceCorrection = (id, body) => apiRequest(`/attendance/corrections/${id}/decision`, { method: 'POST', body: JSON.stringify(body) })

// ----------------- Leaves -----------------
export const applyLeave = (body) => apiRequest('/leaves', { method: 'POST', body: JSON.stringify(body) })
export const getLeaves = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/leaves${query ? `?${query}` : ''}`)
}
export const getLeaveBalance = (id = 'me', year = new Date().getFullYear()) => apiRequest(`/leaves/balances/${id}?year=${year}`)
export const cancelLeave = (id) => apiRequest(`/leaves/${id}/cancel`, { method: 'POST', body: JSON.stringify({}) })
export const decideLeave = (id, body) => apiRequest(`/leaves/${id}/decision`, { method: 'POST', body: JSON.stringify(body) })

// ----------------- Payroll & Payslips -----------------
export const getPayrolls = () => apiRequest('/payroll')
export const createPayroll = (month) => apiRequest('/payroll', { method: 'POST', body: JSON.stringify({ month }) })
export const getPayroll = (id) => apiRequest(`/payroll/${id}`)
export const finalizePayroll = (id) => apiRequest(`/payroll/${id}/finalize`, { method: 'POST', body: JSON.stringify({}) })
export const getPayslips = () => apiRequest('/payslips')
export const getPayslip = (runId, employeeId) => apiRequest(`/payslips/${runId}/${employeeId}`)

// ----------------- Dashboard & Analytics -----------------
export const getDashboard = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/dashboard${query ? `?${query}` : ''}`)
}

// ----------------- Announcements -----------------
export const getAnnouncements = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/announcements${query ? `?${query}` : ''}`)
}
export const createAnnouncement = (body) => apiRequest('/announcements', { method: 'POST', body: JSON.stringify(body) })

// ----------------- Notifications -----------------
export const getNotifications = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/notifications${query ? `?${query}` : ''}`)
}
export const markNotificationRead = (id) => apiRequest(`/notifications/${id}/read`, { method: 'POST', body: JSON.stringify({}) })

// ----------------- Audit Logs -----------------
export const getAuditLogs = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest(`/audit-logs${query ? `?${query}` : ''}`)
}

// ----------------- AI Assistant -----------------
export const aiChat = (message) => apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) })
export const aiSmartLeave = (message) => apiRequest('/ai/smart-leave', { method: 'POST', body: JSON.stringify({ message }) })
export const aiSummary = (filters = {}) => apiRequest('/ai/summary', { method: 'POST', body: JSON.stringify({ filters }) })

export function backendPending() {
  return 'Operation pending or not supported.'
}
