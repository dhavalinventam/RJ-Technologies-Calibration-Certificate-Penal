import type { ReactElement } from 'react'
import ProtectedLayout from '@/layout/ProtectedLayout'
import { useTheme } from '@/context/ThemeContext'

interface ProtectedRouteProps {
  element: ReactElement
}
const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { mode, toggleTheme } = useTheme()
  return (
    <ProtectedLayout onToggleTheme={toggleTheme} mode={mode}>
      {element}
    </ProtectedLayout>
  )
}

export default ProtectedRoute
