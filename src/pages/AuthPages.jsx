import { useEffect, useState } from 'react'
import { ArrowRight, Activity, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import useApp from '../hooks/useApp'
import { getSetupStatus, loginUser, setupCompany, changePassword as apiChangePassword } from '../services/api'

export function AuthPage({ passwordMode = false }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [previewRole, setPreviewRole] = useState('Admin')
  const [isPreview, setIsPreview] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [initRequired, setInitRequired] = useState(false)

  const { login, setRole: setGlobalRole, notify } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!passwordMode) {
      getSetupStatus()
        .then((data) => {
          if (data?.initializationRequired) {
            setInitRequired(true)
          }
        })
        .catch(() => {
          // Backend offline or unreachable yet
        })
    }
  }, [passwordMode])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsError(false)

    if (passwordMode) {
      if (newPassword.length < 12) {
        setIsError(true)
        setMessage('New password must be at least 12 characters long.')
        return
      }
      setSubmitting(true)
      try {
        await apiChangePassword({ currentPassword, newPassword })
        notify('Password updated successfully. Please sign in with your new password.')
        navigate('/login')
      } catch (err) {
        setIsError(true)
        setMessage(err.message || 'Failed to update password.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    if (isPreview) {
      setGlobalRole(previewRole)
      notify(`Preview mode active (${previewRole}).`)
      navigate('/dashboard')
      return
    }

    setSubmitting(true)
    try {
      const data = await loginUser({ email, password })
      login(data.token, data.user)
      notify(`Welcome back, ${data.user.email}!`)
      if (data.user.mustChangePassword) {
        navigate('/change-password')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setIsError(true)
      setMessage(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Link className="auth-brand" to="/login">
          <span className="brand-mark"><Activity size={20} /></span>
          <strong>hcm<span>lite</span></strong>
        </Link>
        <div className="auth-pitch">
          <span className="eyebrow"><Sparkles size={14} /> PEOPLE OPERATIONS, REIMAGINED</span>
          <h1>Make room for the <span>human</span> in human resources.</h1>
          <p>A thoughtful workspace for the people who make your organization thrive.</p>
          <div className="auth-quote">
            <div className="quote-lines"><i /><i /><i /></div>
            <p>One clear view of your people operations. Built to grow with you.</p>
            <div className="quote-bottom">
              <span className="quote-avatar">H</span>
              <span><strong>HCM Lite</strong><small>Your people, in good hands</small></span>
            </div>
          </div>
        </div>
        <div className="auth-aside-foot"><ShieldCheck size={15} /> Designed with people-first privacy in mind</div>
      </aside>

      <main className="auth-main">
        <div className="auth-mobile-brand">
          <span className="brand-mark"><Activity size={19} /></span>
          <strong>hcm<span>lite</span></strong>
        </div>

        <div className="auth-card">
          <div className="auth-kicker">WELCOME TO HCM LITE</div>
          <h2>{passwordMode ? 'Change your password' : 'Welcome back'}</h2>
          <p className="auth-subtitle">
            {passwordMode
              ? 'Enter your current password and choose a secure new password.'
              : 'Sign in to your connected HCM Lite workspace to continue.'}
          </p>

          {initRequired && !passwordMode && (
            <div className="inline-notice" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
              <Sparkles size={15} />
              <span>Workspace needs initial setup. <Link to="/setup" style={{ fontWeight: 600, textDecoration: 'underline' }}>Set up now</Link></span>
            </div>
          )}

          {message && (
            <div className={`inline-notice ${isError ? 'error-notice' : ''}`} style={isError ? { background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' } : {}}>
              {isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!passwordMode && !isPreview && (
              <>
                <FormField
                  label="Work email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FormField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}

            {passwordMode && (
              <>
                <FormField
                  label="Current password"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <FormField
                  label="New password"
                  type="password"
                  placeholder="At least 12 characters"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={12}
                />
              </>
            )}

            {!passwordMode && isPreview && (
              <FormField
                label="Preview role"
                as="select"
                value={previewRole}
                onChange={(event) => setPreviewRole(event.target.value)}
                options={['Admin', 'HR', 'Employee'].map((val) => ({ value: val, label: val }))}
              />
            )}

            <button className="button button-primary button-full" type="submit" disabled={submitting}>
              {submitting
                ? 'Processing...'
                : passwordMode
                ? 'Update password'
                : isPreview
                ? `Continue as ${previewRole}`
                : 'Sign in'}
              <ArrowRight size={16} />
            </button>
          </form>

          {!passwordMode && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <button
                type="button"
                className="text-link"
                style={{ fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? '← Switch to real account login' : 'Or explore in preview / demo mode'}
              </button>
            </div>
          )}

          <div className="auth-bottom-links">
            {passwordMode ? (
              <Link to="/dashboard">Back to workspace</Link>
            ) : (
              <>
                <Link to="/setup">Set up a new organization</Link>
                <span>·</span>
                <Link to="/change-password">Change password</Link>
              </>
            )}
          </div>
          <div className="auth-disclaimer">
            Secure, role-based access to your team workspace.
          </div>
        </div>
        <div className="auth-copyright">© 2025 HCM Lite <span>·</span> Thoughtful people operations</div>
      </main>
    </div>
  )
}

export function SetupPage() {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [alreadyInitialized, setAlreadyInitialized] = useState(false)

  const { login, notify } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    getSetupStatus()
      .then((data) => {
        if (!data?.initializationRequired) {
          setAlreadyInitialized(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleSetup = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsError(false)

    if (password.length < 12) {
      setIsError(true)
      setMessage('Password must be at least 12 characters long.')
      return
    }

    setSubmitting(true)
    try {
      const data = await setupCompany({
        companyName,
        email,
        password,
      })
      notify(`Workspace created for ${data.companyName || companyName}! Signing in...`)
      // Log the admin in automatically
      const loginData = await loginUser({ email, password })
      login(loginData.token, loginData.user)
      navigate('/dashboard')
    } catch (err) {
      setIsError(true)
      setMessage(err.message || 'Setup failed. Please check values and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Link className="auth-brand" to="/login">
          <span className="brand-mark"><Activity size={20} /></span>
          <strong>hcm<span>lite</span></strong>
        </Link>
        <div className="auth-pitch">
          <span className="eyebrow"><Sparkles size={14} /> YOUR PEOPLE, ONE PLACE</span>
          <h1>Start with a strong <span>foundation.</span></h1>
          <p>Set up the basics for a more connected, considered people experience.</p>
        </div>
        <div className="auth-aside-foot"><ShieldCheck size={15} /> First-time organization initialization</div>
      </aside>

      <main className="auth-main">
        <div className="auth-mobile-brand">
          <span className="brand-mark"><Activity size={19} /></span>
          <strong>hcm<span>lite</span></strong>
        </div>

        <div className="auth-card setup-card">
          <div className="auth-kicker">GET STARTED</div>
          <h2>Create your workspace</h2>
          <p className="auth-subtitle">Add your company and initial Admin credentials to launch HCM Lite.</p>

          <div className="setup-steps">
            <span className="step-active">1 <small>Company</small></span>
            <i />
            <span className="step-active">2 <small>Admin</small></span>
            <i />
            <span className="step-active">3 <small>Launch</small></span>
          </div>

          {alreadyInitialized && (
            <div className="inline-notice" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
              <Sparkles size={15} />
              <span>This workspace is already initialized. <Link to="/login" style={{ fontWeight: 600, textDecoration: 'underline' }}>Sign in here</Link></span>
            </div>
          )}

          {message && (
            <div className={`inline-notice ${isError ? 'error-notice' : ''}`} style={isError ? { background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' } : {}}>
              {isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{message}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSetup}>
            <FormField
              label="Company name"
              placeholder="e.g. Acme Studio"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <FormField
              label="Admin work email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              label="Admin password"
              type="password"
              placeholder="At least 12 characters"
              minLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="button button-primary button-full" type="submit" disabled={submitting || alreadyInitialized}>
              {submitting ? 'Setting up workspace...' : 'Complete setup & launch'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-bottom-links">
            <Link to="/login">Already have a workspace? Sign in</Link>
          </div>
        </div>
        <div className="auth-copyright">© 2025 HCM Lite <span>·</span> Connected system</div>
      </main>
    </div>
  )
}
