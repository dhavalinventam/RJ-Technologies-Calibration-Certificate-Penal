import React, { useCallback, useState } from 'react'
import { Box, Typography, TextField, Button, useTheme, useMediaQuery, Paper } from '@mui/material'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    templateName: '',
    templateText: ''
  })

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
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/procedure-templates')}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Back to Templates
            </Button>
            <Typography variant='h5' component='h1' sx={{ fontWeight: 700 }}>
              Add New Template
            </Typography>
          </Box>

          {/* Form Card */}
          <Paper
            sx={{
              borderRadius: 1,
              boxShadow: 2,
              overflow: 'hidden',
              maxWidth: 900,
              mx: 'auto'
            }}
          >
            {/* Card Header */}
            <Box
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                p: 2,
                borderRadius: '4px 4px 0 0'
              }}
            >
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                Create Procedure Template
              </Typography>
            </Box>

            {/* Form Content */}
            <Box sx={{ p: 3 }}>
              <div className='row'>
                <div className='col-12'>
                  <TextField
                    fullWidth
                    label='Template Name'
                    required
                    size='small'
                    placeholder='e.g., Standard SOP V1.1'
                    value={formData.templateName}
                    onChange={e => handleInputChange('templateName', e.target.value)}
                    sx={{ mb: 3 }}
                  />
                </div>
                <div className='col-12'>
                  <TextField
                    fullWidth
                    label='Template Text'
                    required
                    multiline
                    rows={10}
                    size='small'
                    placeholder='Enter the full procedure instruction text...'
                    value={formData.templateText}
                    onChange={e => handleInputChange('templateText', e.target.value)}
                    sx={{ mb: 3 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap'
                }}
              >
                <Button
                  variant='outlined'
                  size='medium'
                  onClick={handleCancel}
                  sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  onClick={handleSave}
                  sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                >
                  Save Template
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default AddTemplate
