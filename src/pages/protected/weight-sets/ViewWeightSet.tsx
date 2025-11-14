import React, { useCallback, useMemo, useState } from 'react'
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

  const summaryDetails = useMemo(
    () =>
      weightSet
        ? ([
            { label: 'Certificate Number', value: weightSet.certificateNumber },
            { label: 'Class', value: weightSet.class },
            { label: 'Date of Issue', value: weightSet.dateOfIssue },
            { label: 'Calibration Due Date', value: weightSet.calibrationDueDate },
            weightSet.createdAt ? { label: 'Created At', value: weightSet.createdAt } : null
          ].filter(Boolean) as { label: string; value: string }[])
        : [],
    [weightSet]
  )

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
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row', backgroundColor: PAGE_BACKGROUND }}>
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
          backgroundColor: PAGE_BACKGROUND,
          width: '100%',
          overflow: 'hidden',
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          ml: {
            xs: sidebarOpen ? '250px' : '0px',
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
                onClick={() => navigate('/weight-sets')}
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
                  Weight Set Details
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  View weight set information and calibration history
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant='contained'
                startIcon={<EditIcon />}
                onClick={handleEdit}
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
                Edit Weight Set
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ ...cardBaseStyles, mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
              Weight Set Summary
            </Typography>
            <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
              Overview of certificate details and calibration schedule.
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
                  backgroundColor: '#F9FAFB',
                  p: 2
                }}
              >
                <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                  Weight Set Name
                </Typography>
                <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                  {weightSet.weightSetNo}
                </Typography>
              </Box>
              <Box
                sx={{
                  border: CARD_BORDER,
                  borderRadius: 2,
                  backgroundColor: '#F9FAFB',
                  p: 2
                }}
              >
                <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                  Weight Set ID
                </Typography>
                <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                  {weightSet.id}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ ...cardBaseStyles }}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
              Certificate & Calibration Details
            </Typography>
            <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
              Key certificate identifiers and scheduling information.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
              }}
            >
              {summaryDetails.map(detail => (
                <Box
                  key={detail.label}
                  sx={{
                    border: CARD_BORDER,
                    borderRadius: 2,
                    backgroundColor: '#FFFFFF',
                    p: 2,
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                    {detail.label}
                  </Typography>
                  <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                    {detail.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewWeightSet
