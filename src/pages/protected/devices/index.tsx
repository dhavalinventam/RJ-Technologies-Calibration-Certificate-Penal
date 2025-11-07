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
      id={`device-tabpanel-${index}`}
      aria-labelledby={`device-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

interface Device {
  id: string
  deviceName: string
  manufacturer: string
  model: string
  serialNumber: string
  tagNumber?: string
  terminalModel?: string
  maxCapacity?: string
  readability?: string
  verificationValue?: string
  status: string
  location?: string
  customer: string
}

const Devices = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample device data - replace with actual data from API
  const [devices, setDevices] = useState<Device[]>([])

  // Sample customers for dropdown
  const [customers] = useState([{ id: '1', name: 'amnel', company: 'amnel pharmacutical pvt ltd' }])

  // Form state for Add Device
  const [formData, setFormData] = useState({
    customer: '',
    deviceName: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    tagNumber: '',
    terminalModel: '',
    maxCapacity: '',
    readability: '',
    verificationValue: '',
    status: 'Active',
    location: ''
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

  const handleAddDevice = () => {
    // Add device logic here
    console.log('Adding device:', formData)
    // Reset form
    setFormData({
      customer: '',
      deviceName: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      tagNumber: '',
      terminalModel: '',
      maxCapacity: '',
      readability: '',
      verificationValue: '',
      status: 'Active',
      location: ''
    })
    // Switch to List Devices tab
    setTabValue(0)
  }

  const handleEdit = (device: Device) => {
    // Edit device logic here
    console.log('Editing device:', device)
  }

  const handleDelete = (deviceId: string) => {
    // Delete device logic here
    setDevices(prev => prev.filter(d => d.id !== deviceId))
  }

  const filteredDevices = devices.filter(
    device =>
      device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.customer.toLowerCase().includes(searchTerm.toLowerCase())
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
                Device Management
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Manage weighing instruments and calibration devices
              </Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label='device management tabs'
              sx={{
                minWidth: { xs: 300, sm: 'auto' },
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3
                  }
                }
              }}
            >
              <Tab
                label='List Device'
                sx={{
                  textTransform: 'none',
                  fontWeight: tabValue === 0 ? 600 : 400,
                  minHeight: 48,
                  px: { xs: 2, sm: 3 },
                  '&.Mui-selected': {
                    color: 'primary.main'
                  }
                }}
              />
              <Tab
                label='Add Device'
                sx={{
                  textTransform: 'none',
                  fontWeight: tabValue === 1 ? 600 : 400,
                  minHeight: 48,
                  px: { xs: 2, sm: 3 },
                  '&.Mui-selected': {
                    color: 'primary.main'
                  }
                }}
              />
            </Tabs>
          </Box>

          {/* Tab Panel: List Device */}
          <TabPanel value={tabValue} index={0}>
            {/* Search Bar */}
            <Box sx={{ maxWidth: 600, width: '100%', mb: 3 }}>
              <TextField
                fullWidth
                placeholder='Search by device name, manufacturer, model, serial number, or customer...'
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

            {/* Device Table */}
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflowX: 'auto',
                maxWidth: '100%'
              }}
            >
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Device Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Manufacturer</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Model</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Serial Number</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align='center' sx={{ py: 4 }}>
                        <Typography variant='body2' color='text.secondary'>
                          No devices found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDevices.map(device => (
                      <TableRow key={device.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{device.deviceName}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{device.manufacturer}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{device.model}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{device.serialNumber}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{device.customer}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{device.status}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{device.location || '-'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                            <Button
                              variant='outlined'
                              size='small'
                              startIcon={<EditIcon fontSize='small' />}
                              onClick={() => handleEdit(device)}
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
                              onClick={() => handleDelete(device.id)}
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
          </TabPanel>

          {/* Tab Panel: Add Device */}
          <TabPanel value={tabValue} index={1}>
            <div className='row'>
              {/* Customer Details Section */}
              <div className='col-12 col-md-12'>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    Customer Details
                  </Typography>
                  <div className='row'>
                    <div className='col-12 col-md-6'>
                      <FormControl fullWidth size='small' required sx={{ mb: 2 }}>
                        <InputLabel>Customer</InputLabel>
                        <Select
                          value={formData.customer}
                          label='Customer'
                          onChange={e => handleInputChange('customer', e.target.value)}
                        >
                          {customers.map(customer => (
                            <MenuItem key={customer.id} value={customer.name}>
                              {customer.name} - {customer.company}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </Box>
              </div>

              {/* Device Information Section */}
              <div className='col-12 col-md-12'>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    Device Information
                  </Typography>
                  <div className='row'>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Device Name'
                        required
                        size='small'
                        placeholder='e.g., Weighing Scale'
                        value={formData.deviceName}
                        onChange={e => handleInputChange('deviceName', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Manufacturer'
                        required
                        size='small'
                        placeholder='e.g., Mettler Toledo'
                        value={formData.manufacturer}
                        onChange={e => handleInputChange('manufacturer', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Model'
                        required
                        size='small'
                        placeholder='e.g., XS205'
                        value={formData.model}
                        onChange={e => handleInputChange('model', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Serial Number'
                        required
                        size='small'
                        placeholder='Unique serial number'
                        value={formData.serialNumber}
                        onChange={e => handleInputChange('serialNumber', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Tag Number'
                        size='small'
                        placeholder='Internal tag/ID'
                        value={formData.tagNumber}
                        onChange={e => handleInputChange('tagNumber', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Terminal Model'
                        size='small'
                        placeholder='Terminal model'
                        value={formData.terminalModel}
                        onChange={e => handleInputChange('terminalModel', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                  </div>
                </Box>
              </div>

              {/* Specifications Section */}
              <div className='col-12 col-md-12'>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    Specifications
                  </Typography>
                  <div className='row'>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Max Capacity'
                        size='small'
                        placeholder='e.g., 200g, 5kg'
                        value={formData.maxCapacity}
                        onChange={e => handleInputChange('maxCapacity', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Readability'
                        size='small'
                        placeholder='e.g., 0.01mg, 0.1g'
                        value={formData.readability}
                        onChange={e => handleInputChange('readability', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Verification Value'
                        size='small'
                        placeholder='Verification value'
                        value={formData.verificationValue}
                        onChange={e => handleInputChange('verificationValue', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                    <div className='col-12 col-md-6'>
                      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          label='Status'
                          onChange={e => handleInputChange('status', e.target.value)}
                        >
                          <MenuItem value='Active'>Active</MenuItem>
                          <MenuItem value='Inactive'>Inactive</MenuItem>
                          <MenuItem value='Maintenance'>Maintenance</MenuItem>
                          <MenuItem value='Retired'>Retired</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </Box>
              </div>

              {/* Location Section */}
              <div className='col-12 col-md-12'>
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    Location
                  </Typography>
                  <div className='row'>
                    <div className='col-12 col-md-6'>
                      <TextField
                        fullWidth
                        label='Location'
                        size='small'
                        placeholder='Device location'
                        value={formData.location}
                        onChange={e => handleInputChange('location', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </div>
                  </div>
                </Box>
              </div>

              {/* Action Buttons */}
              <div className='col-12 col-md-12'>
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
                    onClick={handleAddDevice}
                    sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                  >
                    Add Device
                  </Button>
                  <Button
                    variant='outlined'
                    size='medium'
                    endIcon={<ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
                    onClick={() => navigate('/certificates')}
                    sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                  >
                    Next: Calibration Module →
                  </Button>
                </Box>
              </div>
            </div>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  )
}

export default Devices
