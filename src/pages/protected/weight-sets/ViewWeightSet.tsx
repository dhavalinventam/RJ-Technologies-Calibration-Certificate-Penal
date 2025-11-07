import React, { useCallback, useState } from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, IconButton, Paper } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

interface WeightSet {
  id: string
  weightSetNo: string
  certificateNumber: string
  class: string
  dateOfIssue: string
  calibrationDueDate: string
  createdAt?: string
}

const ViewWeightSet = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Sample weight set data - replace with actual data from API
  const [weightSet] = useState<WeightSet | null>({
    id: id || '1',
    weightSetNo: 'Colgate std. Weights – 20 kg',
    certificateNumber: 'KC/M/0097/25-27',
    class: 'M1',
    dateOfIssue: '12.08.2025',
    calibrationDueDate: '11.08.2027',
    createdAt: '14.10.2025 18:39'
  })

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleEdit = () => {
    if (weightSet) {
      navigate(`/weight-sets/${weightSet.id}/edit`)
    }
  }

  if (!weightSet) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Weight set not found</Typography>
      </Box>
    )
  }

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
          {/* Page Header */}
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
              <IconButton
                onClick={() => navigate('/weight-sets')}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant='h5' component='h1' sx={{ fontWeight: 700 }}>
                  Weight Set Details
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  View weight set information
                </Typography>
              </Box>
            </Box>
            <Button variant='contained' startIcon={<EditIcon />} onClick={handleEdit} sx={{ textTransform: 'none' }}>
              Edit
            </Button>
          </Box>

          {/* Details Card */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 1,
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {/* Weight Set Name Heading */}
            <Typography variant='h6' sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
              {weightSet.weightSetNo}
            </Typography>

            {/* Details Grid */}
            <div className='row'>
              <div className='col-12 col-md-6'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Weight Set No.
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {weightSet.weightSetNo}
                  </Typography>
                </Box>
              </div>
              <div className='col-12 col-md-6'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Certificate Number
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {weightSet.certificateNumber}
                  </Typography>
                </Box>
              </div>
              <div className='col-12 col-md-6'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Class
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {weightSet.class}
                  </Typography>
                </Box>
              </div>
              <div className='col-12 col-md-6'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Date of Issue
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {weightSet.dateOfIssue}
                  </Typography>
                </Box>
              </div>
              <div className='col-12 col-md-6'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                    Calibration Due Date
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>
                    {weightSet.calibrationDueDate}
                  </Typography>
                </Box>
              </div>
              {weightSet.createdAt && (
                <div className='col-12 col-md-6'>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                      Created At
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                      {weightSet.createdAt}
                    </Typography>
                  </Box>
                </div>
              )}
            </div>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewWeightSet
