import React, { useCallback, useMemo, useState } from 'react'
import { Box, Typography, Button, Paper, IconButton, useTheme, useMediaQuery } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'
import { Customer, CUSTOMER_STORAGE_KEY, DEFAULT_CUSTOMERS, normalizeCustomer } from './customerData'

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

const loadCustomerById = (id: string): Customer | null => {
  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (stored) {
      const parsed: Customer[] = JSON.parse(stored)
      const found = parsed.find(customer => customer.id === id)
      if (found) {
        return normalizeCustomer(found)
      }
    }
  } catch (error) {
    console.error('Failed to load customers', error)
  }
  const fallback = DEFAULT_CUSTOMERS.find(customer => customer.id === id)
  return fallback ? normalizeCustomer(fallback) : null
}

const ViewCustomer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const customer = useMemo(() => (id ? loadCustomerById(id) : null), [id])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  if (!customer) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          Customer not found. It may have been removed or the link is incorrect.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row', backgroundColor: PAGE_BACKGROUND }}>
      <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />
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
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
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
                  onClick={() => navigate('/customers')}
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
                    Customer Details
                  </Typography>
                  <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                    View customer profile and contact information
                  </Typography>
                </Box>
              </Box>
              <Button
                variant='contained'
                startIcon={<EditIcon />}
                onClick={() => navigate(`/customers/${customer.id}/edit`)}
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
                Edit Customer
              </Button>
            </Paper>

            <Paper sx={{ ...cardBaseStyles }}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
                Summary
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
                Core details for this customer record.
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }
                }}
              >
                {[
                  { label: 'Customer Name', value: customer.name },
                  { label: 'Company', value: customer.company },
                  { label: 'Contact Person', value: customer.contactPerson },
                  { label: 'Primary Location', value: customer.location },
                  { label: 'City', value: customer.city },
                  { label: 'State/Province', value: customer.state },
                  { label: 'Country', value: customer.country },
                  { label: 'Postal Code', value: customer.zip }
                ].map(detail => (
                  <Box
                    key={detail.label}
                    sx={{
                      border: CARD_BORDER,
                      borderRadius: 2,
                      backgroundColor: '#F9FAFB',
                      p: 2,
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                    }}
                  >
                    <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                      {detail.label}
                    </Typography>
                    <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                      {detail.value || '—'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper sx={{ ...cardBaseStyles }}>
              <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 1 }}>
                Address & Contact Details
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
                Reference address and channels to reach this customer.
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
                }}
              >
                {[
                  { label: 'Street Address', value: customer.address },
                  { label: 'Email', value: customer.email },
                  { label: 'Phone', value: customer.mobile }
                ].map(detail => (
                  <Box
                    key={detail.label}
                    sx={{
                      border: CARD_BORDER,
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      p: 2,
                      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                    }}
                  >
                    <Typography variant='subtitle2' sx={{ color: SUBTEXT_COLOR, fontWeight: 500, mb: 0.5 }}>
                      {detail.label}
                    </Typography>
                    <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                      {detail.value && detail.value.toString().trim().length > 0 ? detail.value : '—'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewCustomer
