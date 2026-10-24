export default function FormField({ label, as: Element = 'input', options, ...props }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {Element === 'select' ? (
        <select {...props}>{options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      ) : <Element {...props} />}
    </label>
  )
}
