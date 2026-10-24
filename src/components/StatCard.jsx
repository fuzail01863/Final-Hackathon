import { ArrowUpRight } from 'lucide-react'

export default function StatCard({ label, value = '—', description = 'Connect your backend to view live data', icon: Icon, accent = 'blue' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon accent-${accent}`}><Icon size={19} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">{description}<ArrowUpRight size={14} /></div>
    </article>
  )
}
