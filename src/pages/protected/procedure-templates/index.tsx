import React, { useCallback, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Card,
  CardContent
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useLocation } from 'react-router-dom'
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

const ProcedureTemplates = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  // Load templates from localStorage or use default sample data
  const loadTemplates = (): ProcedureTemplate[] => {
    const stored = localStorage.getItem('procedureTemplates')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // If we have templates, return them; otherwise use defaults
        return parsed.length > 0 ? parsed : getDefaultTemplates()
      } catch {
        const defaults = getDefaultTemplates()
        localStorage.setItem('procedureTemplates', JSON.stringify(defaults))
        return defaults
      }
    }
    const defaults = getDefaultTemplates()
    localStorage.setItem('procedureTemplates', JSON.stringify(defaults))
    return defaults
  }

  const getDefaultTemplates = (): ProcedureTemplate[] => [
    {
      id: '1',
      templateName: 'stadard instruction template 2',
      templateText: 'instruction two',
      createdAt: '14/10/2025',
      updatedAt: '14/10/2025, 17:53:22'
    },
    {
      id: '2',
      templateName: 'Standard SOP V1.1',
      templateText:
        'The device referenced in this document has been metrologically tested in accordance with RJ Technologies Work Instruction. This device was tested in accordance...',
      createdAt: '14/10/2025',
      updatedAt: '14/10/2025, 17:53:22'
    }
  ]

  const [templates, setTemplates] = useState<ProcedureTemplate[]>(loadTemplates())

  // Reload templates when component mounts or when location changes (returning from Add/Edit)
  React.useEffect(() => {
    const loaded = loadTemplates()
    setTemplates(loaded)
  }, [location.pathname])

  // Save templates to localStorage whenever they change (for delete operations)
  React.useEffect(() => {
    localStorage.setItem('procedureTemplates', JSON.stringify(templates))
  }, [templates])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleView = (template: ProcedureTemplate) => {
    navigate(`/procedure-templates/${template.id}`)
  }

  const handleEdit = (template: ProcedureTemplate) => {
    navigate(`/procedure-templates/${template.id}/edit`)
  }

  const handleDelete = (templateId: string) => {
    // Delete template logic here
    const updatedTemplates = templates.filter(t => t.id !== templateId)
    setTemplates(updatedTemplates)
    localStorage.setItem('procedureTemplates', JSON.stringify(updatedTemplates))
  }

  const handleAdd = () => {
    navigate('/procedure-templates/add')
  }

  const filteredTemplates = templates.filter(
    template =>
      template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.templateText.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string): string => {
    return dateString
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
                onClick={() => navigate('/dashboard')}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
            <Button variant='contained' startIcon={<AddIcon />} onClick={handleAdd} sx={{ textTransform: 'none' }}>
              Add New Template
            </Button>
          </Box>

          {/* Title */}
          <Typography variant='h4' component='h1' sx={{ fontWeight: 700, mb: 3 }}>
            Procedure Instruction Templates
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, width: '100%', mb: 3 }}>
            <TextField
              fullWidth
              placeholder='Search templates...'
              size='small'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Template Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 3,
              mb: 3
            }}
          >
            {filteredTemplates.length === 0 ? (
              <Box
                sx={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  py: 4
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  No templates found
                </Typography>
              </Box>
            ) : (
              filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  sx={{
                    boxShadow: 2,
                    borderRadius: 1,
                    borderLeft: '4px solid',
                    borderLeftColor: 'primary.main',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: 'text.primary',
                        fontSize: '1.1rem'
                      }}
                    >
                      {template.templateName}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5, fontSize: '0.875rem' }}>
                      Created: {formatDate(template.createdAt)}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '4.5rem'
                      }}
                    >
                      {template.templateText}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      p: 2,
                      pt: 0,
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<VisibilityIcon fontSize='small' />}
                      onClick={() => handleView(template)}
                      sx={{
                        textTransform: 'none',
                        flex: 1,
                        borderColor: 'text.secondary',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'text.secondary',
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<EditIcon fontSize='small' />}
                      onClick={() => handleEdit(template)}
                      sx={{
                        textTransform: 'none',
                        flex: 1,
                        borderColor: 'text.secondary',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'text.secondary',
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size='small'
                      color='error'
                      onClick={() => handleDelete(template.id)}
                      sx={{
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'error.dark'
                        }
                      }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </Card>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProcedureTemplates
