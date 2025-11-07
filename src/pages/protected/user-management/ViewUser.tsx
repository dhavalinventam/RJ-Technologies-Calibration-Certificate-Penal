import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
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

const ViewUser = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [userData, setUserData] = useState<UserRecord | null>(null)

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
    } catch (error) {
      console.error('Failed to load user', error)
    }
  }, [id])

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
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                User Details
              </Typography>
            </Box>
            <Button
              variant='contained'
              startIcon={<EditIcon />}
              onClick={() => navigate(`/user-management/${userData.id}/edit`)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Edit User
            </Button>
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
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 1.5 }}>
                {userData.name}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Created on {userData.createdAt}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {userData.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Email Address
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {userData.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Role
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {userData.role}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Status
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      fontWeight: 600,
                      color: userData.status === 'Active' ? 'success.main' : 'error.main'
                    }}
                  >
                    {userData.status}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewUser
