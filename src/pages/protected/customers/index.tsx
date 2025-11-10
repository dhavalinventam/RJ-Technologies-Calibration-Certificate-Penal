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
  InputLabel
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
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
          <Box>
            {/* Page Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant='h5' component='h1' sx={{ fontWeight: 700 }}>
                  Customer Management
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Manage customer records for calibration certificates
                </Typography>
              </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label='customer management tabs'
                textColor='inherit'
                sx={{
                  minWidth: { xs: 300, sm: 'auto' },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    backgroundColor: 'primary.main'
                  },
                  '& .MuiTab-root': {
                    fontWeight: 500
                  }
                }}
              >
                <Tab label='List Customers' sx={{ textTransform: 'none', minHeight: 48, px: { xs: 2, sm: 3 } }} />
                <Tab label='Add Customer' sx={{ textTransform: 'none', minHeight: 48, px: { xs: 2, sm: 3 } }} />
              </Tabs>
            </Box>

            {/* Tab Panel: List Customers */}
            <TabPanel value={tabValue} index={0}>
              <Paper
                sx={{
                  borderRadius: 2,
                  boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.08)',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <TextField
                    fullWidth
                    placeholder='Search by name, company, city, or contact person...'
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
                    sx={{ maxWidth: 640, width: '100%' }}
                  />
                </Box>

                {/* Customer Table */}
                <TableContainer sx={{ maxHeight: 480 }}>
                  <Table stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Company</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Contact Person</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Mobile</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align='center' sx={{ py: 4 }}>
                            <Typography variant='body2' color='text.secondary'>
                              No customers found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map(customer => (
                          <TableRow key={customer.id} hover>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.name}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.company}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.location}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.contactPerson}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.mobile}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer.email}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                                <Button
                                  variant='outlined'
                                  size='small'
                                  startIcon={<EditIcon fontSize='small' />}
                                  onClick={() => handleEdit(customer)}
                                  sx={{
                                    textTransform: 'none',
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
                                  onClick={() => handleDelete(customer.id)}
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
              <div className='row'>
                <div className='col-12 col-md-12'>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      Customer Details
                    </Typography>

                    <div className='row'>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='Customer Name'
                          required
                          size='small'
                          value={formData.customerName}
                          onChange={e => handleInputChange('customerName', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='Company Name'
                          required
                          size='small'
                          value={formData.companyName}
                          onChange={e => handleInputChange('companyName', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='Contact Person'
                          size='small'
                          value={formData.contactPerson}
                          onChange={e => handleInputChange('contactPerson', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='Mobile Number'
                          size='small'
                          placeholder='10-digit number'
                          value={formData.mobileNumber}
                          onChange={e => handleInputChange('mobileNumber', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='Email'
                          size='small'
                          type='email'
                          value={formData.email}
                          onChange={e => handleInputChange('email', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <FormControl fullWidth size='small' required sx={{ mb: 2 }}>
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
                      </div>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='State'
                          required
                          size='small'
                          placeholder='Enter state'
                          value={formData.state}
                          onChange={e => handleInputChange('state', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='City'
                          required
                          size='small'
                          placeholder='Enter city'
                          value={formData.city}
                          onChange={e => handleInputChange('city', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <TextField
                          fullWidth
                          label='Pincode'
                          required
                          size='small'
                          placeholder='Enter pincode'
                          value={formData.pincode}
                          onChange={e => handleInputChange('pincode', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-6'>
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
                          sx={{ mb: 2 }}
                        />
                      </div>
                      <div className='col-12 col-md-6'>
                        <TextField
                          fullWidth
                          label='Notes'
                          multiline
                          rows={3}
                          size='small'
                          placeholder='Enter any additional notes'
                          value={formData.notes}
                          onChange={e => handleInputChange('notes', e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      </div>
                    </div>
                  </Box>
                </div>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'stretch', sm: 'space-between' },
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'row' },
                    mt: 2
                  }}
                >
                  <Button
                    variant='contained'
                    size='medium'
                    onClick={handleAddCustomer}
                    sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                  >
                    Add Customer
                  </Button>
                  <Button
                    variant='outlined'
                    size='medium'
                    endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                    onClick={() => navigate('/devices')}
                    sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                  >
                    Next: Device Module →
                  </Button>
                </Box>
              </div>

              <Box sx={{ width: '100%' }}></Box>
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Customers
