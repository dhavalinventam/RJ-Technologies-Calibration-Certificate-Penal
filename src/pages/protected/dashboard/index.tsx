import React, { useCallback, useState } from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, Paper } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PeopleOutlined from '@mui/icons-material/PeopleOutlined'
import BuildOutlined from '@mui/icons-material/BuildOutlined'
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined'
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

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

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const summaryCards = [
    {
      title: 'Total Customers',
      value: 1,
      icon: <PeopleOutlined sx={{ fontSize: 32, color: PRIMARY_COLOR }} />
    },
    {
      title: 'Total Devices',
      value: 0,
      icon: <BuildOutlined sx={{ fontSize: 32, color: PRIMARY_COLOR }} />
    },
    {
      title: 'Total Certificates',
      value: 0,
      icon: <VerifiedOutlined sx={{ fontSize: 32, color: PRIMARY_COLOR }} />
    },
    {
      title: 'Due in 30 Days',
      value: 0,
      icon: <CalendarTodayOutlined sx={{ fontSize: 32, color: '#F97316' }} />
    }
  ]

  const quickActions = [
    {
      name: 'Manage Customers',
      description: 'View and manage customer information.',
      path: '/customers'
    },
    {
      name: 'Manage Devices',
      description: 'Track instruments and calibration data.',
      path: '/devices'
    },
    {
      name: 'Create Certificate',
      description: 'Generate a new calibration certificate.',
      path: '/certificates/create'
    },
    {
      name: 'Procedure Templates',
      description: 'Maintain reusable procedure instructions.',
      path: '/procedure-templates'
    }
  ]

  const filteredActions = quickActions

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
            },

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
                  sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 0.5 }}
                >
                  Calibration Dashboard
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Overview of calibration activity and quick actions
                </Typography>
              </Box>
              <Button
                variant='contained'
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/certificates/create')}
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
                Create Certificate
              </Button>
            </Paper>

            <Paper sx={{ ...cardBaseStyles }}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
                Summary
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
                Key metrics across customers, devices, and certificates.
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }
                }}
              >
                {summaryCards.map(card => (
                  <Paper
                    key={card.title}
                    sx={{
                      borderRadius: 3,
                      border: CARD_BORDER,
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500 }}>
                        {card.title}
                      </Typography>
                      {card.icon}
                    </Box>
                    <Typography variant='h5' sx={{ fontWeight: 700, color: TITLE_COLOR }}>
                      {card.value}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>

            <Paper sx={{ ...cardBaseStyles, overflow: 'hidden' }}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
                Quick Actions
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 2 }}>
                Jump directly into common workflows across the platform.
              </Typography>
              {filteredActions.length === 0 ? (
                <Box
                  sx={{
                    border: CARD_BORDER,
                    borderRadius: 3,
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                    p: 3,
                    textAlign: 'center',
                    color: SUBTEXT_COLOR
                  }}
                >
                  No actions match your search.
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
                  }}
                >
                  {filteredActions.map(action => (
                    <Paper
                      key={action.name}
                      sx={{
                        borderRadius: 3,
                        border: CARD_BORDER,
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Box>
                          <Typography variant='subtitle1' sx={{ fontWeight: 600, color: TITLE_COLOR }}>
                            {action.name}
                          </Typography>
                          <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mt: 0.5 }}>
                            {action.description}
                          </Typography>
                        </Box>
                        <Button
                          size='small'
                          variant='outlined'
                          endIcon={<ArrowForwardIcon fontSize='small' />}
                          onClick={() => navigate(action.path)}
                          sx={{
                            textTransform: 'none',
                            borderRadius: '999px',
                            borderColor: PRIMARY_COLOR,
                            color: PRIMARY_COLOR,
                            whiteSpace: 'nowrap',
                            '&:hover': { borderColor: '#1D4ED8', backgroundColor: 'rgba(37, 99, 235, 0.08)' }
                          }}
                        >
                          Go
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
