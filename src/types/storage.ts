export interface Settings {
  theme: 'light' | 'dark' | 'system'
  showNotifications: boolean
  defaultSpeed: number
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  showNotifications: true,
  defaultSpeed: 1.0
}