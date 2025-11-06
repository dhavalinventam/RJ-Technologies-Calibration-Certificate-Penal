import Dashboard from '@/pages/protected/dashboard'
import Certificates from '@/pages/protected/certificates'
// JS component import
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - importing .jsx file in TS route config
import CreateCertificate from '@/pages/protected/certificates/CreateCertificate.jsx'

export const publicRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/certificates', element: <Certificates /> },
  { path: '/certificates/create', element: <CreateCertificate /> }
]

export const protectedRoutes = []
