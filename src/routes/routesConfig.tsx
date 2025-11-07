import Dashboard from '@/pages/protected/dashboard'
import Certificates from '@/pages/protected/certificates'
import Customers from '@/pages/protected/customers'
import Devices from '@/pages/protected/devices'
import WeightSets from '@/pages/protected/weight-sets'
import AddWeightSet from '@/pages/protected/weight-sets/AddWeightSet'
import ViewWeightSet from '@/pages/protected/weight-sets/ViewWeightSet'
import EditWeightSet from '@/pages/protected/weight-sets/EditWeightSet'
// JS component import
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - importing .jsx file in TS route config
import CreateCertificate from '@/pages/protected/certificates/CreateCertificate.jsx'

export const publicRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/certificates', element: <Certificates /> },
  { path: '/certificates/create', element: <CreateCertificate /> },
  { path: '/customers', element: <Customers /> },
  { path: '/devices', element: <Devices /> },
  { path: '/weight-sets', element: <WeightSets /> },
  { path: '/weight-sets/add', element: <AddWeightSet /> },
  { path: '/weight-sets/:id', element: <ViewWeightSet /> },
  { path: '/weight-sets/:id/edit', element: <EditWeightSet /> }
]

export const protectedRoutes = []
