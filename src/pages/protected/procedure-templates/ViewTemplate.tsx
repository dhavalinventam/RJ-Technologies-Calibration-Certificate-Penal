import React, { useCallback, useState } from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, Paper, IconButton } from '@mui/material'
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
            // p: { xs: 2, md: 3 },
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
                    Template Details
                  </Typography>
                  <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                    View template content and metadata
                  </Typography>
                </Box>
              </Box>
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
                Edit Template
              </Button>
            </Paper>

            <Paper sx={{ ...cardBaseStyles }}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
                Summary
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
                Key metadata for this procedure template.
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }
                }}
              >
                <Box sx={{ border: CARD_BORDER, borderRadius: 2, backgroundColor: '#F9FAFB', p: 2 }}>
                  <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                    Template Name
                  </Typography>
                  <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                    {template.templateName}
                  </Typography>
                </Box>
                <Box sx={{ border: CARD_BORDER, borderRadius: 2, backgroundColor: '#F9FAFB', p: 2 }}>
                  <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                    Created On
                  </Typography>
                  <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                    {template.createdAt}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: CARD_BORDER,
                    borderRadius: 2,
                    backgroundColor: '#FFFFFF',
                    p: 2,
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                  }}
                >
                  <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                    Last Updated
                  </Typography>
                  <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                    {template.updatedAt || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ ...cardBaseStyles }}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
                Procedure Content
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
                Review the full text of the procedure template.
              </Typography>
              <Paper
                variant='outlined'
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  backgroundColor: '#F9FAFB',
                  p: { xs: 2.5, md: 3 },
                  minHeight: 200,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  color: VALUE_COLOR,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                }}
              >
                {template.templateText || 'No template content available.'}
              </Paper>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewTemplate
