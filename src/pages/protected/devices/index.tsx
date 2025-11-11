import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
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
const LABEL_COLOR = '#4B5563'
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
  },
  '& .MuiInputLabel-root': {
    color: LABEL_COLOR,
    fontSize: '0.875rem'
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

const smallOutlinedButtonStyles = {
  textTransform: 'none',
  borderRadius: '999px',
  px: 2,
  py: 0.75,
  fontSize: '0.8125rem',
  borderColor: PRIMARY_COLOR,
  color: PRIMARY_COLOR,
  '&:hover': { borderColor: '#1D4ED8', backgroundColor: 'rgba(37, 99, 235, 0.08)' }
}

const tableHeaderCellStyles = {
  fontWeight: 600,
  color: TABLE_TEXT_COLOR,
  fontSize: '0.9rem',
  py: 1.5,
  textAlign: 'center',
  whiteSpace: 'nowrap'
}

const tableCellStyles = {
  color: TABLE_TEXT_COLOR,
  fontSize: '0.9rem',
  textAlign: 'center',
  whiteSpace: 'nowrap'
}

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

const createInitialLinearityRows = (): LinearityRow[] => [createEmptyLinearityRow()]

const createEmptyRepeatabilityMeasurement = (): RepeatabilityMeasurement => ({
  withoutTestWeight: '',
  withTestWeight: '',
  asFound: ''
})

const createInitialRepeatabilityData = (): RepeatabilityData => ({
  testWeight: '',
  measurements: [createEmptyRepeatabilityMeasurement()],
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

function DataSectionCard({
  title,
  description,
  extraContent,
  children
}: {
  title: string
  description?: string
  extraContent?: ReactNode
  children: ReactNode
}) {
  return (
    <Paper sx={{ ...cardBaseStyles, gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 600, color: TITLE_COLOR }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mt: 0.5 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {extraContent}
      </Box>
      {children}
    </Paper>
  )
}

function ResponsiveStyledTable({
  headers,
  rows,
  renderCell
}: {
  headers: string[]
  rows: ReactNode[][]
  renderCell?: (value: ReactNode, columnIndex: number, rowIndex: number) => ReactNode
}) {
  return (
    <TableContainer
      sx={{
        borderRadius: 2,
        border: CARD_BORDER,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        overflowX: 'auto',
        mt: 2
      }}
    >
      <Table size='small' sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
            {headers.map(header => (
              <TableCell key={header} sx={{ ...tableHeaderCellStyles }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={`row-${rowIndex}`} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
              {row.map((cell, columnIndex) => (
                <TableCell key={`cell-${rowIndex}-${columnIndex}`} sx={{ ...tableCellStyles }}>
                  {renderCell ? renderCell(cell, columnIndex, rowIndex) : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
    setLinearityRows(prev => (prev.length > 1 ? prev.filter((_, rowIndex) => rowIndex !== index) : prev))
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
        prev.measurements.length > 1 ? prev.measurements.filter((_, rowIndex) => rowIndex !== index) : prev.measurements
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ ...cardBaseStyles }}>
                <Typography variant='h6' sx={{ fontWeight: 600, color: TITLE_COLOR, mb: 0.5 }}>
                  Customer Details
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 2.5 }}>
                  Assign the device to a customer and specify where it is located.
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }
                  }}
                >
                  <FormControl fullWidth size='small' required sx={{ ...inputStyles }}>
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
                  <TextField
                    fullWidth
                    size='small'
                    label='Location'
                    placeholder='Device location'
                    value={formData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                </Box>
              </Paper>

              <Paper sx={{ ...cardBaseStyles }}>
                <Typography variant='h6' sx={{ fontWeight: 600, color: TITLE_COLOR, mb: 0.5 }}>
                  Device Information
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR, mb: 2.5 }}>
                  Update core device specifications.
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
                    size='small'
                    label='Serial Number'
                    required
                    placeholder='Unique serial number'
                    value={formData.serialNumber}
                    onChange={e => handleInputChange('serialNumber', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Device Name'
                    placeholder='e.g., Weighing Scale'
                    value={formData.deviceName}
                    onChange={e => handleInputChange('deviceName', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Manufacturer'
                    placeholder='e.g., Mettler Toledo'
                    value={formData.manufacturer}
                    onChange={e => handleInputChange('manufacturer', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Model'
                    placeholder='e.g., XS205'
                    value={formData.model}
                    onChange={e => handleInputChange('model', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Tag Number'
                    placeholder='Internal tag/ID'
                    value={formData.tagNumber}
                    onChange={e => handleInputChange('tagNumber', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Terminal Model'
                    placeholder='Terminal model'
                    value={formData.terminalModel}
                    onChange={e => handleInputChange('terminalModel', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Max Capacity'
                    placeholder='e.g., 200g, 5kg'
                    value={formData.maxCapacity}
                    onChange={e => handleInputChange('maxCapacity', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Readability'
                    placeholder='e.g., 0.01mg, 0.1g'
                    value={formData.readability}
                    onChange={e => handleInputChange('readability', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                  <TextField
                    fullWidth
                    size='small'
                    label='Verification Value'
                    placeholder='Verification value'
                    value={formData.verificationValue}
                    onChange={e => handleInputChange('verificationValue', e.target.value)}
                    sx={{ ...inputStyles }}
                  />
                </Box>
              </Paper>

              <DataSectionCard
                title='Linearity'
                description='Record linearity measurements and tolerances.'
                extraContent={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField
                      size='small'
                      type='number'
                      label='Rows'
                      value={linearityRowsToAdd}
                      onChange={e => setLinearityRowsToAdd(e.target.value)}
                      inputProps={{ min: 1 }}
                      sx={{ width: { xs: '100%', sm: 120 }, ...inputStyles }}
                    />
                    <Button
                      size='small'
                      variant='outlined'
                      startIcon={<AddIcon fontSize='small' />}
                      onClick={handleAddLinearityRows}
                      sx={{ ...smallOutlinedButtonStyles }}
                    >
                      Add Row
                    </Button>
                  </Box>
                }
              >
                <ResponsiveStyledTable
                  headers={['Nominal Value', 'Reading', 'Error', 'Allowable Error', 'Within Tolerances', 'Actions']}
                  rows={linearityRows.map((row, index) => [
                    row.nominalValue,
                    row.reading,
                    row.error,
                    row.allowableError,
                    row.withinTolerance,
                    index
                  ])}
                  renderCell={(value, columnIndex, rowIndex) => {
                    if (columnIndex === 5) {
                      return (
                        <Tooltip title='Delete Row' arrow>
                          <IconButton size='small' color='error' onClick={() => handleRemoveLinearityRow(rowIndex)}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                    const fieldKeys: Array<keyof LinearityRow> = [
                      'nominalValue',
                      'reading',
                      'error',
                      'allowableError',
                      'withinTolerance'
                    ]
                    const key = fieldKeys[columnIndex]
                    return (
                      <TextField
                        value={(linearityRows[rowIndex][key] as string) || ''}
                        onChange={e => handleLinearityChange(rowIndex, key, e.target.value)}
                        size='small'
                        sx={{ ...inputStyles, width: '100%' }}
                        placeholder='Enter value'
                      />
                    )
                  }}
                />
              </DataSectionCard>

              <DataSectionCard title='Eccentricity' description='Log eccentricity positions and tolerances.'>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    mb: 3,
                    mt: 2
                  }}
                >
                  {[
                    { label: 'Test Weight', key: 'testWeight' },
                    { label: 'Maximum Deviation', key: 'maximumDeviation' },
                    { label: 'Allowable Deviation', key: 'allowableDeviation' },
                    { label: 'Within Tolerances', key: 'withinTolerance' }
                  ].map(item => (
                    <TextField
                      key={item.label}
                      fullWidth
                      size='small'
                      label={item.label}
                      value={(eccentricityData as any)[item.key] || ''}
                      onChange={e => handleEccentricityChange(item.key as any, e.target.value)}
                      sx={{ ...inputStyles }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
                  }}
                >
                  {ECCENTRICITY_POSITIONS.map(position => {
                    const positionKey = position.key as keyof typeof eccentricityData.positions
                    return (
                      <Paper
                        key={position.key}
                        elevation={0}
                        sx={{
                          border: CARD_BORDER,
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                          borderRadius: 2,
                          p: 2,
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 600, mb: 1 }}>
                          {position.label}
                        </Typography>
                        <TextField
                          fullWidth
                          size='small'
                          label='Displayed Value'
                          value={eccentricityData.positions[positionKey].displayedValue}
                          onChange={e =>
                            handleEccentricityPositionChange(positionKey, 'displayedValue', e.target.value)
                          }
                          sx={{ ...inputStyles, mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          size='small'
                          label='Deviation'
                          value={eccentricityData.positions[positionKey].deviation}
                          onChange={e => handleEccentricityPositionChange(positionKey, 'deviation', e.target.value)}
                          sx={{ ...inputStyles }}
                        />
                      </Paper>
                    )
                  })}
                </Box>
              </DataSectionCard>

              <DataSectionCard
                title='Repeatability'
                description='Capture repeatability measurements and deviations.'
                extraContent={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField
                      size='small'
                      type='number'
                      label='Rows'
                      value={repeatabilityRowsToAdd}
                      onChange={e => setRepeatabilityRowsToAdd(e.target.value)}
                      inputProps={{ min: 1 }}
                      sx={{ width: { xs: '100%', sm: 120 }, ...inputStyles }}
                    />
                    <Button
                      size='small'
                      variant='outlined'
                      startIcon={<AddIcon fontSize='small' />}
                      onClick={handleAddRepeatabilityRows}
                      sx={{ ...smallOutlinedButtonStyles }}
                    >
                      Add Row
                    </Button>
                  </Box>
                }
              >
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    mb: 2,
                    mt: 2
                  }}
                >
                  {[
                    { label: 'Test Weight', key: 'testWeight' },
                    { label: 'Deviation', key: 'deviation' },
                    { label: 'Allowable Error', key: 'allowableError' },
                    { label: 'Within Tolerances', key: 'withinTolerance' }
                  ].map(item => (
                    <TextField
                      key={item.label}
                      fullWidth
                      size='small'
                      label={item.label}
                      value={(repeatabilityData as any)[item.key] || ''}
                      onChange={e => handleRepeatabilityChange(item.key as any, e.target.value)}
                      sx={{ ...inputStyles }}
                    />
                  ))}
                </Box>

                <ResponsiveStyledTable
                  headers={['Without Test Weight', 'With Test Weight', 'As Found', 'Actions']}
                  rows={repeatabilityData.measurements.map((row, index) => [
                    row.withoutTestWeight,
                    row.withTestWeight,
                    row.asFound,
                    index
                  ])}
                  renderCell={(value, columnIndex, rowIndex) => {
                    if (columnIndex === 3) {
                      return (
                        <Tooltip title='Delete Row' arrow>
                          <IconButton size='small' color='error' onClick={() => handleRemoveRepeatabilityRow(rowIndex)}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                    const fieldKeys: Array<keyof RepeatabilityMeasurement> = [
                      'withoutTestWeight',
                      'withTestWeight',
                      'asFound'
                    ]
                    const key = fieldKeys[columnIndex]
                    return (
                      <TextField
                        value={(repeatabilityData.measurements[rowIndex][key] as string) || ''}
                        onChange={e => handleRepeatabilityRowChange(rowIndex, key, e.target.value)}
                        size='small'
                        sx={{ ...inputStyles, width: '100%' }}
                        placeholder='Enter value'
                      />
                    )
                  }}
                />
              </DataSectionCard>

              <DataSectionCard title='Uncertainty' description='Review uncertainty matrices for different load ranges.'>
                <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 1.5 }}>
                  Loads Applied – Table 1
                </Typography>
                <ResponsiveStyledTable
                  headers={UNCERTAINTY_TABLE_ONE_COLUMNS.map(column => column.toUpperCase())}
                  rows={[
                    UNCERTAINTY_TABLE_ONE_COLUMNS.map(column => (
                      <TextField
                        key={column}
                        value={uncertaintyData.tableOne[column] || ''}
                        onChange={e => handleUncertaintyChange('tableOne', column, e.target.value)}
                        size='small'
                        sx={{ ...inputStyles, width: '100%' }}
                        placeholder='Enter value'
                      />
                    ))
                  ]}
                  renderCell={undefined}
                />

                <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 1.5, mt: 3 }}>
                  Loads Applied – Table 2
                </Typography>
                <ResponsiveStyledTable
                  headers={UNCERTAINTY_TABLE_TWO_COLUMNS.map(column => column.toUpperCase())}
                  rows={[
                    UNCERTAINTY_TABLE_TWO_COLUMNS.map(column => (
                      <TextField
                        key={column}
                        value={uncertaintyData.tableTwo[column] || ''}
                        onChange={e => handleUncertaintyChange('tableTwo', column, e.target.value)}
                        size='small'
                        sx={{ ...inputStyles, width: '100%' }}
                        placeholder='Enter value'
                      />
                    ))
                  ]}
                  renderCell={undefined}
                />
              </DataSectionCard>

              <Paper sx={{ ...cardBaseStyles }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                  <Button onClick={handleAddDevice} variant='contained' sx={{ ...primaryButtonStyles }}>
                    {editingDeviceId ? 'Save Changes' : 'Save Device'}
                  </Button>
                </Box>
              </Paper>
            </Box>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  )
}

export default Devices
