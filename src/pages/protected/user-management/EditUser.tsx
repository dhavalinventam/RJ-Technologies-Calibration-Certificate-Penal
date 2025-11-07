import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, TextField, Button, MenuItem, useTheme, useMediaQuery, Paper } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
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

const EditUser = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [userData, setUserData] = useState<UserRecord | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active'
  })

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  useEffect(() => {
    if (!id) return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    try {
      const users: UserRecord[] = JSON.parse(stored)
      const found = users.find(user => user.id === id) || null
      setUserData(found)
      if (found) {
        setFormData({
          name: found.name,
          email: found.email,
          role: found.role,
          status: found.status
        })
      }
    } catch (error) {
      console.error('Failed to load user', error)
    }
  }, [id])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    if (!id) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    const users: UserRecord[] = JSON.parse(stored)
    const updatedUsers = users.map(user =>
      user.id === id
        ? {
            ...user,
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role.trim(),
            status: formData.status as 'Active' | 'Inactive'
          }
        : user
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
    navigate('/user-management')
  }

  const handleCancel = () => {
    navigate('/user-management')
  }

  if (!userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant='body1'>User not found</Typography>
      </Box>
    )
  }

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
            overflow: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, sm: 4 }
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/user-management')}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Back to Users
            </Button>
            <Typography variant='h5' component='h1' sx={{ fontWeight: 700 }}>
              Edit User
            </Typography>
          </Box>

          <Paper
            sx={{
              borderRadius: 2,
              boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.08)',
              overflow: 'hidden',
              maxWidth: 720,
              mx: 'auto'
            }}
          >
            <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
                User Details
              </Typography>

              <div className='row'>
                <div className='col-12 col-md-6'>
                  <TextField
                    fullWidth
                    label='Full Name'
                    required
                    size='small'
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    sx={{ mb: 3 }}
                  />
                </div>
                <div className='col-12 col-md-6'>
                  <TextField
                    fullWidth
                    label='Email'
                    required
                    size='small'
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    sx={{ mb: 3 }}
                  />
                </div>
                <div className='col-12 col-md-6'>
                  <TextField
                    fullWidth
                    label='Role'
                    required
                    size='small'
                    select
                    value={formData.role}
                    onChange={e => handleInputChange('role', e.target.value)}
                    sx={{ mb: 3 }}
                  >
                    <MenuItem value='Administrator'>Administrator</MenuItem>
                    <MenuItem value='Manager'>Manager</MenuItem>
                    <MenuItem value='Technician'>Technician</MenuItem>
                    <MenuItem value='Quality Analyst'>Quality Analyst</MenuItem>
                    <MenuItem value='Support'>Support</MenuItem>
                  </TextField>
                </div>
                <div className='col-12 col-md-6'>
                  <TextField
                    fullWidth
                    label='Status'
                    size='small'
                    select
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                    sx={{ mb: 3 }}
                  >
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Inactive'>Inactive</MenuItem>
                  </TextField>
                </div>
              </div>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'stretch', sm: 'flex-end' },
                  gap: 2,
                  flexWrap: 'wrap'
                }}
              >
                <Button
                  variant='outlined'
                  size='medium'
                  onClick={handleCancel}
                  sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={handleSave}
                  sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default EditUser
