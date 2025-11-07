import React, { useCallback, useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, useTheme, useMediaQuery, IconButton } from '@mui/material'
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
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
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
                Update weight set details
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className='row'>
              <div className='col-12 col-md-6'>
                <TextField
                  fullWidth
                  label='Weight Set No.'
                  size='small'
                  placeholder='e.g., Colgate std. Weights - 20 kg'
                  value={formData.weightSetNo}
                  onChange={e => handleInputChange('weightSetNo', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </div>
              <div className='col-12 col-md-6'>
                <TextField
                  fullWidth
                  label='Certificate Number'
                  size='small'
                  placeholder='e.g., KC/M/0097/25-27'
                  value={formData.certificateNumber}
                  onChange={e => handleInputChange('certificateNumber', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </div>
              <div className='col-12 col-md-6'>
                <TextField
                  fullWidth
                  label='Class'
                  size='small'
                  placeholder='e.g., M1'
                  value={formData.class}
                  onChange={e => handleInputChange('class', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </div>
              <div className='col-12 col-md-6'>
                <DatePicker
                  label='Date of Issue'
                  value={formData.dateOfIssue}
                  onChange={date => handleInputChange('dateOfIssue', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'Pick a date',
                      sx: { mb: 2 }
                    }
                  }}
                />
              </div>
              <div className='col-12 col-md-6'>
                <DatePicker
                  label='Calibration Due Date'
                  value={formData.calibrationDueDate}
                  onChange={date => handleInputChange('calibrationDueDate', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'Pick a date',
                      sx: { mb: 2 }
                    }
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 3,
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant='contained'
              size='medium'
              onClick={handleSave}
              sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
            >
              Save
            </Button>
            <Button
              variant='outlined'
              size='medium'
              onClick={handleCancel}
              sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default EditWeightSet
