import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'
import {
  Device,
  defaultDevices,
  LinearityRow,
  EccentricityData,
  RepeatabilityData,
  RepeatabilityMeasurement,
  UncertaintyData
} from './deviceData'

const PRIMARY_COLOR = '#2563EB'
const PAGE_BACKGROUND = '#F8FAFC'
const TITLE_COLOR = '#111827'
const SUBTEXT_COLOR = '#6B7280'
const TABLE_TEXT_COLOR = '#1F2937'
const CARD_RADIUS = '12px'
const CARD_BORDER = '1px solid rgba(148, 163, 184, 0.25)'
const CARD_SHADOW = '0 1px 3px rgba(15, 23, 42, 0.08)'

const ECCENTRICITY_POSITIONS = [
  { key: 'center', label: 'Center' },
  { key: 'leftFront', label: 'Left Front' },
  { key: 'leftRear', label: 'Left Rear' },
  { key: 'rightRear', label: 'Right Rear' },
  { key: 'rightFront', label: 'Right Front' }
] as const

const UNCERTAINTY_TABLE_ONE_COLUMNS = ['xi', '0 kg', '20 kg', '50 kg', '70 kg'] as const
const UNCERTAINTY_TABLE_TWO_COLUMNS = ['xi', '100 kg', '120 kg', '150 kg', 'N/A'] as const

const createEmptyLinearityRow = (): LinearityRow => ({
  nominalValue: '',
  reading: '',
  error: '',
  allowableError: '',
  withinTolerance: ''
})

const createInitialLinearityRows = (): LinearityRow[] => Array.from({ length: 5 }, createEmptyLinearityRow)

const createEmptyRepeatabilityMeasurement = (): RepeatabilityMeasurement => ({
  withoutTestWeight: '',
  withTestWeight: '',
  asFound: ''
})

const createInitialRepeatabilityData = (): RepeatabilityData => ({
  testWeight: '',
  measurements: Array.from({ length: 5 }, createEmptyRepeatabilityMeasurement),
  deviation: '',
  allowableError: '',
  withinTolerance: ''
})

const createDefaultEccentricityData = (): EccentricityData => ({
  testWeight: '',
  positions: {
    center: { displayedValue: '', deviation: '' },
    leftFront: { displayedValue: '', deviation: '' },
    leftRear: { displayedValue: '', deviation: '' },
    rightRear: { displayedValue: '', deviation: '' },
    rightFront: { displayedValue: '', deviation: '' }
  },
  maximumDeviation: '',
  allowableDeviation: '',
  withinTolerance: ''
})

const createDefaultUncertaintyData = (): UncertaintyData => ({
  tableOne: {
    xi: '',
    '0 kg': '',
    '20 kg': '',
    '50 kg': '',
    '70 kg': ''
  },
  tableTwo: {
    xi: '',
    '100 kg': '',
    '120 kg': '',
    '150 kg': '',
    'N/A': ''
  }
})

const isValidDeviceRecord = (device: any): device is Device => {
  if (!device) return false
  const hasBasicFields =
    typeof device.id === 'string' &&
    typeof device.deviceName === 'string' &&
    typeof device.manufacturer === 'string' &&
    typeof device.model === 'string' &&
    typeof device.serialNumber === 'string' &&
    typeof device.customer === 'string'

  const hasLinearity =
    Array.isArray(device.linearityRows) &&
    device.linearityRows.every(
      (row: any) =>
        row &&
        typeof row.nominalValue === 'string' &&
        typeof row.reading === 'string' &&
        typeof row.error === 'string' &&
        typeof row.allowableError === 'string' &&
        typeof row.withinTolerance === 'string'
    )

  const repeatability = device.repeatabilityData
  const hasRepeatability =
    repeatability &&
    typeof repeatability.testWeight === 'string' &&
    typeof repeatability.deviation === 'string' &&
    typeof repeatability.allowableError === 'string' &&
    typeof repeatability.withinTolerance === 'string' &&
    Array.isArray(repeatability.measurements) &&
    repeatability.measurements.every(
      (item: any) =>
        item &&
        typeof item.withoutTestWeight === 'string' &&
        typeof item.withTestWeight === 'string' &&
        typeof item.asFound === 'string'
    )

  const eccentricity = device.eccentricityData
  const hasEccentricity =
    eccentricity &&
    typeof eccentricity.testWeight === 'string' &&
    eccentricity.positions &&
    ['center', 'leftFront', 'leftRear', 'rightRear', 'rightFront'].every(
      key =>
        eccentricity.positions[key] &&
        typeof eccentricity.positions[key].displayedValue === 'string' &&
        typeof eccentricity.positions[key].deviation === 'string'
    ) &&
    typeof eccentricity.maximumDeviation === 'string' &&
    typeof eccentricity.allowableDeviation === 'string' &&
    typeof eccentricity.withinTolerance === 'string'

  const uncertainty = device.uncertaintyData
  const hasUncertainty =
    uncertainty &&
    uncertainty.tableOne &&
    uncertainty.tableTwo &&
    UNCERTAINTY_TABLE_ONE_COLUMNS.every(column => typeof uncertainty.tableOne[column] === 'string') &&
    UNCERTAINTY_TABLE_TWO_COLUMNS.every(column => typeof uncertainty.tableTwo[column] === 'string')

  return hasBasicFields && hasLinearity && hasRepeatability && hasEccentricity && hasUncertainty
}

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

const Devices = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

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
    location: ''
  })
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null)
  const [linearityRows, setLinearityRows] = useState<LinearityRow[]>(createInitialLinearityRows())
  const [linearityRowsToAdd, setLinearityRowsToAdd] = useState('1')
  const [eccentricityData, setEccentricityData] = useState<EccentricityData>(createDefaultEccentricityData())
  const [repeatabilityData, setRepeatabilityData] = useState<RepeatabilityData>(createInitialRepeatabilityData())
  const [repeatabilityRowsToAdd, setRepeatabilityRowsToAdd] = useState('1')
  const [uncertaintyData, setUncertaintyData] = useState<UncertaintyData>(createDefaultUncertaintyData())

  useEffect(() => {
    try {
      const storedDevices = localStorage.getItem('devices')
      if (storedDevices) {
        const parsed = JSON.parse(storedDevices)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidDeviceRecord)) {
          setDevices(parsed)
          return
        }
      }
      setDevices(defaultDevices)
    } catch (error) {
      console.error('Failed to load devices:', error)
      setDevices(defaultDevices)
    }
  }, [])

  useEffect(() => {
    if (devices.length > 0) {
      localStorage.setItem('devices', JSON.stringify(devices))
    } else {
      localStorage.removeItem('devices')
    }
  }, [devices])

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

  const handleLinearityChange = (index: number, field: string, value: string) => {
    setLinearityRows(prev => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)))
  }

  const handleAddLinearityRows = () => {
    const parsed = parseInt(linearityRowsToAdd, 10)
    const count = Number.isFinite(parsed) && parsed > 0 ? parsed : 1
    const newRows = Array.from({ length: count }, createEmptyLinearityRow)
    setLinearityRows(prev => [...prev, ...newRows])
    setLinearityRowsToAdd('1')
  }

  const handleRemoveLinearityRow = (index: number) => {
    setLinearityRows(prev => (prev.length > 5 ? prev.filter((_, rowIndex) => rowIndex !== index) : prev))
  }

  const handleEccentricityChange = (
    field: 'testWeight' | 'maximumDeviation' | 'allowableDeviation' | 'withinTolerance',
    value: string
  ) => {
    setEccentricityData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEccentricityPositionChange = (
    position: keyof typeof eccentricityData.positions,
    field: 'displayedValue' | 'deviation',
    value: string
  ) => {
    setEccentricityData(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        [position]: {
          ...prev.positions[position],
          [field]: value
        }
      }
    }))
  }

  const handleRepeatabilityChange = (
    field: 'testWeight' | 'deviation' | 'allowableError' | 'withinTolerance',
    value: string
  ) => {
    setRepeatabilityData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRepeatabilityRowChange = (index: number, field: keyof RepeatabilityMeasurement, value: string) => {
    setRepeatabilityData(prev => ({
      ...prev,
      measurements: prev.measurements.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row))
    }))
  }

  const handleAddRepeatabilityRows = () => {
    const parsed = parseInt(repeatabilityRowsToAdd, 10)
    const count = Number.isFinite(parsed) && parsed > 0 ? parsed : 1
    const newRows = Array.from({ length: count }, createEmptyRepeatabilityMeasurement)
    setRepeatabilityData(prev => ({
      ...prev,
      measurements: [...prev.measurements, ...newRows]
    }))
    setRepeatabilityRowsToAdd('1')
  }

  const handleRemoveRepeatabilityRow = (index: number) => {
    setRepeatabilityData(prev => ({
      ...prev,
      measurements:
        prev.measurements.length > 5 ? prev.measurements.filter((_, rowIndex) => rowIndex !== index) : prev.measurements
    }))
  }

  const handleUncertaintyChange = <T extends keyof UncertaintyData>(
    table: T,
    column: keyof UncertaintyData[T],
    value: string
  ) => {
    setUncertaintyData(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        [column]: value
      }
    }))
  }

  const renderUncertaintyTableOne = () => (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          component='table'
          sx={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            minWidth: 720
          }}
        >
          <Box component='thead'>
            <Box component='tr'>
              <Box
                component='th'
                sx={{
                  backgroundColor: '#F9FAFB',
                  color: '#111827',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  minWidth: 160
                }}
              >
                Loads Applied
              </Box>
              {UNCERTAINTY_TABLE_ONE_COLUMNS.map(column => (
                <Box
                  component='th'
                  key={column}
                  sx={{
                    backgroundColor: '#F9FAFB',
                    color: '#111827',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '12px 16px',
                    textAlign: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    minWidth: 140
                  }}
                >
                  {column}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component='tbody'>
            <Box component='tr'>
              <Box
                component='td'
                sx={{
                  padding: '16px',
                  fontWeight: 600,
                  color: '#111827',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper'
                }}
              >
                Combined Uncertainty
              </Box>
              {UNCERTAINTY_TABLE_ONE_COLUMNS.map(column => {
                const key = column as keyof UncertaintyData['tableOne']
                return (
                  <Box
                    component='td'
                    key={column}
                    sx={{
                      padding: '12px 16px',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <TextField
                      size='small'
                      fullWidth
                      placeholder='Enter value'
                      value={uncertaintyData.tableOne[key]}
                      onChange={e => handleUncertaintyChange('tableOne', key, e.target.value)}
                      inputProps={{ style: { textAlign: 'center' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5
                        }
                      }}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  const renderUncertaintyTableTwo = () => (
    <Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          component='table'
          sx={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            minWidth: 720
          }}
        >
          <Box component='thead'>
            <Box component='tr'>
              <Box
                component='th'
                sx={{
                  backgroundColor: '#F9FAFB',
                  color: '#111827',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  minWidth: 160
                }}
              >
                Loads Applied
              </Box>
              {UNCERTAINTY_TABLE_TWO_COLUMNS.map(column => (
                <Box
                  component='th'
                  key={column}
                  sx={{
                    backgroundColor: '#F9FAFB',
                    color: '#111827',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '12px 16px',
                    textAlign: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    minWidth: 140
                  }}
                >
                  {column}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component='tbody'>
            <Box component='tr'>
              <Box
                component='td'
                sx={{
                  padding: '16px',
                  fontWeight: 600,
                  color: '#111827',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper'
                }}
              >
                Combined Uncertainty
              </Box>
              {UNCERTAINTY_TABLE_TWO_COLUMNS.map(column => {
                const key = column as keyof UncertaintyData['tableTwo']
                return (
                  <Box
                    component='td'
                    key={column}
                    sx={{
                      padding: '12px 16px',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <TextField
                      size='small'
                      fullWidth
                      placeholder='Enter value'
                      value={uncertaintyData.tableTwo[key]}
                      onChange={e => handleUncertaintyChange('tableTwo', key, e.target.value)}
                      inputProps={{ style: { textAlign: 'center' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5
                        }
                      }}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  const handleAddDevice = () => {
    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    ) as typeof formData

    if (!trimmedData.deviceName || !trimmedData.serialNumber) {
      alert('Please provide at least Device Name and Serial Number.')
      return
    }

    const linearityPayload = linearityRows.map(row => ({ ...row }))
    const repeatabilityPayload: RepeatabilityData = {
      ...repeatabilityData,
      measurements: repeatabilityData.measurements.map(measurement => ({ ...measurement }))
    }
    const eccentricityPayload: EccentricityData = JSON.parse(JSON.stringify(eccentricityData))
    const uncertaintyPayload: UncertaintyData = JSON.parse(JSON.stringify(uncertaintyData))

    if (editingDeviceId) {
      setDevices(prev =>
        prev.map(device =>
          device.id === editingDeviceId
            ? {
                ...device,
                ...trimmedData,
                linearityRows: linearityPayload,
                repeatabilityData: repeatabilityPayload,
                eccentricityData: eccentricityPayload,
                uncertaintyData: uncertaintyPayload
              }
            : device
        )
      )
      setEditingDeviceId(null)
    } else {
      const newDevice: Device = {
        id: `device-${Date.now()}`,
        ...trimmedData,
        linearityRows: linearityPayload,
        repeatabilityData: repeatabilityPayload,
        eccentricityData: eccentricityPayload,
        uncertaintyData: uncertaintyPayload
      }
      setDevices(prev => [newDevice, ...prev])
    }

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
      location: ''
    })
    setLinearityRows(createInitialLinearityRows())
    setLinearityRowsToAdd('1')
    setEccentricityData(createDefaultEccentricityData())
    setRepeatabilityData(createInitialRepeatabilityData())
    setRepeatabilityRowsToAdd('1')
    setUncertaintyData(createDefaultUncertaintyData())
    setTabValue(0)
  }

  const handleEdit = useCallback((device: Device) => {
    setFormData({
      customer: device.customer || '',
      deviceName: device.deviceName || '',
      manufacturer: device.manufacturer || '',
      model: device.model || '',
      serialNumber: device.serialNumber || '',
      tagNumber: device.tagNumber || '',
      terminalModel: device.terminalModel || '',
      maxCapacity: device.maxCapacity || '',
      readability: device.readability || '',
      verificationValue: device.verificationValue || '',
      location: device.location || ''
    })

    setLinearityRows(
      device.linearityRows && device.linearityRows.length > 0
        ? device.linearityRows.map(row => ({ ...row }))
        : createInitialLinearityRows()
    )
    setEccentricityData(
      device.eccentricityData ? JSON.parse(JSON.stringify(device.eccentricityData)) : createDefaultEccentricityData()
    )
    setRepeatabilityData(
      device.repeatabilityData
        ? {
            ...device.repeatabilityData,
            measurements: device.repeatabilityData.measurements.map(measurement => ({ ...measurement }))
          }
        : createInitialRepeatabilityData()
    )
    setUncertaintyData(
      device.uncertaintyData ? JSON.parse(JSON.stringify(device.uncertaintyData)) : createDefaultUncertaintyData()
    )
    setLinearityRowsToAdd('1')
    setRepeatabilityRowsToAdd('1')
    setEditingDeviceId(device.id)
    setTabValue(1)
  }, [])

  useEffect(() => {
    const editDeviceId = (location.state as { editDeviceId?: string } | undefined)?.editDeviceId
    if (editDeviceId && devices.length > 0) {
      const targetDevice = devices.find(device => device.id === editDeviceId)
      if (targetDevice) {
        handleEdit(targetDevice)
      }
      navigate('/devices', { replace: true, state: {} })
    }
  }, [location.state, devices, handleEdit, navigate])

  const handleDelete = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId))
    if (editingDeviceId === deviceId) {
      handleCancelEdit()
    }
  }

  const handleCancelEdit = () => {
    setEditingDeviceId(null)
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
      location: ''
    })
    setLinearityRows(createInitialLinearityRows())
    setLinearityRowsToAdd('1')
    setEccentricityData(createDefaultEccentricityData())
    setRepeatabilityData(createInitialRepeatabilityData())
    setRepeatabilityRowsToAdd('1')
    setUncertaintyData(createDefaultUncertaintyData())
  }

  const filteredDevices = useMemo(
    () =>
      devices.filter(device => {
        const term = searchTerm.toLowerCase()
        return (
          device.deviceName.toLowerCase().includes(term) ||
          device.manufacturer.toLowerCase().includes(term) ||
          device.model.toLowerCase().includes(term) ||
          device.serialNumber.toLowerCase().includes(term) ||
          device.customer.toLowerCase().includes(term)
        )
      }),
    [devices, searchTerm]
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
          {/* Page Header */}
          <Paper
            sx={{
              mb: 3,
              p: { xs: 2.5, md: 3 },
              borderRadius: CARD_RADIUS,
              border: CARD_BORDER,
              boxShadow: CARD_SHADOW,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              backgroundColor: '#FFFFFF'
            }}
          >
            <Box>
              <Typography
                variant='h5'
                component='h1'
                sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.5rem', md: '1.8rem' }, mb: 0.5 }}
              >
                Device Management
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                Manage weighing instruments and calibration devices
              </Typography>
            </Box>
          </Paper>

          {/* Tabs */}
          <Box sx={{ mb: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label='device management tabs'
              variant='scrollable'
              allowScrollButtonsMobile
              TabIndicatorProps={{ style: { backgroundColor: PRIMARY_COLOR, height: 0, borderRadius: 3 } }}
              sx={{
                minWidth: { xs: 300, sm: 'auto' },
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
                },
                '& .MuiTabs-scrollButtons.Mui-disabled': {
                  opacity: 0.35
                }
              }}
            >
              <Tab label='List Devices' />
              <Tab label='Add Device' />
            </Tabs>
          </Box>

          {/* Tab Panel: List Device */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper
                sx={{
                  p: { xs: 2, md: 2.5 },
                  borderRadius: CARD_RADIUS,
                  border: CARD_BORDER,
                  boxShadow: CARD_SHADOW,
                  backgroundColor: '#FFFFFF'
                }}
              >
                <TextField
                  fullWidth
                  placeholder='Search by device name, manufacturer, model, serial number, or customer...'
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      transition: 'box-shadow 0.2s ease',
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
                  }}
                />
              </Paper>

              <Paper
                sx={{
                  borderRadius: CARD_RADIUS,
                  border: CARD_BORDER,
                  boxShadow: CARD_SHADOW,
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}
              >
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                        {[
                          'Device Name',
                          'Manufacturer',
                          'Model',
                          'Serial Number',
                          'Customer',
                          'Location',
                          'Actions'
                        ].map(header => (
                          <TableCell
                            key={header}
                            sx={{
                              fontWeight: 600,
                              color: TABLE_TEXT_COLOR,
                              fontSize: '0.9rem',
                              py: 1.5,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDevices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align='center' sx={{ py: 4, color: SUBTEXT_COLOR }}>
                            No devices found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDevices.map((device, index) => (
                          <TableRow
                            key={device.id}
                            hover
                            sx={{
                              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                              transition: 'background-color 0.2s ease',
                              '&:hover': {
                                backgroundColor: '#EFF6FF'
                              }
                            }}
                          >
                            <TableCell sx={{ color: TABLE_TEXT_COLOR, fontWeight: 600 }}>{device.deviceName}</TableCell>
                            <TableCell sx={{ color: TABLE_TEXT_COLOR }}>{device.manufacturer}</TableCell>
                            <TableCell sx={{ color: TABLE_TEXT_COLOR }}>{device.model}</TableCell>
                            <TableCell sx={{ color: TABLE_TEXT_COLOR }}>{device.serialNumber}</TableCell>
                            <TableCell sx={{ color: TABLE_TEXT_COLOR }}>{device.customer}</TableCell>
                            <TableCell sx={{ color: TABLE_TEXT_COLOR }}>{device.location || '—'}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title='View' arrow>
                                  <IconButton
                                    size='small'
                                    onClick={() => navigate(`/devices/${device.id}`)}
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
                                    onClick={() => handleEdit(device)}
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
                                    onClick={() => handleDelete(device.id)}
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
          </TabPanel>

          {/* Tab Panel: Add Device */}
          <TabPanel value={tabValue} index={1}>
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: CARD_RADIUS,
                border: CARD_BORDER,
                boxShadow: CARD_SHADOW,
                backgroundColor: '#FFFFFF'
              }}
            >
              <div className='row'>
                {/* Customer Details Section */}
                <div className='col-12 col-md-12'>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      Customer Details
                    </Typography>
                    <div className='row'>
                      <div className='col-12 col-md-4'>
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
                  <Box sx={{ mb: 3 }}>
                    <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      Device Information
                    </Typography>
                    <div className='row'>
                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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

                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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
                      <div className='col-12 col-md-4'>
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

                {/* Linearity Section */}
                <div className='col-12 col-md-12'>
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        flexWrap: 'wrap',
                        gap: 2
                      }}
                    >
                      <Typography variant='h6' sx={{ color: 'primary.main', fontWeight: 600 }}>
                        Linearity
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <TextField
                          size='small'
                          type='number'
                          inputProps={{ min: 1 }}
                          value={linearityRowsToAdd}
                          onChange={e => setLinearityRowsToAdd(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddLinearityRows()
                            }
                          }}
                          sx={{ width: 120 }}
                          placeholder='Rows'
                        />
                        <Button
                          variant='outlined'
                          startIcon={<AddIcon fontSize='small' />}
                          onClick={handleAddLinearityRows}
                          size='small'
                          sx={{ textTransform: 'none' }}
                        >
                          Add Row
                        </Button>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: 'background.paper'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          px: 2,
                          py: 1.5,
                          backgroundColor: 'action.hover',
                          fontWeight: 600,
                          minHeight: 48
                        }}
                      >
                        <Typography sx={{ flex: 1.2, fontWeight: 600, fontSize: '0.9rem' }}>Nominal Value</Typography>
                        <Typography sx={{ flex: 1.2, fontWeight: 600, fontSize: '0.9rem' }}>Reading</Typography>
                        <Typography sx={{ flex: 1.1, fontWeight: 600, fontSize: '0.9rem' }}>Error</Typography>
                        <Typography sx={{ flex: 1.2, fontWeight: 600, fontSize: '0.9rem' }}>Allowable Error</Typography>
                        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>Within Tolerances</Typography>
                        <Typography sx={{ width: 60, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                          Action
                        </Typography>
                      </Box>

                      {linearityRows.length === 0 ? (
                        <Box sx={{ px: 2, py: 3 }}>
                          <Typography variant='body2' color='text.secondary'>
                            No linearity data added yet.
                          </Typography>
                        </Box>
                      ) : (
                        linearityRows.map((row, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              px: 2,
                              py: 1.5,
                              borderTop: '1px solid',
                              borderColor: 'divider',
                              flexWrap: 'wrap'
                            }}
                          >
                            <TextField
                              placeholder='Enter value'
                              size='small'
                              fullWidth
                              value={row.nominalValue}
                              onChange={e => handleLinearityChange(index, 'nominalValue', e.target.value)}
                              sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 150 } }}
                            />
                            <TextField
                              placeholder='Enter reading'
                              size='small'
                              fullWidth
                              value={row.reading}
                              onChange={e => handleLinearityChange(index, 'reading', e.target.value)}
                              sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 150 } }}
                            />
                            <TextField
                              placeholder='Enter error'
                              size='small'
                              fullWidth
                              value={row.error}
                              onChange={e => handleLinearityChange(index, 'error', e.target.value)}
                              sx={{ flex: 1.1, minWidth: { xs: '100%', sm: 130 } }}
                            />
                            <TextField
                              placeholder='Enter allowable error'
                              size='small'
                              fullWidth
                              value={row.allowableError}
                              onChange={e => handleLinearityChange(index, 'allowableError', e.target.value)}
                              sx={{ flex: 1.2, minWidth: { xs: '100%', sm: 150 } }}
                            />
                            <TextField
                              placeholder='Yes/No'
                              size='small'
                              fullWidth
                              value={row.withinTolerance}
                              onChange={e => handleLinearityChange(index, 'withinTolerance', e.target.value)}
                              sx={{ flex: 1, minWidth: { xs: '100%', sm: 120 } }}
                            />
                            <IconButton
                              onClick={() => handleRemoveLinearityRow(index)}
                              sx={{
                                width: 40,
                                height: 40,
                                color: 'error.main',
                                flexShrink: 0
                              }}
                              aria-label='Remove linearity row'
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Box>
                </div>

                {/* Eccentricity Section */}
                <div className='col-12 col-md-12'>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant='h6' sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
                      Eccentricity
                    </Typography>

                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        backgroundColor: 'background.paper',
                        p: { xs: 2, sm: 3 }
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                          Test Weight
                        </Typography>
                        <TextField
                          placeholder='Enter test weight'
                          size='small'
                          fullWidth
                          value={eccentricityData.testWeight}
                          onChange={e => handleEccentricityChange('testWeight', e.target.value)}
                        />
                      </Box>

                      <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1.5 }}>
                        Positions
                      </Typography>

                      <Box
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          gap: 3,
                          mb: 1,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'text.secondary'
                        }}
                      >
                        <Typography sx={{ width: 140, flexShrink: 0 }}>&nbsp;</Typography>
                        <Typography sx={{ flex: 1 }}>Displayed Value</Typography>
                        <Typography sx={{ flex: 1 }}>Deviation</Typography>
                      </Box>

                      {ECCENTRICITY_POSITIONS.map(position => (
                        <Box
                          key={position.key}
                          sx={{
                            display: 'flex',
                            gap: 3,
                            alignItems: 'center',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            mb: 2
                          }}
                        >
                          <Typography
                            sx={{
                              width: { xs: '100%', sm: 140 },
                              flexShrink: 0,
                              fontWeight: 600,
                              color: 'text.primary'
                            }}
                          >
                            {position.label}
                          </Typography>
                          <TextField
                            placeholder='Displayed value'
                            size='small'
                            value={eccentricityData.positions[position.key].displayedValue}
                            onChange={e =>
                              handleEccentricityPositionChange(position.key, 'displayedValue', e.target.value)
                            }
                            sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 }, mb: { xs: 1, sm: 0 } }}
                          />
                          <TextField
                            placeholder='Deviation'
                            size='small'
                            value={eccentricityData.positions[position.key].deviation}
                            onChange={e => handleEccentricityPositionChange(position.key, 'deviation', e.target.value)}
                            sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                          />
                        </Box>
                      ))}

                      <div className='row'>
                        <div className='col-12 col-md-4'>
                          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                            Maximum Deviation
                          </Typography>
                          <TextField
                            placeholder='Enter maximum deviation'
                            size='small'
                            fullWidth
                            value={eccentricityData.maximumDeviation}
                            onChange={e => handleEccentricityChange('maximumDeviation', e.target.value)}
                          />
                        </div>
                        <div className='col-12 col-md-4'>
                          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                            Allowable Deviation
                          </Typography>
                          <TextField
                            placeholder='Enter allowable deviation'
                            size='small'
                            fullWidth
                            value={eccentricityData.allowableDeviation}
                            onChange={e => handleEccentricityChange('allowableDeviation', e.target.value)}
                          />
                        </div>
                        <div className='col-12 col-md-4'>
                          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                            Within Tolerances
                          </Typography>
                          <TextField
                            placeholder='Enter result'
                            size='small'
                            fullWidth
                            value={eccentricityData.withinTolerance}
                            onChange={e => handleEccentricityChange('withinTolerance', e.target.value)}
                          />
                        </div>
                      </div>
                    </Box>
                  </Box>
                </div>

                {/* Repeatability Section */}
                <div className='col-12 col-md-12'>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant='h6' sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
                      Repeatability
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        backgroundColor: 'background.paper',
                        p: { xs: 2, sm: 3 }
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                          Test Weight
                        </Typography>
                        <TextField
                          placeholder='Enter test weight'
                          size='small'
                          fullWidth
                          value={repeatabilityData.testWeight}
                          onChange={e => handleRepeatabilityChange('testWeight', e.target.value)}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1.5,
                          flexWrap: 'wrap',
                          gap: 2
                        }}
                      >
                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                          Measurements
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <TextField
                            size='small'
                            type='number'
                            inputProps={{ min: 1 }}
                            value={repeatabilityRowsToAdd}
                            onChange={e => setRepeatabilityRowsToAdd(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddRepeatabilityRows()
                              }
                            }}
                            sx={{ width: 120 }}
                            placeholder='Rows'
                          />
                          <Button
                            variant='outlined'
                            startIcon={<AddIcon fontSize='small' />}
                            size='small'
                            sx={{ textTransform: 'none' }}
                            onClick={handleAddRepeatabilityRows}
                          >
                            Add Row
                          </Button>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            px: 2,
                            py: 1.5,
                            backgroundColor: 'action.hover',
                            fontWeight: 600,
                            minHeight: 48
                          }}
                        >
                          <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>
                            Without Test Weight
                          </Typography>
                          <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>
                            With Test Weight
                          </Typography>
                          <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>As Found</Typography>
                          <Typography sx={{ width: 60, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                            Action
                          </Typography>
                        </Box>

                        {repeatabilityData.measurements.length === 0 ? (
                          <Box sx={{ px: 2, py: 3 }}>
                            <Typography variant='body2' color='text.secondary'>
                              No measurements added yet.
                            </Typography>
                          </Box>
                        ) : (
                          repeatabilityData.measurements.map((row, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                px: 2,
                                py: 1.5,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                flexWrap: 'wrap'
                              }}
                            >
                              <TextField
                                placeholder='Enter value'
                                size='small'
                                fullWidth
                                value={row.withoutTestWeight}
                                onChange={e => handleRepeatabilityRowChange(index, 'withoutTestWeight', e.target.value)}
                                sx={{ flex: 1, minWidth: { xs: '100%', sm: 160 } }}
                              />
                              <TextField
                                placeholder='Enter value'
                                size='small'
                                fullWidth
                                value={row.withTestWeight}
                                onChange={e => handleRepeatabilityRowChange(index, 'withTestWeight', e.target.value)}
                                sx={{ flex: 1, minWidth: { xs: '100%', sm: 160 } }}
                              />
                              <TextField
                                placeholder='Enter value'
                                size='small'
                                fullWidth
                                value={row.asFound}
                                onChange={e => handleRepeatabilityRowChange(index, 'asFound', e.target.value)}
                                sx={{ flex: 1, minWidth: { xs: '100%', sm: 160 } }}
                              />
                              <IconButton
                                onClick={() => handleRemoveRepeatabilityRow(index)}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  color: 'error.main',
                                  flexShrink: 0
                                }}
                                aria-label='Remove repeatability row'
                              >
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Box>
                          ))
                        )}
                      </Box>

                      <div className='row' style={{ marginTop: 16 }}>
                        <div className='col-12 col-md-4'>
                          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                            Deviation
                          </Typography>
                          <TextField
                            placeholder='Enter deviation'
                            size='small'
                            fullWidth
                            value={repeatabilityData.deviation}
                            onChange={e => handleRepeatabilityChange('deviation', e.target.value)}
                          />
                        </div>
                        <div className='col-12 col-md-4'>
                          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                            Allowable Error
                          </Typography>
                          <TextField
                            placeholder='Enter allowable error'
                            size='small'
                            fullWidth
                            value={repeatabilityData.allowableError}
                            onChange={e => handleRepeatabilityChange('allowableError', e.target.value)}
                          />
                        </div>
                        <div className='col-12 col-md-4'>
                          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                            Within Tolerances
                          </Typography>
                          <TextField
                            placeholder='Enter result'
                            size='small'
                            fullWidth
                            value={repeatabilityData.withinTolerance}
                            onChange={e => handleRepeatabilityChange('withinTolerance', e.target.value)}
                          />
                        </div>
                      </div>
                    </Box>
                  </Box>
                </div>

                {/* Uncertainty Section */}
                <div className='col-12 col-md-12'>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant='h6' sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
                      Uncertainty
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        boxShadow: '0 10px 30px -12px rgba(15, 23, 42, 0.25)',
                        backgroundColor: 'background.paper',
                        p: { xs: 2, sm: 3 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                      }}
                    >
                      {renderUncertaintyTableOne()}
                      {renderUncertaintyTableTwo()}
                    </Box>
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
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                      variant='contained'
                      size='medium'
                      onClick={handleAddDevice}
                      sx={{
                        textTransform: 'none',
                        width: { xs: '100%', sm: 'auto' },
                        borderRadius: '999px',
                        px: 3,
                        py: 1.15,
                        backgroundColor: PRIMARY_COLOR,
                        boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)',
                        '&:hover': { backgroundColor: '#1D4ED8' }
                      }}
                    >
                      {editingDeviceId ? 'Save Changes' : 'Add Device'}
                    </Button>
                    {editingDeviceId && (
                      <Button
                        variant='outlined'
                        size='medium'
                        onClick={handleCancelEdit}
                        sx={{
                          textTransform: 'none',
                          width: { xs: '100%', sm: 'auto' },
                          borderRadius: '999px',
                          px: 3,
                          py: 1.15,
                          borderColor: 'rgba(148, 163, 184, 0.6)',
                          color: SUBTEXT_COLOR,
                          '&:hover': { borderColor: SUBTEXT_COLOR, backgroundColor: '#F3F4F6' }
                        }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </Box>
                  <Button
                    variant='outlined'
                    size='medium'
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/certificates')}
                    sx={{
                      textTransform: 'none',
                      width: { xs: '100%', sm: 'auto' },
                      borderRadius: '999px',
                      px: 3,
                      py: 1.15,
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      '&:hover': { borderColor: '#1D4ED8', backgroundColor: 'rgba(37, 99, 235, 0.08)' }
                    }}
                  >
                    Next: Calibration Module →
                  </Button>
                </Box>
              </div>
            </Paper>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  )
}

export default Devices
