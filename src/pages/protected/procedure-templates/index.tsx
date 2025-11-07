import React, { useCallback, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
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
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'row',
        fontFamily: 'Inter, "Segoe UI", sans-serif'
      }}
    >
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                alignSelf: 'flex-start',
                textTransform: 'none',
                color: 'text.primary',
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
                backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 6px 18px rgba(15, 23, 42, 0.08)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'action.hover' : '#f0f4ff'
                }
              }}
            >
              Back to Dashboard
            </Button>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2.5,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.65)' : '#ffffff',
                borderRadius: 3,
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.25)' : 'rgba(226, 232, 240, 0.8)',
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 12px 24px rgba(15, 23, 42, 0.55)'
                    : '0 18px 36px rgba(15, 23, 42, 0.12)',
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 2.5 }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography
                  variant='h5'
                  component='h1'
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.45rem', md: '1.75rem' },
                    color: 'text.primary',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Procedure Instruction Templates
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.95rem', md: '1rem' }
                  }}
                >
                  Manage reusable procedure instructions with quick search and effortless actions.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  flexWrap: 'wrap',
                  width: { xs: '100%', md: 'auto' }
                }}
              >
                <TextField
                  fullWidth
                  placeholder='Search templates'
                  size='small'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  sx={{
                    flex: 1,
                    minWidth: { xs: '100%', sm: '240px' },
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'background.paper',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon fontSize='small' color='action' />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    minHeight: 42,
                    minWidth: { xs: '100%', sm: 180 },
                    px: { sm: 3 },
                    boxShadow: '0 12px 24px rgba(33, 150, 243, 0.22)',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'
                        : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'
                  }}
                >
                  Add New Template
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Template Cards Grid */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 4
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
                    flex: '1 1 320px',
                    minWidth: { xs: '100%', sm: '280px' },
                    maxWidth: { md: '360px', lg: '380px' },
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? 'divider' : 'rgba(226, 232, 240, 0.8)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 10px 24px rgba(15, 23, 42, 0.32)'
                        : '0 14px 30px rgba(15, 23, 42, 0.12)',
                    transition: 'transform 0.28s ease, box-shadow 0.28s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background:
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(140deg, rgba(33, 150, 243, 0.12), rgba(144, 202, 249, 0.04) 46%, transparent 75%)'
                          : 'linear-gradient(140deg, rgba(33, 150, 243, 0.10), rgba(144, 202, 249, 0.06) 45%, transparent 78%)',
                      pointerEvents: 'none',
                      transition: 'opacity 0.28s ease',
                      opacity: 0.8
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: -60,
                      right: -60,
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      background:
                        theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.16)' : 'rgba(33, 150, 243, 0.18)',
                      transform: 'scale(0.65)',
                      transition: 'transform 0.28s ease, opacity 0.28s ease',
                      opacity: 0.65,
                      pointerEvents: 'none'
                    },
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.015)',
                      boxShadow:
                        theme.palette.mode === 'dark'
                          ? '0 22px 36px rgba(15, 23, 42, 0.48)'
                          : '0 26px 44px rgba(15, 23, 42, 0.18)',
                      '&::before': {
                        opacity: 1
                      },
                      '&::after': {
                        transform: 'scale(0.9)',
                        opacity: 0.9
                      }
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 3.25,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                          backgroundColor:
                            theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.12)' : 'rgba(33, 150, 243, 0.14)',
                          boxShadow:
                            theme.palette.mode === 'dark'
                              ? 'inset 0 0 0 1px rgba(33, 150, 243, 0.4)'
                              : 'inset 0 0 0 1px rgba(33, 150, 243, 0.24)'
                        }}
                      >
                        {(template.templateName || '?').charAt(0).toUpperCase()}
                      </Box>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{
                          fontSize: '0.8rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          fontWeight: 600
                        }}
                      >
                        Created {formatDate(template.createdAt)}
                      </Typography>
                    </Box>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: 'text.primary',
                        fontSize: '1.18rem',
                        transition: 'color 0.28s ease'
                      }}
                    >
                      {template.templateName}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.secondary',
                        mb: 2.5,
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        transition: 'color 0.28s ease',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '3.2rem'
                      }}
                    >
                      {template.templateText}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: 1.35,
                      px: 3,
                      pt: 2.25,
                      pb: 3,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      backgroundColor:
                        theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.08)'
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
                        fontWeight: 600,
                        borderRadius: 2,
                        borderColor: 'divider',
                        color: 'text.primary',
                        minHeight: 42,
                        transition: 'transform 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover',
                          transform: 'translateY(-2px)'
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
                        fontWeight: 600,
                        borderRadius: 2,
                        borderColor: 'divider',
                        color: 'text.primary',
                        minHeight: 42,
                        transition: 'transform 0.22s ease, border-color 0.22s ease, background-color 0.22s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='contained'
                      size='small'
                      startIcon={<DeleteIcon fontSize='small' />}
                      color='error'
                      onClick={() => handleDelete(template.id)}
                      sx={{
                        textTransform: 'none',
                        flex: 1,
                        fontWeight: 600,
                        borderRadius: 2,
                        minHeight: 42,
                        boxShadow: 'none',
                        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                        '&:hover': {
                          boxShadow: '0 12px 24px rgba(244, 67, 54, 0.28)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Delete
                    </Button>
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
