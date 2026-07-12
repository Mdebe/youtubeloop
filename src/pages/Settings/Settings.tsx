import { useStorage } from '../../hooks/useStorage'
import { Card } from '../../components/Card/Card'
import { Switch } from '../../components/Switch/Switch'

export default function Settings() {
  const { settings, updateSettings } = useStorage()

  return (
    <div className="page">
      <h2>Settings</h2>
      <Card>
        <Switch
          label="Show notifications"
          checked={settings.showNotifications}
          onChange={(v) => updateSettings({ showNotifications: v })}
        />
      </Card>
      <Card>
        <label>
          Theme
          <select 
            value={settings.theme} 
            onChange={(e) => updateSettings({ theme: e.target.value as any })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </label>
      </Card>
    </div>
  )
}