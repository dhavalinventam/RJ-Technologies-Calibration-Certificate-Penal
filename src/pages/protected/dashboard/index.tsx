import React, { useCallback, useState } from 'react'
import { Box, Typography, Button, Card, CardContent, useTheme, useMediaQuery } from '@mui/material'
import {
  PeopleOutlined,
  BuildOutlined,
  VerifiedOutlined,
  CalendarTodayOutlined,
  DescriptionOutlined
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Customers',
      value: 1,
      icon: PeopleOutlined,
      iconColor: '#1976d2'
    },
    {
      title: 'Total Devices',
      value: 0,
      icon: BuildOutlined,
      iconColor: '#1976d2'
    },
    {
      title: 'Total Certificates',
      value: 0,
      icon: VerifiedOutlined,
      iconColor: '#1976d2'
    },
    {
      title: 'Due in 30 Days',
      value: 0,
      icon: CalendarTodayOutlined,
      iconColor: '#ff9800'
    }
  ]

  // Action cards data
  const actionCards = [
    {
      title: 'Manage Customers',
      description: 'View and manage customer information',
      icon: PeopleOutlined,
      iconColor: '#1976d2',
      path: '/customers'
    },
    {
      title: 'Manage Devices',
      description: 'Track instruments and equipment',
      icon: BuildOutlined,
      iconColor: '#1976d2',
      path: '/devices'
    },
    {
      title: 'View Certificates',
      description: 'Browse and search certificates',
      icon: VerifiedOutlined,
      iconColor: '#1976d2',
      path: '/certificates'
    },
    {
      title: 'Procedure Templates',
      description: 'Manage procedure instruction templates',
      icon: DescriptionOutlined,
      iconColor: '#1976d2',
      path: '/procedure-templates'
    }
  ]

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
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 4,
              gap: 2
            }}
          >
            <Box>
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  color: '#1976d2',
                  mb: 0.5
                }}
              >
                RJ Technologies
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Calibration Certificate Management
              </Typography>
            </Box>
            <Button variant='contained' size='medium' onClick={() => navigate('/certificates/create')}>
              Create New Certificate
            </Button>
          </Box>

          {/* Summary Cards Row */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              mb: 4
            }}
          >
            {summaryCards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <Card
                  key={index}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' },
                    minWidth: { xs: '100%', sm: '200px' },
                    backgroundColor:
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      padding: { xs: 2, sm: 2.5 },
                      position: 'relative',
                      '&:last-child': { pb: { xs: 2, sm: 2.5 } }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        {card.title}
                      </Typography>
                      <IconComponent
                        sx={{
                          fontSize: { xs: 24, sm: 28 },
                          color: card.iconColor
                        }}
                      />
                    </Box>
                    <Typography
                      variant='h4'
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '1.75rem', sm: '2rem' },
                        mt: 1
                      }}
                    >
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              )
            })}
          </Box>

          {/* Action Cards Row */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            {actionCards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <Card
                  key={index}
                  onClick={() => navigate(card.path)}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' },
                    minWidth: { xs: '100%', sm: '200px' },
                    backgroundColor:
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      padding: { xs: 2.5, sm: 3 },
                      '&:last-child': { pb: { xs: 2.5, sm: 3 } }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        mb: 1.5
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: { xs: 32, sm: 36 },
                          color: card.iconColor,
                          flexShrink: 0
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant='h6'
                          sx={{
                            fontWeight: 600,
                            color: '#1976d2',
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            mb: 0.5
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                          }}
                        >
                          {card.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
