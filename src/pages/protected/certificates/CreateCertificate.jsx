import { useCallback, useMemo, useState } from 'react'
import { Box, Typography, Button, TextField, LinearProgress, useTheme, useMediaQuery } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'
import './CreateCertificate.css'
import { useNavigate } from 'react-router-dom'

const steps = [
  'Certificate Number',
  'Customer',
  'Device',
  'Procedure Template',
  'Linearity',
  'Eccentricity',
  'Repeatability',
  'Uncertainty',
  'Reference Weights',
  'Engineer & Signature',
  'Preview & Generate'
]

const CreateCertificate = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()

  const [activeStep, setActiveStep] = useState(0)

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep])

  // Editable values (initial examples)
  const [certificateNo, setCertificateNo] = useState('RJ-2511-018')
  const [draftId, setDraftId] = useState('09262b61-2bc5-447d-b5de-6d4531392a74')

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>
      <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />

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
        <Header
          onToggleSidebar={handleToggleSidebar}
          onToggleTheme={toggleTheme}
          mode={mode}
          sidebarOpen={sidebarOpen}
        />

        <Box
          className='contain_main_div'
          sx={{
            flex: 1,
            position: 'relative',
            zIndex: '1',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.01)'
          }}
        >
          <Box sx={{ mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
            {/* Top header */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <Box>
                <Typography
                  variant='h4'
                  component='h1'
                  sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                >
                  Create Calibration Certificate
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem' }}>
                  Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
                </Typography>
              </Box>

              <Button
                color='inherit'
                variant='outlined'
                sx={{
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'text.secondary',
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => navigate('/certificates')}
              >
                Cancel
              </Button>
            </Box>

            {/* Progress bar */}
            <Box sx={{ mb: 3 }}>
              <LinearProgress
                variant='determinate'
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999
                  }
                }}
              />
            </Box>

            {/* Stepper */}
            <Box className='cc_stepper_container' sx={{ mb: 4 }}>
              <Box className='cc_steps_scroller'>
                {steps.map((label, index) => (
                  <Box
                    key={label}
                    className={`cc_step_chip ${index === activeStep ? 'active' : ''}`}
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                  >
                    <span className='cc_step_label'>{label}</span>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Step content */}
            {activeStep === 0 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 3 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Certificate Number
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem' }}>
                    Auto-generated certificate number
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography
                      variant='body2'
                      component='label'
                      sx={{
                        display: 'block',
                        fontWeight: 500,
                        mb: 0.75,
                        color: 'text.primary',
                        fontSize: '0.875rem'
                      }}
                    >
                      Certificate Number
                    </Typography>
                    <TextField
                      value={certificateNo}
                      onChange={e => setCertificateNo(e.target.value)}
                      fullWidth
                      size='small'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor:
                            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          '&:hover': {
                            backgroundColor:
                              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'transparent'
                          }
                        }
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant='body2'
                      component='label'
                      sx={{
                        display: 'block',
                        fontWeight: 500,
                        mb: 0.75,
                        color: 'text.primary',
                        fontSize: '0.875rem'
                      }}
                    >
                      Draft ID
                    </Typography>
                    <TextField
                      value={draftId}
                      onChange={e => setDraftId(e.target.value)}
                      fullWidth
                      size='small'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor:
                            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          '&:hover': {
                            backgroundColor:
                              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'transparent'
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className='cc_card'>
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, fontSize: '1.125rem' }}>
                  {steps[activeStep]}
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem' }}>
                  Content for this step will appear here.
                </Typography>
              </Box>
            )}

            {/* Footer buttons */}
            <Box className='cc_footer_actions'>
              <Button
                variant='outlined'
                color='inherit'
                disabled={activeStep === 0}
                onClick={() => setActiveStep(s => Math.max(0, s - 1))}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: '100px',
                  borderColor: 'divider',
                  '&:hover:not(:disabled)': {
                    borderColor: 'text.secondary',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Previous
              </Button>
              <Button
                variant='contained'
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: '100px',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[4]
                  }
                }}
                endIcon={<ArrowForwardIcon fontSize='small' />}
                onClick={() => setActiveStep(s => Math.min(steps.length - 1, s + 1))}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CreateCertificate
