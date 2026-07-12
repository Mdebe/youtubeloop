import { Settings, DEFAULT_SETTINGS } from '../types/storage'
import { Logger } from '../utils/logger'

const logger = new Logger('ChromeStorage')

export async function getSettings(): Promise<Settings> {
  try {
    const result = await chrome.storage.sync.get('settings')
    return { ...DEFAULT_SETTINGS, ...result.settings }
  } catch (e) {
    logger.error('Failed to get settings', e)
    return DEFAULT_SETTINGS
  }
}

export async function setSettings(settings: Partial<Settings>): Promise<void> {
  try {
    const current = await getSettings()
    await chrome.storage.sync.set({ settings: { ...current, ...settings } })
    logger.info('Settings saved', settings)
  } catch (e) {
    logger.error('Failed to save settings', e)
  }
}