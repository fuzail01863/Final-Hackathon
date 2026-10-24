import { CircleAlert } from 'lucide-react'

export default function ErrorState({ message = 'This section is not available yet.' }) {
  return <div className="error-state"><CircleAlert size={18} /><span>{message}</span></div>
}
