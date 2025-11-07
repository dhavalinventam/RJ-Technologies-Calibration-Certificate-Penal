import React, { useCallback, useState } from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, Paper, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate, useParams } from 'react-router-dom'
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

const ViewTemplate = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Load template from localStorage
  const [template, setTemplate] = useState<ProcedureTemplate | null>(null)

  React.useEffect(() => {
    if (id) {
      const stored = localStorage.getItem('procedureTemplates')
      if (stored) {
        try {
          const templates = JSON.parse(stored)
          const foundTemplate = templates.find((t: ProcedureTemplate) => t.id === id)
          setTemplate(foundTemplate || null)
        } catch (error) {
          console.error('Error loading template:', error)
        }
      }
    }
  }, [id])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleEdit = () => {
    if (template) {
      navigate(`/procedure-templates/${template.id}/edit`)
    }
  }

  if (!template) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Template not found</Typography>
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
                View Template
              </Typography>
            </Box>
            <Button variant='contained' startIcon={<EditIcon />} onClick={handleEdit} sx={{ textTransform: 'none' }}>
              Edit Template
            </Button>
          </Box>

          {/* Template Details Card */}
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
                {template.templateName}
              </Typography>
            </Box>

            {/* Details Content */}
            <Box sx={{ p: 3 }}>
              <div className='row'>
                <div className='col-12 col-md-6'>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                      Template Name
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                      {template.templateName}
                    </Typography>
                  </Box>
                </div>
                <div className='col-12 col-md-6'>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                      Created Date
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                      {template.createdAt}
                    </Typography>
                  </Box>
                </div>
                <div className='col-12 col-md-6'>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                      Last Updated
                    </Typography>
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                      {template.updatedAt || template.createdAt}
                    </Typography>
                  </Box>
                </div>
                <div className='col-12'>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                      Template Text
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      value={template.templateText}
                      InputProps={{
                        readOnly: true
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'action.hover',
                          '& fieldset': {
                            borderColor: 'divider'
                          }
                        }
                      }}
                    />
                  </Box>
                </div>
              </div>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewTemplate
