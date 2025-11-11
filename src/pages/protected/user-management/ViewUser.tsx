import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, Paper, IconButton } from '@mui/material'
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
const PRIMARY_COLOR = '#2563EB'
const PAGE_BACKGROUND = '#F8FAFC'
const TITLE_COLOR = '#111827'
const SUBTEXT_COLOR = '#6B7280'
const VALUE_COLOR = '#1F2937'
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
                  User Details
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  View user information and access configuration
                </Typography>
              </Box>
            </Box>
            <Button
              variant='contained'
              startIcon={<EditIcon />}
              onClick={() => navigate(`/user-management/${userData.id}/edit`)}
              sx={{
                textTransform: 'none',
                borderRadius: '999px',
                px: 3,
                py: 1.15,
                backgroundColor: PRIMARY_COLOR,
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)',
                '&:hover': { backgroundColor: '#1D4ED8' }
              }}
            >
              Edit User
            </Button>
          </Paper>

          <Paper sx={{ ...cardBaseStyles, mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
              User Summary
            </Typography>
            <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
              Overview of account details and status.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
              }}
            >
              <Box sx={{ border: CARD_BORDER, borderRadius: 2, backgroundColor: '#F9FAFB', p: 2 }}>
                <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                  Full Name
                </Typography>
                <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                  {userData.name}
                </Typography>
              </Box>
              <Box sx={{ border: CARD_BORDER, borderRadius: 2, backgroundColor: '#F9FAFB', p: 2 }}>
                <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                  Email Address
                </Typography>
                <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                  {userData.email}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ ...cardBaseStyles }}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
              Access & Activity
            </Typography>
            <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
              Role assignment and lifecycle tracking.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
              }}
            >
              <Box
                sx={{
                  border: CARD_BORDER,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  p: 2,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                }}
              >
                <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                  Role
                </Typography>
                <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                  {userData.role}
                </Typography>
              </Box>
              <Box
                sx={{
                  border: CARD_BORDER,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  p: 2,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                }}
              >
                <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                  Status
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    fontWeight: 600,
                    color: userData.status === 'Active' ? '#047857' : '#B91C1C'
                  }}
                >
                  {userData.status}
                </Typography>
              </Box>
              <Box
                sx={{
                  border: CARD_BORDER,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  p: 2,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                }}
              >
                <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                  Created On
                </Typography>
                <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                  {userData.createdAt}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewUser
