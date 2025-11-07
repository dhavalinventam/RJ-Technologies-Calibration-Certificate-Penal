import Dashboard from '@/pages/protected/dashboard'
import Certificates from '@/pages/protected/certificates'
import Customers from '@/pages/protected/customers'
// JS component import
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - importing .jsx file in TS route config
import CreateCertificate from '@/pages/protected/certificates/CreateCertificate.jsx'

export const publicRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/certificates', element: <Certificates /> },
  { path: '/certificates/create', element: <CreateCertificate /> },
  { path: '/customers', element: <Customers /> }
]

export const protectedRoutes = []
