import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, TextField, Button, MenuItem, useTheme, useMediaQuery, Paper, IconButton } from '@mui/material'
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

const PRIMARY_COLOR = '#2563EB'
const PAGE_BACKGROUND = '#F8FAFC'
const TITLE_COLOR = '#111827'
const SUBTEXT_COLOR = '#6B7280'
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

const secondaryButtonStyles = {
  textTransform: 'none',
  borderRadius: '999px',
  px: 3,
  py: 1.15,
  borderColor: 'rgba(148, 163, 184, 0.6)',
  color: SUBTEXT_COLOR,
  '&:hover': { borderColor: SUBTEXT_COLOR, backgroundColor: '#F3F4F6' }
}

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
          <Paper
            sx={{
              ...cardBaseStyles,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                onClick={() => navigate('/user-management')}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: CARD_BORDER,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                  color: PRIMARY_COLOR,
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.16)' }
                }}
              >
                <ArrowBackIcon fontSize='small' />
              </IconButton>
              <Box>
                <Typography
                  variant='h5'
                  component='h1'
                  sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 0.25 }}
                >
                  Edit User
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Update user information and access levels
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant='outlined'
                onClick={handleCancel}
                sx={{ ...secondaryButtonStyles, width: { xs: '100%', sm: 'auto' } }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={handleSave}
                sx={{ ...primaryButtonStyles, width: { xs: '100%', sm: 'auto' } }}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ ...cardBaseStyles }}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 0.5 }}>
              User Details
            </Typography>
            <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
              Modify user credentials and role assignment.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }
              }}
            >
              <TextField
                fullWidth
                label='Full Name'
                required
                size='small'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                sx={{ ...inputStyles }}
              />
              <TextField
                fullWidth
                label='Email Address'
                required
                size='small'
                type='email'
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                sx={{ ...inputStyles }}
              />
              <TextField
                fullWidth
                label='Role'
                required
                select
                size='small'
                value={formData.role}
                onChange={e => handleInputChange('role', e.target.value)}
                sx={{ ...inputStyles }}
              >
                <MenuItem value=''>Select role</MenuItem>
                <MenuItem value='Administrator'>Administrator</MenuItem>
                <MenuItem value='Manager'>Manager</MenuItem>
                <MenuItem value='Technician'>Technician</MenuItem>
                <MenuItem value='Quality Analyst'>Quality Analyst</MenuItem>
                <MenuItem value='Support'>Support</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label='Status'
                select
                size='small'
                value={formData.status}
                onChange={e => handleInputChange('status', e.target.value)}
                sx={{ ...inputStyles }}
              >
                <MenuItem value='Active'>Active</MenuItem>
                <MenuItem value='Inactive'>Inactive</MenuItem>
              </TextField>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default EditUser
