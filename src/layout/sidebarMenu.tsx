import {
  DashboardOutlined,
  PeopleOutlined,
  DevicesOutlined,
  ScaleOutlined,
  DescriptionOutlined,
  VerifiedOutlined,
  ManageAccountsOutlined,
  SettingsOutlined,
  ArticleOutlined
} from '@mui/icons-material'

export const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardOutlined />,
    path: '/dashboard',
    hasArrow: false
  },
  {
    text: 'Customers',
    icon: <PeopleOutlined />,
    path: '/customers',
    hasArrow: false
  },
  {
    text: 'Devices',
    icon: <DevicesOutlined />,
    path: '/devices',
    hasArrow: false
  },
  {
    text: 'Weight Sets',
    icon: <ScaleOutlined />,
    path: '/weight-sets',
    hasArrow: false
  },
  {
    text: 'Procedure Templates',
    icon: <DescriptionOutlined />,
    path: '/procedure-templates',
    hasArrow: false
  },
  {
    text: 'Certificates',
    icon: <VerifiedOutlined />,
    path: '/certificates',
    hasArrow: false
  },
  {
    text: 'Certificate New',
    icon: <ArticleOutlined />,
    path: '/certificate-new',
    hasArrow: false
  },
  {
    text: 'User Management',
    icon: <ManageAccountsOutlined />,
    path: '/user-management',
    hasArrow: false
  },
  {
    text: 'Settings',
    icon: <SettingsOutlined />,
    path: '/settings',
    hasArrow: false
  }
]
