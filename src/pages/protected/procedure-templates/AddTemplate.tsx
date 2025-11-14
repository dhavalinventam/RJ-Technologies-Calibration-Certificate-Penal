import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, TextField, Button, useTheme, useMediaQuery, Paper, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

interface ProcedureTemplate {
  id: string
  templateName: string
  templateText: string
  createdAt: string
  updatedAt?: string
}

const AddTemplate = () => {
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

  const [formData, setFormData] = useState({
    templateName: '',
    templateText: ''
  })

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Validate form
    if (!formData.templateName.trim() || !formData.templateText.trim()) {
      alert('Please fill in all required fields')
      return
    }

    // Load existing templates
    const stored = localStorage.getItem('procedureTemplates')
    const existingTemplates = stored ? JSON.parse(stored) : []

    // Create new template
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
    const timeStr = `${dateStr}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const newTemplate: ProcedureTemplate = {
      id: Date.now().toString(),
      templateName: formData.templateName.trim(),
      templateText: formData.templateText.trim(),
      createdAt: dateStr,
      updatedAt: timeStr
    }

    // Add to templates
    const updatedTemplates = [...existingTemplates, newTemplate]
    localStorage.setItem('procedureTemplates', JSON.stringify(updatedTemplates))

    // Navigate back to list
    navigate('/procedure-templates')
  }

  const handleCancel = () => {
    navigate('/procedure-templates')
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
            }
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton
                  onClick={() => navigate('/procedure-templates')}
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
                    Add Procedure Template
                  </Typography>
                  <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                    Create a reusable instruction set for calibration procedures.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button variant='outlined' onClick={handleCancel} sx={{ ...secondaryButtonStyles }}>
                  Cancel
                </Button>
                <Button variant='contained' onClick={handleSave} sx={{ ...primaryButtonStyles }}>
                  Save Template
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ ...cardBaseStyles, maxWidth: 900, mx: 'auto', width: '100%' }}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
                Template Details
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
                Provide a clear name and the complete instructions for this procedure template.
              </Typography>

              <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: '1fr' } }}>
                <TextField
                  fullWidth
                  label='Template Name'
                  required
                  size='small'
                  placeholder='e.g., Standard SOP V1.1'
                  value={formData.templateName}
                  onChange={e => handleInputChange('templateName', e.target.value)}
                  sx={{ ...inputStyles }}
                />
                <TextField
                  fullWidth
                  label='Procedure Content'
                  required
                  multiline
                  minRows={8}
                  placeholder='Enter the full procedure instruction text...'
                  value={formData.templateText}
                  onChange={e => handleInputChange('templateText', e.target.value)}
                  sx={{
                    ...inputStyles,
                    '& .MuiOutlinedInput-root': {
                      ...inputStyles['& .MuiOutlinedInput-root'],
                      alignItems: 'flex-start'
                    }
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  mt: 3
                }}
              >
                <Button variant='outlined' onClick={handleCancel} sx={{ ...secondaryButtonStyles }}>
                  Cancel
                </Button>
                <Button variant='contained' onClick={handleSave} sx={{ ...primaryButtonStyles }}>
                  Save Template
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AddTemplate
