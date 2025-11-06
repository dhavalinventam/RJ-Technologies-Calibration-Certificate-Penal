import { Routes, Route, Navigate } from 'react-router-dom'
import { protectedRoutes, publicRoutes } from '@/routes/routesConfig'
import ProtectedRoute from '@/routes/protectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<ProtectedRoute element={element} />} />
      ))}
      <Route path='/' element={<Navigate to='/dashboard' replace />} />
      <Route path='*' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  )
}

export default AppRoutes
