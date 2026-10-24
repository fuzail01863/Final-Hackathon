import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', description = 'When data is available, it will appear here.', action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Inbox size={21} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}
