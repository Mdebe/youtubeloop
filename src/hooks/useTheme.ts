import { useEffect } from 'react'
import { useStorage } from './useStorage'

export function useTheme() {
  const { settings } = useStorage()
  
  useEffect(() => {
    const root = document.documentElement
    const isDark = 
      settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    root.classList.toggle('dark', isDark)
  }, [settings.theme])

  return { theme: settings.theme }
}