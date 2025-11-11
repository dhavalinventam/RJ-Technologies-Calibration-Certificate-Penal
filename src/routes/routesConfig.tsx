import Dashboard from '@/pages/protected/dashboard'
import Certificates from '@/pages/protected/certificates'
import Customers from '@/pages/protected/customers'
import ViewCustomer from '@/pages/protected/customers/ViewCustomer'
import EditCustomer from '@/pages/protected/customers/EditCustomer'
import Devices from '@/pages/protected/devices'
import ViewDevice from '@/pages/protected/devices/ViewDevice'
import WeightSets from '@/pages/protected/weight-sets'
import AddWeightSet from '@/pages/protected/weight-sets/AddWeightSet'
import ViewWeightSet from '@/pages/protected/weight-sets/ViewWeightSet'
import EditWeightSet from '@/pages/protected/weight-sets/EditWeightSet'
import ProcedureTemplates from '@/pages/protected/procedure-templates'
import AddTemplate from '@/pages/protected/procedure-templates/AddTemplate'
import ViewTemplate from '@/pages/protected/procedure-templates/ViewTemplate'
import EditTemplate from '@/pages/protected/procedure-templates/EditTemplate'
import UserManagement from '@/pages/protected/user-management'
import AddUser from '@/pages/protected/user-management/AddUser'
import ViewUser from '@/pages/protected/user-management/ViewUser'
import EditUser from '@/pages/protected/user-management/EditUser'
// JS component import
// @ts-expect-error - importing .jsx file in TS route config
import CreateCertificate from '@/pages/protected/certificates/CreateCertificate.jsx'

export const publicRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/certificates', element: <Certificates /> },
  { path: '/certificates/create', element: <CreateCertificate /> },
  { path: '/customers', element: <Customers /> },
  { path: '/customers/:id', element: <ViewCustomer /> },
  { path: '/customers/:id/edit', element: <EditCustomer /> },
  { path: '/devices', element: <Devices /> },
  { path: '/devices/:id', element: <ViewDevice /> },
  { path: '/weight-sets', element: <WeightSets /> },
  { path: '/weight-sets/add', element: <AddWeightSet /> },
  { path: '/weight-sets/:id', element: <ViewWeightSet /> },
  { path: '/weight-sets/:id/edit', element: <EditWeightSet /> },
  { path: '/procedure-templates', element: <ProcedureTemplates /> },
  { path: '/procedure-templates/add', element: <AddTemplate /> },
  { path: '/procedure-templates/:id', element: <ViewTemplate /> },
  { path: '/procedure-templates/:id/edit', element: <EditTemplate /> },
  { path: '/user-management', element: <UserManagement /> },
  { path: '/user-management/add', element: <AddUser /> },
  { path: '/user-management/:id', element: <ViewUser /> },
  { path: '/user-management/:id/edit', element: <EditUser /> }
]

export const protectedRoutes = []
