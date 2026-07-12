import { ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { useTheme } from '../hooks/useTheme'

function ThemeWrapper({ children }: { children: ReactNode }) {
  useTheme()
  return <>{children}</>
}

export function Providers() {
  return (
    <ThemeWrapper>
      <RouterProvider router={router} />
    </ThemeWrapper>
  )
}