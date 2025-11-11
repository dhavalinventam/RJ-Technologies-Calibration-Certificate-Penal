import React, { useCallback, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
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

  const PRIMARY_COLOR = '#2563EB'
  const PAGE_BACKGROUND = '#F8FAFC'
  const TITLE_COLOR = '#111827'
  const SUBTEXT_COLOR = '#6B7280'
  const TABLE_TEXT_COLOR = '#1F2937'
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
      borderRadius: '12px',
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

  const tableHeaderCellStyles = {
    fontWeight: 600,
    color: TABLE_TEXT_COLOR,
    fontSize: '0.9rem',
    py: 1.5,
    whiteSpace: 'nowrap'
  }

  const tableCellStyles = {
    color: TABLE_TEXT_COLOR,
    fontSize: '0.9rem',
    whiteSpace: 'nowrap'
  }

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
            },
            fontFamily: 'Inter, "Open Sans", sans-serif'
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
              <Box>
                <Typography
                  variant='h5'
                  component='h1'
                  sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 0.5 }}
                >
                  Procedure Templates
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Manage reusable procedure instructions
                </Typography>
              </Box>
              <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{ ...primaryButtonStyles, width: { xs: '100%', sm: 'auto' } }}
              >
                Add Template
              </Button>
            </Paper>

            <Paper sx={{ ...cardBaseStyles, p: { xs: 2, md: 2.5 } }}>
              <TextField
                fullWidth
                placeholder='Search by name or description...'
                size='small'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: '#9CA3AF' }} />
                    </InputAdornment>
                  )
                }}
                sx={{ ...inputStyles }}
              />
            </Paper>

            <Paper sx={{ ...cardBaseStyles, p: 0, overflow: 'hidden' }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 960 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                      {['Template Name', 'Description', 'Created', 'Updated', 'Actions'].map(header => (
                        <TableCell key={header} sx={{ ...tableHeaderCellStyles }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align='center' sx={{ py: 4, color: SUBTEXT_COLOR }}>
                          No templates found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTemplates.map((template, index) => (
                        <TableRow
                          key={template.id}
                          hover
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                            transition: 'background-color 0.2s ease',
                            '&:hover': { backgroundColor: '#EFF6FF' }
                          }}
                        >
                          <TableCell sx={{ ...tableCellStyles, fontWeight: 600 }}>{template.templateName}</TableCell>
                          <TableCell sx={{ ...tableCellStyles, maxWidth: 420 }}>
                            <Typography
                              component='span'
                              variant='body2'
                              sx={{
                                color: SUBTEXT_COLOR,
                                display: 'inline-block',
                                maxWidth: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {template.templateText}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>{formatDate(template.createdAt)}</TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>
                            {template.updatedAt ? formatDate(template.updatedAt) : '—'}
                          </TableCell>
                          <TableCell sx={{ ...tableCellStyles }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title='View' arrow>
                                <IconButton
                                  size='small'
                                  onClick={() => handleView(template)}
                                  sx={{
                                    color: PRIMARY_COLOR,
                                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.16)' }
                                  }}
                                >
                                  <VisibilityIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Edit' arrow>
                                <IconButton
                                  size='small'
                                  onClick={() => handleEdit(template)}
                                  sx={{
                                    color: '#4B5563',
                                    backgroundColor: '#F3F4F6',
                                    '&:hover': { backgroundColor: '#E5E7EB' }
                                  }}
                                >
                                  <EditIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Delete' arrow>
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() => handleDelete(template.id)}
                                  sx={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.16)' }
                                  }}
                                >
                                  <DeleteIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProcedureTemplates
