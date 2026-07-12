import { useEffect, useState } from 'react'
import { getSettings, setSettings } from '../storage/chromeStorage'
import { Settings, DEFAULT_SETTINGS } from '../types/storage'

export function useStorage() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(s => {
      setSettingsState(s)
      setLoading(false)
    })
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings }
    setSettingsState(updated)
    await setSettings(newSettings)
  }

  return { settings, updateSettings, loading }
}