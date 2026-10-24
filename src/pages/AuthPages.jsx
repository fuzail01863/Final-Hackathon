import { useState } from 'react'
import { ArrowRight, Activity, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import useApp from '../hooks/useApp'
import { backendPending } from '../services/api'

export function AuthPage({ passwordMode = false }) {
  const [role, setRole] = useState('Admin')
  const [message, setMessage] = useState('')
  const { setRole: setPreviewRole, notify } = useApp()
  const navigate = useNavigate()

  const handleContinue = (event) => {
    event.preventDefault()
    if (passwordMode) {
      setMessage(backendPending())
      return
    }
    setPreviewRole(role)
    notify('Preview mode only — no login was performed. Backend integration pending.')
    navigate('/dashboard')
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Link className="auth-brand" to="/login"><span className="brand-mark"><Activity size={20} /></span><strong>hcm<span>lite</span></strong></Link>
        <div className="auth-pitch"><span className="eyebrow"><Sparkles size={14} /> PEOPLE OPERATIONS, REIMAGINED</span><h1>Make room for the <span>human</span> in human resources.</h1><p>A thoughtful workspace for the people who make your organization thrive.</p>
          <div className="auth-quote"><div className="quote-lines"><i /><i /><i /></div><p>One clear view of your people operations. Built to grow with you.</p><div className="quote-bottom"><span className="quote-avatar">H</span><span><strong>HCM Lite</strong><small>Your people, in good hands</small></span></div></div>
        </div>
        <div className="auth-aside-foot"><ShieldCheck size={15} /> Designed with people-first privacy in mind</div>
      </aside>
      <main className="auth-main">
        <div className="auth-mobile-brand"><span className="brand-mark"><Activity size={19} /></span><strong>hcm<span>lite</span></strong></div>
        <div className="auth-card">
          <div className="auth-kicker">WELCOME TO HCM LITE</div>
          <h2>{passwordMode ? 'Change your password' : 'Welcome back'}</h2>
          <p className="auth-subtitle">{passwordMode ? 'Password updates will be available when your workspace is connected.' : 'Sign in to your workspace to continue.'}</p>
          <div className="preview-note"><Sparkles size={15} /><span><strong>Frontend preview</strong> Choose a role to explore its navigation. No account or backend is connected.</span></div>
          {message && <div className="inline-notice">{message}</div>}
          <form onSubmit={handleContinue} className="auth-form">
            {!passwordMode && <FormField label="Work email" type="email" placeholder="you@company.com" autoComplete="email" required />}
            {passwordMode && <FormField label="Current password" type="password" placeholder="Enter current password" required />}
            <FormField label={passwordMode ? 'New password' : 'Password'} type="password" placeholder="Enter your password" autoComplete={passwordMode ? 'new-password' : 'current-password'} required />
            {!passwordMode && <FormField label="Preview role" as="select" value={role} onChange={(event) => setRole(event.target.value)} options={['Admin', 'HR', 'Employee'].map((value) => ({ value, label: value }))} />}
            <button className="button button-primary button-full" type="submit">{passwordMode ? 'Update password' : 'Continue in preview'}<ArrowRight size={16} /></button>
          </form>
          <div className="auth-bottom-links">{passwordMode ? <Link to="/dashboard">Back to workspace</Link> : <><Link to="/setup">Set up a new organization</Link><span>·</span><Link to="/change-password">Change password</Link></>}</div>
          <div className="auth-disclaimer">By continuing, you acknowledge this is a frontend-only demo. <br />No credentials are verified or stored.</div>
        </div>
        <div className="auth-copyright">© 2025 HCM Lite <span>·</span> Thoughtful people operations</div>
      </main>
    </div>
  )
}

export function SetupPage() {
  const [showMessage, setShowMessage] = useState(false)
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <Link className="auth-brand" to="/login"><span className="brand-mark"><Activity size={20} /></span><strong>hcm<span>lite</span></strong></Link>
        <div className="auth-pitch"><span className="eyebrow"><Sparkles size={14} /> YOUR PEOPLE, ONE PLACE</span><h1>Start with a strong <span>foundation.</span></h1><p>Set up the basics for a more connected, considered people experience.</p></div>
        <div className="auth-aside-foot"><ShieldCheck size={15} /> Setup is a UI preview; nothing is submitted</div>
      </aside>
      <main className="auth-main">
        <div className="auth-mobile-brand"><span className="brand-mark"><Activity size={19} /></span><strong>hcm<span>lite</span></strong></div>
        <div className="auth-card setup-card">
          <div className="auth-kicker">GET STARTED</div><h2>Create your workspace</h2><p className="auth-subtitle">Add your company and admin details to preview the setup flow.</p>
          <div className="setup-steps"><span className="step-active">1 <small>Company</small></span><i /><span>2 <small>Admin</small></span><i /><span>3 <small>Review</small></span></div>
          {showMessage && <div className="inline-notice">{backendPending()}</div>}
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setShowMessage(true) }}>
            <FormField label="Company name" placeholder="e.g. Acme Studio" required />
            <div className="form-grid"><FormField label="Work email" type="email" placeholder="you@company.com" required /><FormField label="Company size" as="select" options={[{ value: '', label: 'Select size' }, { value: '1-10', label: '1–10' }, { value: '11-50', label: '11–50' }, { value: '51-200', label: '51–200' }, { value: '200+', label: '200+' }]} required /></div>
            <div className="form-grid"><FormField label="Admin first name" placeholder="First name" required /><FormField label="Admin last name" placeholder="Last name" required /></div>
            <FormField label="Create password" type="password" placeholder="At least 8 characters" minLength={8} required />
            <button className="button button-primary button-full" type="submit">Continue setup <ArrowRight size={16} /></button>
          </form>
          <div className="auth-bottom-links"><Link to="/login">Already have a workspace? Sign in</Link></div>
        </div>
        <div className="auth-copyright">© 2025 HCM Lite <span>·</span> Frontend preview</div>
      </main>
    </div>
  )
}
