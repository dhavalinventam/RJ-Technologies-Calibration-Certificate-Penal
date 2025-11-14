import React, { useCallback, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Paper
  // InputAdornment
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import SearchIcon from '@mui/icons-material/Search'
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
      borderRadius: '8px',
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
  // const [searchTerm, setSearchTerm] = useState('')

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
          {/* Page Header */}
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
                  Edit Weight Set
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Modify weight set details and calibration schedule
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button variant='outlined' onClick={handleCancel} sx={{ ...secondaryButtonStyles }}>
                Cancel Edit
              </Button>
              <Button variant='contained' onClick={handleSave} sx={{ ...primaryButtonStyles }}>
                Save Changes
              </Button>
            </Box>
          </Paper>

          {/* Form */}
          <Paper sx={{ ...cardBaseStyles }}>
            <Typography variant='h6' sx={{ fontWeight: 600, color: TITLE_COLOR, mb: 0.5 }}>
              Weight Set Information
            </Typography>
            <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
              Update the identification details and calibration schedule.
            </Typography>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }
                }}
              >
                <TextField
                  fullWidth
                  label='Weight Set No.'
                  size='small'
                  placeholder='e.g., Colgate Std. Weights – 20 kg'
                  value={formData.weightSetNo}
                  onChange={e => handleInputChange('weightSetNo', e.target.value)}
                  sx={{ ...inputStyles }}
                />
                <TextField
                  fullWidth
                  label='Certificate Number'
                  size='small'
                  placeholder='e.g., KC/M/0097/25-27'
                  value={formData.certificateNumber}
                  onChange={e => handleInputChange('certificateNumber', e.target.value)}
                  sx={{ ...inputStyles }}
                />
                <TextField
                  fullWidth
                  label='Class'
                  size='small'
                  placeholder='e.g., M1'
                  value={formData.class}
                  onChange={e => handleInputChange('class', e.target.value)}
                  sx={{ ...inputStyles }}
                />
                <DatePicker
                  label='Date of Issue'
                  value={formData.dateOfIssue}
                  onChange={date => handleInputChange('dateOfIssue', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'Pick a date',
                      sx: { ...inputStyles }
                    }
                  }}
                />
                <DatePicker
                  label='Calibration Due Date'
                  value={formData.calibrationDueDate}
                  onChange={date => handleInputChange('calibrationDueDate', date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'Pick a date',
                      sx: { ...inputStyles }
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default EditWeightSet
