import { clsx } from 'clsx'
import './Switch.css'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="switch-wrapper">
      {label && <span className="switch-label">{label}</span>}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx('switch', checked && 'switch-checked')}
      >
        <span className="switch-thumb" />
      </button>
    </label>
  )
}