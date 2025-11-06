import React, { useCallback, useState } from 'react'
import { Box, Typography, Card, CardContent, Container, Chip, useTheme, useMediaQuery } from '@mui/material'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

const Dashboard = () => {
  const isDevelopment = import.meta.env.DEV
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />

      {/* Main Content Area */}
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
        {/* Header */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          onToggleTheme={toggleTheme}
          mode={mode}
          sidebarOpen={sidebarOpen}
        />

        {/* Content */}
        <Box
          className='contain_main_div'
          sx={{
            flex: 1,
            position: 'relative',
            zIndex: '1',
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
            }
          }}
        >
          <Container maxWidth='lg' sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant='h3' component='h1' sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Dashboard
                </Typography>
                {isDevelopment && <Chip label='Development Mode' color='warning' variant='outlined' size='small' />}
              </Box>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
                Welcome to your dashboard
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant='h4' component='h2' gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
                    Main Dashboard
                  </Typography>
                  <Typography variant='body1' paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    This is your main dashboard page. All other protected pages have been removed as requested.
                  </Typography>
                  <Typography variant='body1' paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    The sidebar, header, and footer components are preserved and will be displayed around this content.
                  </Typography>
                  {isDevelopment && (
                    <Typography
                      variant='body2'
                      color='warning.main'
                      sx={{ fontSize: '0.9rem', fontStyle: 'italic', mt: 2 }}
                    >
                      Note: You are currently in development mode. Mock authentication has been set up to bypass the
                      sign-in page.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
