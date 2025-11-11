import React, { useCallback, useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, useTheme, useMediaQuery, IconButton, Paper, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from 'moment'
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
}

const EditWeightSet = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Sample weight set data - replace with actual data from API
  const [weightSetData] = useState<WeightSet | null>({
    id: id || '1',
    weightSetNo: 'Colgate std. Weights – 20 kg',
    certificateNumber: 'KC/M/0097/25-27',
    class: 'M1',
    dateOfIssue: '12.08.2025',
    calibrationDueDate: '11.08.2027'
  })

  const [formData, setFormData] = useState({
    weightSetNo: '',
    certificateNumber: '',
    class: '',
    dateOfIssue: null as Moment | null,
    calibrationDueDate: null as Moment | null
  })

  useEffect(() => {
    if (weightSetData) {
      // Parse date strings to Moment objects
      const parseDate = (dateString: string): Moment | null => {
        if (!dateString) return null
        return moment(dateString, 'DD.MM.YYYY')
      }

      setFormData({
        weightSetNo: weightSetData.weightSetNo,
        certificateNumber: weightSetData.certificateNumber,
        class: weightSetData.class,
        dateOfIssue: parseDate(weightSetData.dateOfIssue),
        calibrationDueDate: parseDate(weightSetData.calibrationDueDate)
      })
    }
  }, [weightSetData])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleInputChange = (field: string, value: string | Moment | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (date: Moment | null): string => {
    if (!date) return ''
    return date.format('DD.MM.YYYY')
  }

  const handleSave = () => {
    // Update weight set logic here
    console.log('Updating weight set:', {
      ...formData,
      dateOfIssue: formatDate(formData.dateOfIssue),
      calibrationDueDate: formatDate(formData.calibrationDueDate)
    })
    // Navigate back to list
    navigate('/weight-sets')
  }

  const handleCancel = () => {
    navigate('/weight-sets')
  }

  if (!weightSetData) {
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
                  Edit Weight Set
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Modify weight set details and schedule
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' }
              }}
            >
              <Button variant='outlined' onClick={handleCancel} sx={{ textTransform: 'none', minWidth: { sm: 120 } }}>
                Cancel
              </Button>
              <Button variant='contained' onClick={handleSave} sx={{ textTransform: 'none', minWidth: { sm: 140 } }}>
                Save Changes
              </Button>
            </Box>
          </Box>

          {/* Form */}
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none'
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
              Weight Set Information
            </Typography>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Weight Set No.'
                    size='small'
                    placeholder='e.g., Colgate std. Weights - 20 kg'
                    value={formData.weightSetNo}
                    onChange={e => handleInputChange('weightSetNo', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Certificate Number'
                    size='small'
                    placeholder='e.g., KC/M/0097/25-27'
                    value={formData.certificateNumber}
                    onChange={e => handleInputChange('certificateNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Class'
                    size='small'
                    placeholder='e.g., M1'
                    value={formData.class}
                    onChange={e => handleInputChange('class', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label='Date of Issue'
                    value={formData.dateOfIssue}
                    onChange={date => handleInputChange('dateOfIssue', date)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: 'Pick a date'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label='Calibration Due Date'
                    value={formData.calibrationDueDate}
                    onChange={date => handleInputChange('calibrationDueDate', date)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: 'Pick a date'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default EditWeightSet
