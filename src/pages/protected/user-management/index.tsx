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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { useLocation } from 'react-router-dom'
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

type UserFormState = {
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
}

const emptyFormState: UserFormState = {
  name: '',
  email: '',
  role: '',
  status: 'Active'
}

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
  const [searchTerm, setSearchTerm] = useState('')

  const [users, setUsers] = useState<UserRecord[]>(loadUsers())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState<UserFormState>(emptyFormState)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)
  const [editForm, setEditForm] = useState<UserFormState>(emptyFormState)

  // Reload when navigating back from other pages
  React.useEffect(() => {
    setUsers(loadUsers())
  }, [location.pathname])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleOpenAddDialog = () => {
    setAddForm(emptyFormState)
    setIsAddDialogOpen(true)
  }

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false)
  }

  const handleAddFormChange = (field: keyof UserFormState, value: string) => {
    setAddForm(prev => ({
      ...prev,
      [field]: field === 'status' ? (value as UserFormState['status']) : value
    }))
  }

  const handleSaveNewUser = () => {
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.role.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    const now = new Date()
    const createdAt = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

    const newUser: UserRecord = {
      id: Date.now().toString(),
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      role: addForm.role.trim(),
      status: addForm.status,
      createdAt
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
    setIsAddDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (!confirmed) return

    const updated = users.filter(user => user.id !== id)
    setUsers(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const handleOpenViewDialog = (user: UserRecord) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
  }

  const handleOpenEditDialog = (user: UserRecord) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
  }

  const handleEditFormChange = (field: keyof UserFormState, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: field === 'status' ? (value as UserFormState['status']) : value
    }))
  }

  const handleSaveEditedUser = () => {
    if (!selectedUser) return
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.role.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? {
            ...user,
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            role: editForm.role.trim(),
            status: editForm.status
          }
        : user
    )

    setUsers(updatedUsers)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
    setIsEditDialogOpen(false)
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
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>
      <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
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
            overflow: 'auto'
          }}
        >
          <Box>
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Box>
                <Typography variant='h5' component='h1' sx={{ fontWeight: 700 }}>
                  User Management
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Manage platform users and access levels
                </Typography>
              </Box>
              <Button
                variant='contained'
                startIcon={<PersonAddAltIcon />}
                onClick={handleOpenAddDialog}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Add User
              </Button>
            </Box>

            <Paper
              sx={{
                borderRadius: 2,
                boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.08)',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                  All Users
                </Typography>
                <TextField
                  fullWidth
                  placeholder='Search users...'
                  size='small'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon fontSize='small' />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <TableContainer component={Box} sx={{ maxHeight: 520 }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align='right'>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                          <Typography variant='body2' color='text.secondary'>
                            No users found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map(user => (
                        <TableRow key={user.id} hover>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Box
                              component='span'
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: user.status === 'Active' ? 'success.main' : 'error.main',
                                backgroundColor:
                                  user.status === 'Active' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)'
                              }}
                            >
                              {user.status}
                            </Box>
                          </TableCell>
                          <TableCell>{user.createdAt}</TableCell>
                          <TableCell align='right'>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <IconButton
                                size='small'
                                onClick={() => handleOpenViewDialog(user)}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  backgroundColor: 'background.paper',
                                  color: 'text.primary',
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                <VisibilityIcon fontSize='small' />
                              </IconButton>
                              <IconButton
                                size='small'
                                onClick={() => handleOpenEditDialog(user)}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  backgroundColor: 'background.paper',
                                  color: 'text.primary',
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                <EditIcon fontSize='small' />
                              </IconButton>
                              <IconButton
                                size='small'
                                color='error'
                                onClick={() => handleDelete(user.id)}
                                sx={{
                                  backgroundColor: 'error.main',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: 'error.dark'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize='small' />
                              </IconButton>
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
          <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Add User</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
                <TextField
                  label='Full Name'
                  required
                  size='small'
                  value={addForm.name}
                  onChange={e => handleAddFormChange('name', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                />
                <TextField
                  label='Email'
                  required
                  type='email'
                  size='small'
                  value={addForm.email}
                  onChange={e => handleAddFormChange('email', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                />
                <TextField
                  label='Role'
                  required
                  select
                  size='small'
                  value={addForm.role}
                  onChange={e => handleAddFormChange('role', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                >
                  <MenuItem value=''>Select role</MenuItem>
                  <MenuItem value='Administrator'>Administrator</MenuItem>
                  <MenuItem value='Manager'>Manager</MenuItem>
                  <MenuItem value='Technician'>Technician</MenuItem>
                  <MenuItem value='Quality Analyst'>Quality Analyst</MenuItem>
                  <MenuItem value='Support'>Support</MenuItem>
                </TextField>
                <TextField
                  label='Status'
                  select
                  size='small'
                  value={addForm.status}
                  onChange={e => handleAddFormChange('status', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                >
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseAddDialog} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button variant='contained' onClick={handleSaveNewUser} sx={{ textTransform: 'none' }}>
                Save User
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={isViewDialogOpen} onClose={handleCloseViewDialog} fullWidth maxWidth='sm'>
            <DialogTitle>User Details</DialogTitle>
            <DialogContent dividers>
              {selectedUser && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Full Name
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {selectedUser.name}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Email
                    </Typography>
                    <Typography variant='body1'>{selectedUser.email}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        Role
                      </Typography>
                      <Typography variant='body1'>{selectedUser.role}</Typography>
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary'>
                        Status
                      </Typography>
                      <Typography
                        variant='body1'
                        sx={{
                          fontWeight: 600,
                          color: selectedUser.status === 'Active' ? 'success.main' : 'error.main'
                        }}
                      >
                        {selectedUser.status}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Created
                    </Typography>
                    <Typography variant='body1'>{selectedUser.createdAt}</Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseViewDialog} sx={{ textTransform: 'none' }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth='sm'>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
                <TextField
                  label='Full Name'
                  required
                  size='small'
                  value={editForm.name}
                  onChange={e => handleEditFormChange('name', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                />
                <TextField
                  label='Email'
                  required
                  type='email'
                  size='small'
                  value={editForm.email}
                  onChange={e => handleEditFormChange('email', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                />
                <TextField
                  label='Role'
                  required
                  select
                  size='small'
                  value={editForm.role}
                  onChange={e => handleEditFormChange('role', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                >
                  <MenuItem value='Administrator'>Administrator</MenuItem>
                  <MenuItem value='Manager'>Manager</MenuItem>
                  <MenuItem value='Technician'>Technician</MenuItem>
                  <MenuItem value='Quality Analyst'>Quality Analyst</MenuItem>
                  <MenuItem value='Support'>Support</MenuItem>
                </TextField>
                <TextField
                  label='Status'
                  select
                  size='small'
                  value={editForm.status}
                  onChange={e => handleEditFormChange('status', e.target.value)}
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}
                >
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseEditDialog} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button variant='contained' onClick={handleSaveEditedUser} sx={{ textTransform: 'none' }}>
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  )
}

export default UserManagement
