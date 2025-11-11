import React, { useCallback, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

interface UserRecord {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

const STORAGE_KEY = 'userManagementUsers'

const defaultUsers: UserRecord[] = [
  {
    id: '1',
    name: 'Dhaval Solanki',
    email: 'dhaval.solanki@example.com',
    role: 'Administrator',
    status: 'Active',
    createdAt: '12/02/2025'
  },
  {
    id: '2',
    name: 'Priya Shah',
    email: 'priya.shah@example.com',
    role: 'Manager',
    status: 'Active',
    createdAt: '18/03/2025'
  },
  {
    id: '3',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@example.com',
    role: 'Technician',
    status: 'Inactive',
    createdAt: '25/03/2025'
  },
  {
    id: '4',
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    role: 'Quality Analyst',
    status: 'Active',
    createdAt: '02/04/2025'
  },
  {
    id: '5',
    name: 'Amit Desai',
    email: 'amit.desai@example.com',
    role: 'Support',
    status: 'Active',
    createdAt: '12/04/2025'
  }
]

const PRIMARY_COLOR = '#2563EB'
const PAGE_BACKGROUND = '#F8FAFC'
const TITLE_COLOR = '#111827'
const SUBTEXT_COLOR = '#6B7280'
const TABLE_TEXT_COLOR = '#1F2937'
const CARD_RADIUS = '12px'
const CARD_BORDER = '1px solid rgba(148, 163, 184, 0.25)'
const CARD_SHADOW = '0 1px 3px rgba(15, 23, 42, 0.08)'

const cardBaseStyles = {
  p: { xs: 2.5, md: 3 },
  borderRadius: CARD_RADIUS,
  border: CARD_BORDER,
  boxShadow: CARD_SHADOW,
  backgroundColor: '#FFFFFF'
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
    '&:hover fieldset': { borderColor: PRIMARY_COLOR },
    '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR }
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    boxShadow: '0 0 0 2px #93C5FD'
  },
  '& .MuiOutlinedInput-input': {
    py: 1.1
  }
}

const primaryButtonStyles = {
  textTransform: 'none',
  borderRadius: '999px',
  px: 3,
  py: 1.15,
  backgroundColor: PRIMARY_COLOR,
  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)',
  '&:hover': { backgroundColor: '#1D4ED8' }
}

const tableHeaderCellStyles = {
  fontWeight: 600,
  color: TABLE_TEXT_COLOR,
  fontSize: '0.9rem',
  py: 1.5,
  whiteSpace: 'nowrap'
}

const tableCellStyles = {
  color: TABLE_TEXT_COLOR,
  fontSize: '0.9rem',
  whiteSpace: 'nowrap'
}

const loadUsers = (): UserRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed: UserRecord[] = JSON.parse(stored)
      return parsed.length > 0 ? parsed : defaultUsers
    } catch (error) {
      console.error('Failed to parse stored users', error)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
      return defaultUsers
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
  return defaultUsers
}

const UserManagement = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const [users, setUsers] = useState<UserRecord[]>(loadUsers())

  // Reload when navigating back from other pages
  React.useEffect(() => {
    setUsers(loadUsers())
  }, [location.pathname])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleAddUser = () => {
    navigate('/user-management/add')
  }

  const handleViewUser = (user: UserRecord) => {
    navigate(`/user-management/${user.id}`)
  }

  const handleEditUser = (user: UserRecord) => {
    navigate(`/user-management/${user.id}/edit`)
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (!confirmed) return

    const updated = users.filter(user => user.id !== id)
    setUsers(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.status.toLowerCase().includes(term)
    )
  })

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row', backgroundColor: PAGE_BACKGROUND }}>
      <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: PAGE_BACKGROUND,
          width: '100%',
          overflow: 'hidden',
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          ml: {
            xs: sidebarOpen ? '250px' : '60px',
            md: sidebarOpen ? '250px' : '60px'
          },
          mt: {
            xs: '56px',
            md: 0
          }
        }}
      >
        <Header
          onToggleSidebar={handleToggleSidebar}
          onToggleTheme={toggleTheme}
          mode={mode}
          sidebarOpen={sidebarOpen}
        />

        <Box
          className='contain_main_div'
          sx={{
            flex: 1,
            position: 'relative',
            zIndex: 1,
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.mode === 'dark' ? '#555' : '#ccc',
              borderRadius: '3px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: theme.palette.mode === 'dark' ? '#777' : '#999'
            },
            // p: { xs: 2, md: 3 },
            fontFamily: 'Inter, "Open Sans", sans-serif'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              sx={{
                ...cardBaseStyles,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Box>
                <Typography
                  variant='h5'
                  component='h1'
                  sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.5rem', md: '1.8rem' }, mb: 0.5 }}
                >
                  User Management
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Manage platform users and access levels
                </Typography>
              </Box>
              <Button
                variant='contained'
                startIcon={<PersonAddAltIcon />}
                onClick={handleAddUser}
                sx={{ ...primaryButtonStyles, width: { xs: '100%', sm: 'auto' } }}
              >
                Add User
              </Button>
            </Paper>

            <Paper sx={{ ...cardBaseStyles, mb: 0, p: { xs: 2, md: 2.5 } }}>
              <TextField
                fullWidth
                placeholder='Search by name, email, role, or status...'
                size='small'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: '#9CA3AF' }} />
                    </InputAdornment>
                  )
                }}
                sx={{ ...inputStyles }}
              />
            </Paper>

            <Paper sx={{ ...cardBaseStyles, p: 0, overflow: 'hidden' }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 960 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                      {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(header => (
                        <TableCell key={header} sx={{ ...tableHeaderCellStyles }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align='center' sx={{ py: 4, color: SUBTEXT_COLOR }}>
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <TableRow
                          key={user.id}
                          hover
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                            transition: 'background-color 0.2s ease',
                            '&:hover': { backgroundColor: '#EFF6FF' }
                          }}
                        >
                          <TableCell sx={{ ...tableCellStyles, fontWeight: 600 }}>{user.name}</TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>{user.email}</TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>{user.role}</TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>
                            <Box
                              component='span'
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: user.status === 'Active' ? '#047857' : '#B91C1C',
                                backgroundColor:
                                  user.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(248, 113, 113, 0.18)'
                              }}
                            >
                              {user.status}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>{user.createdAt}</TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title='View' arrow>
                                <IconButton
                                  size='small'
                                  onClick={() => handleViewUser(user)}
                                  sx={{
                                    color: PRIMARY_COLOR,
                                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.16)' }
                                  }}
                                >
                                  <VisibilityIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Edit' arrow>
                                <IconButton
                                  size='small'
                                  onClick={() => handleEditUser(user)}
                                  sx={{
                                    color: '#4B5563',
                                    backgroundColor: '#F3F4F6',
                                    '&:hover': { backgroundColor: '#E5E7EB' }
                                  }}
                                >
                                  <EditIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Delete' arrow>
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() => handleDelete(user.id)}
                                  sx={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.16)' }
                                  }}
                                >
                                  <DeleteIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UserManagement
