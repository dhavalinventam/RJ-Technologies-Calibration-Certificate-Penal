import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Typography, TextField, Button, Paper, IconButton, useTheme, useMediaQuery } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'
import { Customer, CUSTOMER_STORAGE_KEY, DEFAULT_CUSTOMERS, normalizeCustomer, saveCustomers } from './customerData'

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

const composeLocation = (city: string, state: string, country: string) => {
  return [city, state, country]
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .join(', ')
}

const loadCustomer = (id: string): Customer | null => {
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
    console.error('Failed to load customer from storage', error)
  }
  const fallback = DEFAULT_CUSTOMERS.find(customer => customer.id === id)
  return fallback ? normalizeCustomer(fallback) : null
}

const EditCustomer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const customer = useMemo(() => (id ? loadCustomer(id) : null), [id])

  const [formState, setFormState] = useState({
    name: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    contactPerson: '',
    mobile: '',
    email: ''
  })

  useEffect(() => {
    if (customer) {
      setFormState({
        name: customer.name,
        company: customer.company,
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip || '',
        country: customer.country || 'India',
        contactPerson: customer.contactPerson,
        mobile: customer.mobile,
        email: customer.email
      })
    }
  }, [customer])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  if (!customer || !id) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant='h6' color='text.secondary'>
          Customer not found.
        </Typography>
      </Box>
    )
  }

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const trimmedCity = formState.city.trim()
    const trimmedState = formState.state.trim()
    const trimmedCountry = formState.country.trim() || 'India'

    const updatedCustomer: Customer = {
      id,
      name: formState.name.trim() || customer.name,
      company: formState.company.trim() || '—',
      location: composeLocation(trimmedCity, trimmedState, trimmedCountry),
      contactPerson: formState.contactPerson.trim() || '—',
      mobile: formState.mobile.trim() || '—',
      email: formState.email.trim() || '—',
      address: formState.address.trim(),
      city: trimmedCity,
      state: trimmedState,
      zip: formState.zip.trim(),
      country: trimmedCountry
    }

    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
      let next: Customer[] = []
      if (stored) {
        const parsed: Customer[] = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          next = parsed.map(item => (item.id === id ? updatedCustomer : item))
        }
      }

      if (next.length === 0) {
        next = DEFAULT_CUSTOMERS.map(item => (item.id === id ? updatedCustomer : item))
      }

      saveCustomers(next)
      navigate('/customers', { replace: true })
    } catch (error) {
      console.error('Failed to update customer', error)
    }
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
                    Edit Customer
                  </Typography>
                  <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                    Update customer contact and company details
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant='outlined'
                  color='inherit'
                  onClick={() => navigate('/customers')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '999px',
                    px: 3,
                    py: 1.15,
                    borderColor: 'rgba(148, 163, 184, 0.6)',
                    color: SUBTEXT_COLOR,
                    '&:hover': { borderColor: SUBTEXT_COLOR, backgroundColor: '#F3F4F6' }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={handleSave}
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
                  Save Changes
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ ...cardBaseStyles, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 0.5 }}>
                  Customer Information
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Keep the customer data accurate for certificate references.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 2.5,
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }
                }}
              >
                <TextField
                  label='Customer Name'
                  value={formState.name}
                  onChange={event => handleChange('name', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='Company Name'
                  value={formState.company}
                  onChange={event => handleChange('company', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='Contact Person'
                  value={formState.contactPerson}
                  onChange={event => handleChange('contactPerson', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='Mobile Number'
                  value={formState.mobile}
                  onChange={event => handleChange('mobile', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='Email Address'
                  value={formState.email}
                  onChange={event => handleChange('email', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='Country'
                  value={formState.country}
                  onChange={event => handleChange('country', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='State / Province'
                  value={formState.state}
                  onChange={event => handleChange('state', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='City'
                  value={formState.city}
                  onChange={event => handleChange('city', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='Postal / Zip Code'
                  value={formState.zip}
                  onChange={event => handleChange('zip', event.target.value)}
                  fullWidth
                  size='small'
                  sx={inputStyles}
                />
                <TextField
                  label='Street Address'
                  value={formState.address}
                  onChange={event => handleChange('address', event.target.value)}
                  fullWidth
                  size='small'
                  sx={{ ...inputStyles, gridColumn: { md: '1 / span 3' } }}
                  multiline
                  minRows={2}
                  inputProps={{ style: { resize: 'vertical' } }}
                  FormHelperTextProps={{ sx: { mt: 0.5 } }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default EditCustomer
