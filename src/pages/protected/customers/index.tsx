import React, { useCallback, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 0 }}>{children}</Box>}
    </div>
  )
}

interface Customer {
  id: string
  name: string
  company: string
  location: string
  contactPerson: string
  mobile: string
  email: string
}

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

const secondaryButtonStyles = {
  textTransform: 'none',
  borderRadius: '999px',
  px: 3,
  py: 1.15,
  borderColor: 'rgba(148, 163, 184, 0.6)',
  color: SUBTEXT_COLOR,
  '&:hover': { borderColor: SUBTEXT_COLOR, backgroundColor: '#F3F4F6' }
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

const Customers = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample customer data - replace with actual data from API
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Amnel',
      company: 'Amnel Pharmaceutical Pvt Ltd',
      location: 'Ahmedabad, Gujarat',
      contactPerson: 'Urmil Patel',
      mobile: '9876543210',
      email: 'urmil.patel@amnel.com'
    },
    {
      id: '2',
      name: 'Globex Labs',
      company: 'Globex Laboratory Solutions',
      location: 'Vadodara, Gujarat',
      contactPerson: 'Rekha Sharma',
      mobile: '9825034567',
      email: 'rekha.sharma@globexlabs.in'
    },
    {
      id: '3',
      name: 'Vertex Pharma',
      company: 'Vertex Pharmaceuticals LLP',
      location: 'Mumbai, Maharashtra',
      contactPerson: 'Rohan Desai',
      mobile: '9898076543',
      email: 'rohan.desai@vertexpharma.com'
    },
    {
      id: '4',
      name: 'Everest Biotech',
      company: 'Everest Biotech Pvt Ltd',
      location: 'Surat, Gujarat',
      contactPerson: 'Nisha Shah',
      mobile: '9012304567',
      email: 'nisha.shah@everestbio.com'
    },
    {
      id: '5',
      name: 'Zenith Industries',
      company: 'Zenith Industrial Solutions',
      location: 'Pune, Maharashtra',
      contactPerson: 'Ajay Kulkarni',
      mobile: '9123456780',
      email: 'ajay.kulkarni@zenithind.in'
    }
  ])

  // Form state for Add Customer
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    address: '',
    contactPerson: '',
    mobileNumber: '',
    email: '',
    notes: ''
  })

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddCustomer = () => {
    // Add customer logic here
    console.log('Adding customer:', formData)
    // Reset form
    setFormData({
      customerName: '',
      companyName: '',
      country: 'India',
      state: '',
      city: '',
      pincode: '',
      address: '',
      contactPerson: '',
      mobileNumber: '',
      email: '',
      notes: ''
    })
    // Switch to List Customers tab
    setTabValue(0)
  }

  const handleEdit = (customer: Customer) => {
    // Edit customer logic here
    console.log('Editing customer:', customer)
  }

  const handleDelete = (customerId: string) => {
    // Delete customer logic here
    setCustomers(prev => prev.filter(c => c.id !== customerId))
  }

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            {/* Page Header */}
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
                  sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.5rem', md: '1.8rem' }, mb: 0.5 }}
                >
                  Customer Management
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Manage customer records for calibration certificates
                </Typography>
              </Box>
            </Paper>

            {/* Tabs */}
            <Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label='customer management tabs'
                variant='scrollable'
                allowScrollButtonsMobile
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                  minWidth: { xs: 300, sm: 'auto' },
                  // mb: 3,
                  '& .MuiTabs-scrollButtons.Mui-disabled': {
                    opacity: 0.35
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: 48,
                    fontWeight: 600,
                    borderRadius: '999px',
                    px: { xs: 2.5, md: 3.5 },
                    mr: 1,
                    color: SUBTEXT_COLOR,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.08)'
                    }
                  },
                  '& .MuiTab-root.Mui-selected': {
                    color: PRIMARY_COLOR,
                    backgroundColor: 'rgba(37, 99, 235, 0.12)'
                  }
                }}
              >
                <Tab label='List Customers' />
                <Tab label='Add Customer' />
              </Tabs>
            </Box>

            {/* Tab Panel: List Customers */}
            <TabPanel value={tabValue} index={0}>
              <Paper sx={{ ...cardBaseStyles, mb: 3, p: { xs: 2, md: 2.5 } }}>
                <TextField
                  fullWidth
                  placeholder='Search by name, company, city, or contact person...'
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
                        {['Name', 'Company', 'Location', 'Contact Person', 'Mobile', 'Email', 'Actions'].map(header => (
                          <TableCell key={header} sx={{ ...tableHeaderCellStyles }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align='center' sx={{ py: 4, color: SUBTEXT_COLOR }}>
                            No customers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer, index) => (
                          <TableRow
                            key={customer.id}
                            hover
                            sx={{
                              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                              transition: 'background-color 0.2s ease',
                              '&:hover': { backgroundColor: '#EFF6FF' }
                            }}
                          >
                            <TableCell sx={{ ...tableCellStyles, fontWeight: 600 }}>{customer.name}</TableCell>
                            <TableCell sx={{ ...tableCellStyles }}>{customer.company}</TableCell>
                            <TableCell sx={{ ...tableCellStyles }}>{customer.location}</TableCell>
                            <TableCell sx={{ ...tableCellStyles }}>{customer.contactPerson}</TableCell>
                            <TableCell sx={{ ...tableCellStyles }}>{customer.mobile}</TableCell>
                            <TableCell sx={{ ...tableCellStyles }}>{customer.email}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title='Edit' arrow>
                                  <IconButton
                                    size='small'
                                    onClick={() => handleEdit(customer)}
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
                                    onClick={() => handleDelete(customer.id)}
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
            </TabPanel>

            {/* Tab Panel: Add Customer */}
            <TabPanel value={tabValue} index={1}>
              <Paper sx={{ ...cardBaseStyles }}>
                <Typography variant='h6' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 0.5 }}>
                  Customer Details
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 3 }}>
                  Capture key contact and location information for the customer.
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }
                  }}
                >
                  <TextField
                    fullWidth
                    label='Customer Name'
                    required
                    size='small'
                    value={formData.customerName}
                    onChange={e => handleInputChange('customerName', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    label='Company Name'
                    required
                    size='small'
                    value={formData.companyName}
                    onChange={e => handleInputChange('companyName', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    label='Contact Person'
                    size='small'
                    value={formData.contactPerson}
                    onChange={e => handleInputChange('contactPerson', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    label='Mobile Number'
                    size='small'
                    placeholder='10-digit number'
                    value={formData.mobileNumber}
                    onChange={e => handleInputChange('mobileNumber', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    label='Email'
                    size='small'
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <FormControl fullWidth size='small' required sx={{ ...inputStyles }}>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={formData.country}
                      label='Country'
                      onChange={e => handleInputChange('country', e.target.value)}
                    >
                      <MenuItem value='India'>India</MenuItem>
                      <MenuItem value='USA'>USA</MenuItem>
                      <MenuItem value='UK'>UK</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label='State'
                    required
                    size='small'
                    placeholder='Enter state'
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    label='City'
                    required
                    size='small'
                    placeholder='Enter city'
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    label='Pincode'
                    required
                    size='small'
                    placeholder='Enter pincode'
                    value={formData.pincode}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    label='Address'
                    required
                    multiline
                    rows={3}
                    size='small'
                    placeholder='Enter complete address'
                    value={formData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                    sx={{ ...inputStyles, gridColumn: { xs: '1 / -1', md: 'span 2' } }}
                  />
                  <TextField
                    fullWidth
                    label='Notes'
                    multiline
                    rows={3}
                    size='small'
                    placeholder='Enter any additional notes'
                    value={formData.notes}
                    onChange={e => handleInputChange('notes', e.target.value)}
                    sx={{ ...inputStyles, gridColumn: { xs: '1 / -1', md: 'span 1' } }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'stretch', sm: 'space-between' },
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mt: 3
                  }}
                >
                  <Button
                    onClick={handleAddCustomer}
                    variant='contained'
                    sx={{ ...primaryButtonStyles, width: { xs: '100%', sm: 'auto' } }}
                  >
                    Add Customer
                  </Button>
                  <Button
                    variant='outlined'
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/devices')}
                    sx={{
                      ...secondaryButtonStyles,
                      width: { xs: '100%', sm: 'auto' },
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      '&:hover': { borderColor: '#1D4ED8', backgroundColor: 'rgba(37, 99, 235, 0.08)' }
                    }}
                  >
                    Next: Device Module →
                  </Button>
                </Box>
              </Paper>

              <Box sx={{ width: '100%' }}></Box>
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Customers
