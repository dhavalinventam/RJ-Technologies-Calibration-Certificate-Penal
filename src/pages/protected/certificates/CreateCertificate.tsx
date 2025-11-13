// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  LinearProgress,
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
  Autocomplete
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'
import './CreateCertificate.css'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import { Device, defaultDevices } from '@/pages/protected/devices/deviceData'
import { CUSTOMER_STORAGE_KEY } from '@/pages/protected/customers/customerData'
import eccentricityDiagramImage from '@/assets/jpg/Eccentricity-weight-diagram.jpg'

const PRIMARY_COLOR = '#2563EB'
const PAGE_BACKGROUND = '#F8FAFC'
const TITLE_COLOR = '#111827'
const SUBTEXT_COLOR = '#6B7280'
const CARD_RADIUS = 3
const CARD_BORDER = '1px solid rgba(148, 163, 184, 0.25)'
const CARD_SHADOW = '0 1px 3px rgba(15, 23, 42, 0.08)'

const cardBaseStyles = {
  p: { xs: 2.5, md: 3 },
  borderRadius: CARD_RADIUS,
  border: CARD_BORDER,
  boxShadow: CARD_SHADOW,
  backgroundColor: '#FFFFFF'
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

const primaryButtonStyles = {
  textTransform: 'none',
  borderRadius: '999px',
  px: 3,
  py: 1.15,
  backgroundColor: PRIMARY_COLOR,
  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)',
  '&:hover': { backgroundColor: '#1D4ED8' }
}

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
  // 'Engineer & Signature',
  'Preview & Generate'
]

const defaultCustomerOptions = [
  {
    id: '1',
    customerName: 'Amnel',
    company: 'Amnel Pharmaceutical Pvt Ltd',
    address: '301, Shahjanand Plaza, Bhattha, Paldi',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zip: '380007',
    contactPerson: 'Urmil Patel',
    mobile: '9876543210'
  },
  {
    id: '2',
    customerName: 'Globex Labs',
    company: 'Globex Laboratory Solutions',
    address: 'Plot 12, GIDC Estate, Makarpura',
    city: 'Vadodara',
    state: 'Gujarat',
    zip: '390010',
    contactPerson: 'Rekha Sharma',
    mobile: '9825034567'
  },
  {
    id: '3',
    customerName: 'Vertex Pharma',
    company: 'Vertex Pharmaceuticals LLP',
    address: 'Unit 5, MIDC Industrial Area',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400104',
    contactPerson: 'Rohan Desai',
    mobile: '9898076543'
  },
  {
    id: '4',
    customerName: 'Everest Biotech',
    company: 'Everest Biotech Pvt Ltd',
    address: 'Science Park, Vesu',
    city: 'Surat',
    state: 'Gujarat',
    zip: '395007',
    contactPerson: 'Nisha Shah',
    mobile: '9012304567'
  },
  {
    id: '5',
    customerName: 'Zenith Industries',
    company: 'Zenith Industrial Solutions',
    address: 'Phase II, Hinjewadi IT Park',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411057',
    contactPerson: 'Ajay Kulkarni',
    mobile: '9123456780'
  }
]

const defaultProcedureTemplates = [
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

const deriveCityStateFromLocation = (location: string | undefined) => {
  if (!location || typeof location !== 'string') {
    return { city: '', state: '' }
  }
  const parts = location
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
  return {
    city: parts[0] || '',
    state: parts[1] || ''
  }
}

const normalizeCustomerOption = (option: any) => {
  if (!option || typeof option !== 'object') {
    return {
      id: `customer-${Date.now()}`,
      customerName: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      contactPerson: '',
      mobile: '',
      location: ''
    }
  }

  const customerName = option.customerName || option.name || option.customer || ''
  const company = option.company || option.companyName || ''
  const address = option.address || option.addressLine || option.street || ''
  const rawLocation = option.location || ''
  const { city: derivedCity, state: derivedState } = deriveCityStateFromLocation(rawLocation)
  const city = option.city || option.town || derivedCity
  const state = option.state || option.stateProvince || option.province || derivedState
  const zip = option.zip || option.zipCode || option.postalCode || option.pincode || option.pin || ''
  const contactPerson = option.contactPerson || option.contact || option.contactName || option.person || ''
  const mobile =
    option.mobile || option.mobileNumber || option.phone || option.phoneNumber || option.contactNumber || ''

  const sanitizedIdBase = (customerName || company || 'unknown')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const normalizedId = option.id || (sanitizedIdBase ? `customer-${sanitizedIdBase}` : `customer-${Date.now()}`)

  return {
    ...option,
    id: normalizedId,
    customerName,
    company,
    address,
    city,
    state,
    zip,
    pincode: option.pincode || zip,
    contactPerson,
    mobile,
    location: rawLocation || `${city}${state ? `, ${state}` : ''}`
  }
}

const buildCustomerOptions = (records: any[]) => {
  if (!Array.isArray(records)) return []
  return records.filter(Boolean).map(normalizeCustomerOption)
}

const findStoredCustomerByName = (name: string) => {
  if (!name) return null
  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return null
    const lowerName = name.toLowerCase()
    for (const item of parsed) {
      const normalized = normalizeCustomerOption(item)
      if (normalized.customerName.toLowerCase() === lowerName || normalized.company.toLowerCase() === lowerName) {
        return normalized
      }
    }
    return null
  } catch (error) {
    console.error('Failed to read stored customer data', error)
    return null
  }
}

const ECCENTRICITY_POSITION_MAP = [
  { key: 'center', label: 'Center' },
  { key: 'leftFront', label: 'Left Front' },
  { key: 'leftRear', label: 'Left Rear' },
  { key: 'rightRear', label: 'Right Rear' },
  { key: 'rightFront', label: 'Right Front' }
] as const

const createInitialCustomerFields = () => ({
  company: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  contact: '',
  mobile: ''
})

const createInitialDeviceFields = () => ({
  manufacturer: '',
  serialNo: '',
  model: '',
  terminalModel: '',
  maxCapacity: '',
  tagNo: '',
  readability: '',
  verificationValue: '',
  location: ''
})

const createInitialLinearityRecords = () => [
  {
    nominalValue: '',
    reading: '',
    error: '',
    allowableError: '',
    withinTolerances: ''
  }
]

const createInitialEccentricity = () => ({
  testWeight: '50 kg',
  positions: [
    { position: 'Center', displayedValue: '50.000 kg', deviation: 'N/A' },
    { position: 'Left Front', displayedValue: '50.000 kg', deviation: '0.000 kg' },
    { position: 'Left Rear', displayedValue: '50.000 kg', deviation: '0.000 kg' },
    { position: 'Right Rear', displayedValue: '50.000 kg', deviation: '0.000 kg' },
    { position: 'Right Front', displayedValue: '50.000 kg', deviation: '0.000 kg' }
  ],
  maximumDeviation: '0.000 kg',
  allowableDeviation: '0.002 kg',
  withinTolerances: 'YES'
})

const createInitialRepeatability = () => ({
  testWeight: '75 kg',
  measurements: [{ withoutTestWeight: '0.000 kg', withTestWeight: '75.000 kg', asFound: '75.000 kg' }],
  deviation: '0.000 kg',
  allowableError: '0.002 kg',
  withinTolerances: 'YES'
})

const uncertaintyTableOneColumns = ['xi', '0 kg', '20 kg', '50 kg', '70 kg'] as const
const uncertaintyTableTwoColumns = ['xi', '100 kg', '120 kg', '150 kg', 'N/A'] as const

const createInitialUncertainty = () => ({
  tableOne: Object.fromEntries(uncertaintyTableOneColumns.map(column => [column, ''])) as Record<
    (typeof uncertaintyTableOneColumns)[number],
    string
  >,
  tableTwo: Object.fromEntries(uncertaintyTableTwoColumns.map(column => [column, ''])) as Record<
    (typeof uncertaintyTableTwoColumns)[number],
    string
  >
})

// WeightSet interface
interface WeightSet {
  id: string
  weightSetNo: string
  certificateNumber: string
  class: string
  dateOfIssue: string
  calibrationDueDate: string
  createdAt?: string
}

// Reference Weight (editable copy of WeightSet)
interface ReferenceWeight {
  id: string
  weightSetNo: string
  certificateNumber: string
  class: string
  dateOfIssue: string
  calibrationDueDate: string
}

const createInitialReferenceWeights = (): ReferenceWeight[] => []

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
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDeviceName, setSelectedDeviceName] = useState<string | null>(null)
  const [deviceNameInputValue, setDeviceNameInputValue] = useState('')
  const [serialNumberInputValue, setSerialNumberInputValue] = useState('')
  const [customerOptions, setCustomerOptions] = useState(() => buildCustomerOptions(defaultCustomerOptions))
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerNameInputValue, setCustomerNameInputValue] = useState('')
  const [procedureTemplateOptions, setProcedureTemplateOptions] = useState(defaultProcedureTemplates)
  const [selectedTemplateName, setSelectedTemplateName] = useState(null)
  const [templateNameInputValue, setTemplateNameInputValue] = useState('')
  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem('procedureTemplates')
      if (storedTemplates) {
        const parsed = JSON.parse(storedTemplates)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProcedureTemplateOptions(parsed)
        } else {
          setProcedureTemplateOptions(defaultProcedureTemplates)
        }
      } else {
        setProcedureTemplateOptions(defaultProcedureTemplates)
      }
    } catch (error) {
      console.error('Failed to load procedure templates:', error)
      setProcedureTemplateOptions(defaultProcedureTemplates)
    }
  }, [])

  useEffect(() => {
    try {
      const storedCustomers = localStorage.getItem('customers')
      if (storedCustomers) {
        const parsed = JSON.parse(storedCustomers)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomerOptions(buildCustomerOptions(parsed))
        } else {
          setCustomerOptions(buildCustomerOptions(defaultCustomerOptions))
        }
      } else {
        setCustomerOptions(buildCustomerOptions(defaultCustomerOptions))
      }
    } catch (error) {
      console.error('Failed to load customers:', error)
      setCustomerOptions(buildCustomerOptions(defaultCustomerOptions))
    }
  }, [])
  const [calibrationDetails, setCalibrationDetails] = useState({
    asFoundCalibrationDate: '',
    asLeftCalibrationDate: '',
    nextCalibrationDueDate: '',
    issueDate: '',
    engineerName: '',
    engineerSignature: '',
    remarks: ''
  })
  const calibrationSignatureInputRef = useRef(null)

  // Eccentricity diagram image data (base64)
  const [eccentricityImageData, setEccentricityImageData] = useState<string | null>(null)
  const [eccentricityImageDimensions, setEccentricityImageDimensions] = useState<{
    width: number
    height: number
  } | null>(null)

  // Load eccentricity diagram image on component mount
  useEffect(() => {
    const loadEccentricityImage = () => {
      // Load image directly using Image element (works with Vite's asset handling)
      const img = new Image()
      img.onload = () => {
        try {
          // Get dimensions first
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight
          }
          setEccentricityImageDimensions(dimensions)

          // Create canvas to convert image to base64 for PDF
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0)
            // Convert to JPEG base64 for better PDF compatibility
            const base64Data = canvas.toDataURL('image/jpeg', 0.95)
            setEccentricityImageData(base64Data)
          } else {
            console.error('Failed to get canvas context for eccentricity image')
          }
        } catch (error) {
          console.error('Error processing eccentricity image:', error)
        }
      }
      img.onerror = error => {
        console.error('Error loading eccentricity diagram image:', error)
        // Set default dimensions as fallback
        setEccentricityImageDimensions({ width: 400, height: 300 })
      }
      // Use the imported image URL directly (Vite handles this)
      img.src = eccentricityDiagramImage
    }

    loadEccentricityImage()
  }, [])

  // Customer (Step 1) fields
  const [customer, setCustomer] = useState(() => createInitialCustomerFields())

  // Device (Step 2) fields
  const [device, setDevice] = useState(() => createInitialDeviceFields())

  // Procedure Template (Step 3) field
  const [procedureTemplate, setProcedureTemplate] = useState('')

  // Linearity (Step 4) records
  const [linearityRecords, setLinearityRecords] = useState(() => createInitialLinearityRecords())

  // Eccentricity (Step 5) data
  const [eccentricity, setEccentricity] = useState(() => createInitialEccentricity())

  // Repeatability (Step 6) data
  const [repeatability, setRepeatability] = useState(() => createInitialRepeatability())

  // Uncertainty (Step 7) data
  const [uncertainty, setUncertainty] = useState(() => createInitialUncertainty())

  // Weight Sets (for selection)
  const [weightSets, setWeightSets] = useState<WeightSet[]>([])

  // Reference Weights (Step 8) data
  const [referenceWeights, setReferenceWeights] = useState<ReferenceWeight[]>(() => createInitialReferenceWeights())

  const resetDeviceDependentState = () => {
    setDevice(createInitialDeviceFields())
    setLinearityRecords(createInitialLinearityRecords())
    setEccentricity(createInitialEccentricity())
    setRepeatability(createInitialRepeatability())
    setUncertainty(createInitialUncertainty())
    setCustomer(createInitialCustomerFields())
    setSelectedCustomer(null)
    setCustomerNameInputValue('')
  }

  const updateUncertaintyValue = (
    table: 'tableOne' | 'tableTwo',
    column: (typeof uncertaintyTableOneColumns)[number] | (typeof uncertaintyTableTwoColumns)[number],
    value: string
  ) => {
    setUncertainty(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        [column]: value
      }
    }))
  }

  const applyDeviceData = deviceRecord => {
    setDevice({
      manufacturer: deviceRecord.manufacturer || '',
      serialNo: deviceRecord.serialNumber || '',
      model: deviceRecord.model || '',
      terminalModel: deviceRecord.terminalModel || '',
      maxCapacity: deviceRecord.maxCapacity || '',
      tagNo: deviceRecord.tagNumber || '',
      readability: deviceRecord.readability || '',
      verificationValue: deviceRecord.verificationValue || '',
      location: deviceRecord.location || ''
    })

    if (Array.isArray(deviceRecord.linearityRows) && deviceRecord.linearityRows.length > 0) {
      setLinearityRecords(
        deviceRecord.linearityRows.map(row => ({
          nominalValue: row.nominalValue || '',
          reading: row.reading || '',
          error: row.error || '',
          allowableError: row.allowableError || '',
          withinTolerances: row.withinTolerance || ''
        }))
      )
    } else {
      setLinearityRecords(createInitialLinearityRecords())
    }

    if (deviceRecord.eccentricityData) {
      const eccData = deviceRecord.eccentricityData
      setEccentricity({
        testWeight: eccData.testWeight || '',
        positions: ECCENTRICITY_POSITION_MAP.map(position => ({
          position: position.label,
          displayedValue: (eccData.positions[position.key]?.displayedValue as string) || '',
          deviation: (eccData.positions[position.key]?.deviation as string) || ''
        })),
        maximumDeviation: eccData.maximumDeviation || '',
        allowableDeviation: eccData.allowableDeviation || '',
        withinTolerances: eccData.withinTolerance || ''
      })
    } else {
      setEccentricity(createInitialEccentricity())
    }

    if (deviceRecord.repeatabilityData) {
      const repeatData = deviceRecord.repeatabilityData
      const defaultMeasurements = createInitialRepeatability().measurements
      const mappedMeasurements =
        Array.isArray(repeatData.measurements) && repeatData.measurements.length > 0
          ? repeatData.measurements.map(entry => ({
              withoutTestWeight: entry.withoutTestWeight || '',
              withTestWeight: entry.withTestWeight || '',
              asFound: entry.asFound || ''
            }))
          : defaultMeasurements
      setRepeatability({
        testWeight: repeatData.testWeight || '',
        measurements: mappedMeasurements,
        deviation: repeatData.deviation || '',
        allowableError: repeatData.allowableError || '',
        withinTolerances: repeatData.withinTolerance || ''
      })
    } else {
      setRepeatability(createInitialRepeatability())
    }

    if (deviceRecord.uncertaintyData) {
      const template = createInitialUncertainty()
      const mappedTableOne = { ...template.tableOne }
      const mappedTableTwo = { ...template.tableTwo }

      uncertaintyTableOneColumns.forEach(column => {
        mappedTableOne[column] = deviceRecord.uncertaintyData.tableOne?.[column] || ''
      })
      uncertaintyTableTwoColumns.forEach(column => {
        mappedTableTwo[column] = deviceRecord.uncertaintyData.tableTwo?.[column] || ''
      })

      setUncertainty({
        tableOne: mappedTableOne,
        tableTwo: mappedTableTwo
      })
    } else {
      setUncertainty(createInitialUncertainty())
    }

    const matchedCustomerName = (deviceRecord.customer || '').trim()
    if (matchedCustomerName) {
      const lowerName = matchedCustomerName.toLowerCase()
      const matchedOption =
        customerOptions.find(option => {
          const optionName = (option?.customerName || option?.name || '').toLowerCase()
          const optionCompany = (option?.company || '').toLowerCase()
          return optionName === lowerName || optionCompany === lowerName
        }) || null

      const storedCustomer = findStoredCustomerByName(matchedCustomerName)
      const normalizedStored = storedCustomer ? normalizeCustomerOption(storedCustomer) : null
      const fallbackLocation = matchedOption?.location || normalizedStored?.location || ''
      const derivedLocation = deriveCityStateFromLocation(fallbackLocation)

      const resolvedCompany = matchedOption?.company || normalizedStored?.company || matchedCustomerName
      const resolvedAddress = matchedOption?.address || normalizedStored?.address || ''
      const resolvedCity = matchedOption?.city || normalizedStored?.city || derivedLocation.city
      const resolvedState = matchedOption?.state || normalizedStored?.state || derivedLocation.state
      const resolvedZip = matchedOption?.zip || normalizedStored?.zip || normalizedStored?.pincode || ''
      const resolvedContact = matchedOption?.contactPerson || normalizedStored?.contactPerson || ''
      const resolvedMobile = matchedOption?.mobile || normalizedStored?.mobile || ''

      if (matchedOption) {
        setSelectedCustomer(matchedOption)
        setCustomerNameInputValue(matchedOption.customerName || matchedOption.name || matchedCustomerName)
      } else {
        setSelectedCustomer(null)
        setCustomerNameInputValue(normalizedStored?.customerName || normalizedStored?.name || matchedCustomerName)
      }

      setCustomer({
        company: resolvedCompany,
        address: resolvedAddress,
        city: resolvedCity,
        state: resolvedState,
        zip: resolvedZip,
        contact: resolvedContact,
        mobile: resolvedMobile
      })
    } else {
      setSelectedCustomer(null)
      setCustomerNameInputValue('')
      setCustomer(createInitialCustomerFields())
    }
  }

  useEffect(() => {
    try {
      const storedDevices = localStorage.getItem('devices')
      if (storedDevices) {
        const parsed = JSON.parse(storedDevices)
        if (Array.isArray(parsed) && parsed.length > 0) {
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

  // Load weight sets from localStorage
  useEffect(() => {
    try {
      const storedWeightSets = localStorage.getItem('weightSets')
      if (storedWeightSets) {
        const parsed = JSON.parse(storedWeightSets)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWeightSets(parsed)
          return
        }
      }
      // If no stored weight sets, use default sample data
      const defaultWeightSets: WeightSet[] = [
        {
          id: '1',
          weightSetNo: 'Colgate Std. Weights – 20 kg',
          certificateNumber: 'KC/M/0097/25-27',
          class: 'M1',
          dateOfIssue: '12.08.2025',
          calibrationDueDate: '11.08.2027',
          createdAt: '14.10.2025 18:39'
        },
        {
          id: '2',
          weightSetNo: 'Amnel Pharma Weights – 5 kg',
          certificateNumber: 'RJ/M/0145/25-27',
          class: 'F2',
          dateOfIssue: '03.09.2025',
          calibrationDueDate: '02.09.2026',
          createdAt: '05.09.2025 09:15'
        },
        {
          id: '3',
          weightSetNo: 'Vertex Lab Weights – 10 kg',
          certificateNumber: 'RJ/M/0225/24-26',
          class: 'M2',
          dateOfIssue: '18.11.2024',
          calibrationDueDate: '17.11.2026',
          createdAt: '19.11.2024 16:42'
        },
        {
          id: '4',
          weightSetNo: 'Everest Biotech Weights – 50 kg',
          certificateNumber: 'RJ/M/0310/25-27',
          class: 'M1',
          dateOfIssue: '22.01.2025',
          calibrationDueDate: '21.01.2027',
          createdAt: '24.01.2025 11:20'
        },
        {
          id: '5',
          weightSetNo: 'Zenith Industries Weights – 2 kg',
          certificateNumber: 'RJ/M/0412/25-26',
          class: 'F1',
          dateOfIssue: '05.02.2025',
          calibrationDueDate: '04.02.2026',
          createdAt: '06.02.2025 14:08'
        }
      ]
      setWeightSets(defaultWeightSets)
    } catch (error) {
      console.error('Failed to load weight sets:', error)
      setWeightSets([])
    }
  }, [])

  const deviceNameOptions = useMemo(() => {
    const uniqueNames = new Set<string>()
    devices.forEach(item => {
      if (item.deviceName) {
        uniqueNames.add(item.deviceName)
      }
    })
    return Array.from(uniqueNames).sort((a, b) => a.localeCompare(b))
  }, [devices])

  const serialNumberOptions = useMemo(() => {
    if (!selectedDeviceName) return []
    const serials = new Set<string>()
    devices.forEach(item => {
      if (item.deviceName === selectedDeviceName && item.serialNumber) {
        serials.add(item.serialNumber)
      }
    })
    return Array.from(serials).sort((a, b) => a.localeCompare(b))
  }, [devices, selectedDeviceName])

  const handleDeviceNameSelect = (_, newValue) => {
    setSelectedDeviceName(newValue)
    setDeviceNameInputValue(newValue || '')
    setSerialNumberInputValue('')
    resetDeviceDependentState()
  }

  const handleSerialNumberSelect = (_, newValue) => {
    setSerialNumberInputValue(newValue || '')
    if (!newValue) {
      resetDeviceDependentState()
      return
    }

    const targetDevice = devices.find(
      item => item.serialNumber === newValue && (!selectedDeviceName || item.deviceName === selectedDeviceName)
    )

    if (targetDevice) {
      applyDeviceData(targetDevice)
    } else {
      resetDeviceDependentState()
    }
  }

  const handleCalibrationFieldChange = (field, value) => {
    setCalibrationDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCalibrationSignatureUpload = event => {
    const file = event?.target?.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      setCalibrationDetails(prev => ({
        ...prev,
        engineerSignature: e?.target?.result || ''
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleCalibrationSignatureRemove = () => {
    setCalibrationDetails(prev => ({
      ...prev,
      engineerSignature: ''
    }))
    if (calibrationSignatureInputRef.current) {
      calibrationSignatureInputRef.current.value = ''
    }
  }

  // Reference Weights handlers
  const handleWeightSetSelect = (event, selectedWeightSets) => {
    if (!selectedWeightSets || selectedWeightSets.length === 0) {
      setReferenceWeights([])
      return
    }

    // Convert selected WeightSets to ReferenceWeights
    const newReferenceWeights: ReferenceWeight[] = selectedWeightSets.map((ws: WeightSet) => {
      // Check if this weight set is already in reference weights
      const existing = referenceWeights.find(rw => rw.id === ws.id)
      if (existing) {
        return existing // Keep existing data if already added
      }
      // Create new reference weight from weight set
      return {
        id: ws.id,
        weightSetNo: ws.weightSetNo,
        certificateNumber: ws.certificateNumber,
        class: ws.class,
        dateOfIssue: ws.dateOfIssue,
        calibrationDueDate: ws.calibrationDueDate
      }
    })

    // Remove weight sets that are no longer selected
    const selectedIds = new Set(selectedWeightSets.map((ws: WeightSet) => ws.id))
    const filteredReferenceWeights = newReferenceWeights.filter(rw => selectedIds.has(rw.id))

    setReferenceWeights(filteredReferenceWeights)
  }

  const handleReferenceWeightChange = (id: string, field: keyof ReferenceWeight, value: string) => {
    setReferenceWeights(prev => prev.map(rw => (rw.id === id ? { ...rw, [field]: value } : rw)))
  }

  const handleRemoveReferenceWeight = (id: string) => {
    setReferenceWeights(prev => prev.filter(rw => rw.id !== id))
  }

  // PDF Generation function
  const generatePDF = useCallback(() => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 10 // Optimized margin for 3-page layout
    const contentWidth = pageWidth - margin * 2
    let yPos = margin

    // Set font to Helvetica (default in jsPDF, professional for ISO certificates)
    doc.setFont('helvetica')

    // Helper function to format date
    const formatDate = dateString => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      } catch {
        return dateString
      }
    }

    // Helper function to draw section divider
    const drawSectionDivider = y => {
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.line(margin, y, pageWidth - margin, y)
    }

    // Helper function to draw labeled value (clean layout without underlines)
    const drawLabelValue = (label, value, x, y, labelWidth = 48, allowWrap = true) => {
      doc.setFontSize(8.5) // Slightly reduced font size
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100) // Gray for labels
      doc.text(label + ':', x, y)
      doc.setTextColor(0, 0, 0) // Black for values
      doc.setFont('helvetica', 'normal')
      // Reduced gap - values appear much closer to labels
      const valueX = x + labelWidth + 2 // Just 2px gap after label
      const maxWidth = contentWidth / 2 - labelWidth - 8 // Adjusted for tighter layout

      if (!value) {
        return 3.5 // Reduced minimum height
      }

      // For fields that shouldn't wrap (phone, serial, etc.), display as-is
      if (!allowWrap) {
        // Display value directly
        doc.text(value, valueX, y)
        return 3.5
      }

      // Allow wrapping for addresses and long text
      const wrappedText = doc.splitTextToSize(value, maxWidth)
      doc.text(wrappedText, valueX, y)
      return Math.max(wrappedText.length * 4, 3.5) // Reduced line height
    }

    // Helper function to split address into multiple lines
    const splitAddress = (address, maxWidth) => {
      if (!address) return ['']
      const words = address.split(' ')
      const lines = []
      let currentLine = ''

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        doc.setFontSize(9)
        if (doc.getTextWidth(testLine) <= maxWidth) {
          currentLine = testLine
        } else {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        }
      })
      if (currentLine) lines.push(currentLine)
      return lines.length > 0 ? lines : ['']
    }

    // Helper to draw merged header cell with gray background
    const drawMergedHeaderCell = (text, startX, width, y, height, align = 'center') => {
      const headerBgColor = [240, 240, 240]
      const borderColor = [180, 180, 180]
      const cellPadding = 3 // Reduced padding

      doc.setFillColor(headerBgColor[0], headerBgColor[1], headerBgColor[2])
      doc.rect(startX, y, width, height, 'F')
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.3)
      doc.rect(startX, y, width, height, 'S')
      doc.setFontSize(8.5) // Slightly reduced font size
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(50, 50, 50)
      const textWidth = doc.getTextWidth(text)
      const textX = align === 'center' ? startX + width / 2 - textWidth / 2 : startX + cellPadding
      doc.text(text, textX, y + 5) // Reduced vertical offset
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
    }

    // ==================== HEADER SECTION ====================
    // Company Name (centered at top)
    doc.setFontSize(14) // Reduced from 15
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const companyName = 'RJ Technologies'
    const companyNameWidth = doc.getTextWidth(companyName)
    doc.text(companyName, (pageWidth - companyNameWidth) / 2, yPos)

    // Company Address (centered below name)
    yPos += 5 // Reduced spacing
    doc.setFontSize(8.5) // Reduced font size
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    const companyAddress = '301, Shahjanand Plaza, Bhattha, Paldi, Ahmedabad - 380007'
    const addressLines = splitAddress(companyAddress, contentWidth - 10)
    addressLines.forEach((line, index) => {
      const lineWidth = doc.getTextWidth(line)
      doc.text(line, (pageWidth - lineWidth) / 2, yPos + index * 4)
    })
    yPos += addressLines.length * 4 + 6 // Reduced spacing before title

    // Certificate Title and Number (on same line)
    doc.setFontSize(12) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const title = 'Calibration Certificate'

    // Certificate Number (right-aligned on same line as title)
    doc.setFontSize(8) // Reduced font size
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    const certNoText = `Certificate No.: ${certificateNo || 'N/A'}`
    const certNoWidth = doc.getTextWidth(certNoText)
    const certNoX = pageWidth - margin - certNoWidth

    // Title left-aligned, certificate number on right
    const titleX = margin
    doc.setFontSize(12) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(title, titleX, yPos)

    // Certificate number on same line, right-aligned
    doc.setFontSize(8) // Reduced font size
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(certNoText, certNoX, yPos)

    yPos += 10 // Increased spacing after main heading

    // Common spacing variables for all sections
    const leftColX = margin
    const rightColX = margin + contentWidth / 2 + 6 // Reduced gap between columns
    const labelWidth = 45 // Reduced label width for tighter spacing
    const lineSpacing = 3.5 // Reduced line spacing

    // ==================== CUSTOMER SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Customer Information', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1) // Only bottom divider, no top border
    yPos += 4 // Reduced spacing after divider

    // Customer details in two columns with clean layout
    let maxY = yPos

    // Left column
    doc.setFontSize(8.5)
    let leftY = yPos

    // Company
    const companyHeight = drawLabelValue('Company', customer.company || '', leftColX, leftY, labelWidth, true)
    leftY += Math.max(companyHeight, lineSpacing)

    // Address handling (allow wrapping)
    const addressText = customer.address || ''
    if (addressText) {
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text('Address:', leftColX, leftY)
      doc.setTextColor(0, 0, 0)
      const addressMaxWidth = contentWidth / 2 - labelWidth - 8 // Reduced padding
      const addressLines = doc.splitTextToSize(addressText.replace(/\n/g, ' '), addressMaxWidth)
      addressLines.forEach((line, idx) => {
        doc.text(line, leftColX + labelWidth + 2, leftY + idx * 4) // Reduced line spacing
      })
      leftY += Math.max(addressLines.length * 4, lineSpacing)
    } else {
      leftY += drawLabelValue('Address', '', leftColX, leftY, labelWidth, true)
      leftY += lineSpacing
    }

    // City (no wrap)
    leftY += drawLabelValue('City', customer.city || '', leftColX, leftY, labelWidth, false)
    leftY += lineSpacing

    // Zip/Postal (no wrap)
    leftY += drawLabelValue('Zip/Postal', customer.zip || '', leftColX, leftY, labelWidth, false)
    leftY += lineSpacing

    // Contact (no wrap)
    leftY += drawLabelValue('Contact', customer.contact || '', leftColX, leftY, labelWidth, false)

    // Right column
    let rightY = yPos

    // State/Province (allow wrapping if long)
    rightY += drawLabelValue('State/Province', customer.state || '', rightColX, rightY, labelWidth, true)
    rightY += lineSpacing

    // Mobile No. (no wrap - keep phone numbers together)
    rightY += drawLabelValue('Mobile No.', customer.mobile || '', rightColX, rightY, labelWidth, false)

    maxY = Math.max(leftY, rightY)
    yPos = maxY + 6 // Reduced spacing after customer section

    // ==================== DEVICE SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Device Information', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1) // Only bottom divider, no top border
    yPos += 4 // Reduced spacing after divider

    // Device details in two columns (reuse same spacing settings)
    leftY = yPos
    rightY = yPos
    maxY = yPos

    // Left column (no wrapping for these fields)
    leftY += drawLabelValue('Manufacturer', device.manufacturer || '', leftColX, leftY, labelWidth, false)
    leftY += lineSpacing
    leftY += drawLabelValue('Model', device.model || '', leftColX, leftY, labelWidth, false)
    leftY += lineSpacing
    leftY += drawLabelValue('Max Capacity', device.maxCapacity || '', leftColX, leftY, labelWidth, false)
    leftY += lineSpacing
    leftY += drawLabelValue('Readability', device.readability || '', leftColX, leftY, labelWidth, false)
    leftY += lineSpacing
    leftY += drawLabelValue('Location', device.location || '', leftColX, leftY, labelWidth, false)

    // Right column (no wrapping for serial numbers and codes)
    rightY += drawLabelValue('Serial No.', device.serialNo || '', rightColX, rightY, labelWidth, false)
    rightY += lineSpacing
    rightY += drawLabelValue('Terminal Model', device.terminalModel || '', rightColX, rightY, labelWidth, false)
    rightY += lineSpacing
    rightY += drawLabelValue('Tag No.', device.tagNo || '', rightColX, rightY, labelWidth, false)
    rightY += lineSpacing
    rightY += drawLabelValue('Verification Value', device.verificationValue || '', rightColX, rightY, labelWidth, false)

    maxY = Math.max(leftY, rightY)
    yPos = maxY + 6 // Reduced spacing after device section

    // ==================== CALIBRATION DATES SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Calibration Dates', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1) // Only bottom divider, no top border
    yPos += 4 // Reduced spacing after divider

    // Calibration dates in two columns
    leftY = yPos
    rightY = yPos

    leftY += drawLabelValue(
      'As Found Date',
      formatDate(calibrationDetails.asFoundCalibrationDate),
      leftColX,
      leftY,
      labelWidth,
      false
    )
    leftY += lineSpacing
    leftY += drawLabelValue(
      'As Left Date',
      formatDate(calibrationDetails.asLeftCalibrationDate),
      leftColX,
      leftY,
      labelWidth,
      false
    )

    rightY += drawLabelValue(
      'Issue Date',
      formatDate(calibrationDetails.issueDate),
      rightColX,
      rightY,
      labelWidth,
      false
    )
    rightY += lineSpacing
    rightY += drawLabelValue(
      'Next Cal. Due',
      formatDate(calibrationDetails.nextCalibrationDueDate),
      rightColX,
      rightY,
      labelWidth,
      false
    )

    maxY = Math.max(leftY, rightY)
    yPos = maxY + 6 // Reduced spacing

    // ==================== PROCEDURE TEMPLATE SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Procedure Template', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1) // Only bottom divider, no top border
    yPos += 4 // Reduced spacing after divider

    // Display Procedure Template with word wrapping
    const procedureText = procedureTemplate || ''
    doc.setFontSize(8.5) // Reduced font size
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    const procedureLines = doc.splitTextToSize(procedureText, contentWidth)
    const templateLineHeight = 4.2 // Reduced line height

    procedureLines.forEach(line => {
      // Check if we need a new page
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = margin
      }
      doc.text(line, margin, yPos)
      yPos += templateLineHeight
    })

    yPos += 6 // Reduced spacing

    // ==================== LINEARITY SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Linearity', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1) // Only bottom divider, no top border
    yPos += 4 // Reduced spacing after divider

    // Filter out empty records
    const validRecords = linearityRecords.filter(
      record =>
        record.nominalValue || record.reading || record.error || record.allowableError || record.withinTolerances
    )

    if (validRecords.length > 0) {
      // Linearity Table Setup - Improved styling with proper spacing and borders
      // Optimized column widths for better readability
      const linCol1Width = contentWidth * 0.18 // Nominal Value
      const linCol2Width = contentWidth * 0.22 // Reading
      const linCol3Width = contentWidth * 0.18 // Error
      const linCol4Width = contentWidth * 0.24 // Allowable Error
      const linCol5Width = contentWidth * 0.18 // Within Tolerances
      const linRowHeight = 6.5 // Reduced row height for compact layout
      const linHeaderRowHeight = 7 // Reduced header height
      const linBorderColor = [180, 180, 180]
      const linCellPadding = 3 // Reduced padding

      // Column headers
      const headers = ['Nominal Value', 'Reading', 'Error', 'Allowable Error', 'Within Tolerances']
      const colWidths = [linCol1Width, linCol2Width, linCol3Width, linCol4Width, linCol5Width]

      // Helper function to draw a complete row with all borders
      const drawLinearRow = (rowY, values, isHeader = false, rowHeight = linRowHeight) => {
        const bgColor = isHeader ? [240, 240, 240] : [255, 255, 255]
        const textColor = isHeader ? [50, 50, 50] : [0, 0, 0]
        const borderColor = isHeader ? linBorderColor : [200, 200, 200]
        const fontWeight = isHeader ? 'bold' : 'normal'
        const lineWidth = isHeader ? 0.3 : 0.2

        // Set background color
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
        doc.rect(margin, rowY, contentWidth, rowHeight, 'F')

        // Draw outer border
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
        doc.setLineWidth(lineWidth)
        doc.rect(margin, rowY, contentWidth, rowHeight, 'S')

        // Draw vertical lines between cells
        let xPos = margin
        for (let i = 0; i < colWidths.length - 1; i++) {
          xPos += colWidths[i]
          doc.line(xPos, rowY, xPos, rowY + rowHeight)
        }

        // Draw text in each cell with proper vertical centering
        doc.setFontSize(8.5) // Reduced font size
        doc.setFont('helvetica', fontWeight)
        doc.setTextColor(textColor[0], textColor[1], textColor[2])
        let cellXPos = margin + linCellPadding
        const textY = rowY + rowHeight / 2 + 1.5 // Center text vertically
        values.forEach((value, index) => {
          doc.text(value || '', cellXPos, textY)
          cellXPos += colWidths[index]
        })
      }

      // Draw header row
      const headerY = yPos
      drawLinearRow(headerY, headers, true, linHeaderRowHeight)
      yPos += linHeaderRowHeight

      // Draw data rows
      validRecords.forEach(record => {
        // Check if we need a new page
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = margin
          // Redraw header on new page
          drawLinearRow(yPos, headers, true, linHeaderRowHeight)
          yPos += linHeaderRowHeight
        }

        const values = [
          record.nominalValue || '',
          record.reading || '',
          record.error || '',
          record.allowableError || '',
          record.withinTolerances || ''
        ]

        // Draw data row
        drawLinearRow(yPos, values, false)
        yPos += linRowHeight
      })

      // Add spacing after the table
      yPos += 8 // Reduced spacing
    } else {
      yPos += 6
    }

    // ==================== ECCENTRICITY SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 100) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Eccentricity', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1) // Only bottom divider, no top border
    yPos += 4 // Reduced spacing after divider

    // Two-column layout setup
    const columnGap = 6 // Reduced gap between image and table
    const imageColumnWidth = contentWidth * 0.2 // Left column (image) - 46% of content width
    const tableColumnWidth = contentWidth * 0.72 // Right column (table) - 46% of content width
    const imageColumnX = margin // Left column starting X position
    const tableColumnX = margin + imageColumnWidth + columnGap // Right column starting X position

    // Calculate table dimensions first (without drawing)
    const eccCol1Width = tableColumnWidth * 0.35 // Position column (35% of table width)
    const eccCol2Width = tableColumnWidth * 0.325 // Displayed Value column (32.5% of table width)
    const eccCol3Width = tableColumnWidth * 0.325 // Deviation column (32.5% of table width)
    const eccRowHeight = 6 // Reduced row height
    const eccHeaderRowHeight = 7 // Reduced header height
    const borderColor = [180, 180, 180]
    const cellPadding = 3 // Reduced padding

    // Calculate total table height
    const numDataRows = eccentricity.positions.length
    const numSummaryRows = 3
    const totalTableHeight =
      eccHeaderRowHeight * 3 + // 3 header rows
      eccRowHeight * numDataRows + // Data rows
      eccRowHeight * numSummaryRows // Summary rows

    // Calculate image dimensions
    let imageWidth = imageColumnWidth - 4 // Leave 2px padding on each side
    let imageHeight = 0
    let imageX = imageColumnX + 2 // 2px padding from left
    let imageY = yPos

    if (eccentricityImageData && eccentricityImageDimensions) {
      const aspectRatio = eccentricityImageDimensions.width / eccentricityImageDimensions.height
      imageHeight = imageWidth / aspectRatio

      // If image is too tall, scale it down to fit within a reasonable height
      const maxImageHeight = Math.min(totalTableHeight, pageHeight - yPos - 20)
      if (imageHeight > maxImageHeight) {
        imageHeight = maxImageHeight
        imageWidth = imageHeight * aspectRatio
        // Re-center horizontally if image is smaller than column
        imageX = imageColumnX + (imageColumnWidth - imageWidth) / 2
      }

      // Vertically center image if it's shorter than table
      if (imageHeight < totalTableHeight) {
        imageY = yPos + (totalTableHeight - imageHeight) / 2
      }
    } else {
      // If image not loaded, use a placeholder height
      imageHeight = totalTableHeight
    }

    // Calculate the starting Y position for the table to vertically center it
    let tableStartY = yPos
    if (imageHeight < totalTableHeight) {
      // Table is taller, start at yPos
      tableStartY = yPos
    } else {
      // Image is taller or equal, center the table
      tableStartY = yPos + (imageHeight - totalTableHeight) / 2
    }

    // Draw vertical separator line between columns
    const separatorX = imageColumnX + imageColumnWidth + columnGap / 2
    const separatorHeight = Math.max(totalTableHeight, imageHeight)
    doc.setDrawColor(200, 200, 200) // Light gray separator
    doc.setLineWidth(0.2)
    doc.line(separatorX, yPos, separatorX, yPos + separatorHeight)

    // Draw the image on the left side
    if (eccentricityImageData && eccentricityImageDimensions) {
      try {
        // Extract base64 data and format
        let imageData = eccentricityImageData
        let imageFormat = 'JPEG'

        if (imageData.startsWith('data:image/')) {
          const commaIndex = imageData.indexOf(',')
          if (commaIndex > 0) {
            const metadataPart = imageData.substring(0, commaIndex)
            imageData = imageData.substring(commaIndex + 1)
            const typeMatch = metadataPart.match(/image\/([^;]+)/i)
            if (typeMatch) {
              const mimeType = typeMatch[1].toLowerCase()
              if (mimeType === 'jpeg' || mimeType === 'jpg') {
                imageFormat = 'JPEG'
              } else if (mimeType === 'png') {
                imageFormat = 'PNG'
              }
            }
          }
        }

        // Add image to PDF
        doc.addImage(imageData, imageFormat, imageX, imageY, imageWidth, imageHeight, undefined, 'FAST')
      } catch (error) {
        console.error('Error adding eccentricity image to PDF:', error)
        // If image fails, draw a placeholder rectangle
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.5)
        doc.rect(imageColumnX + 2, yPos, imageColumnWidth - 4, Math.min(totalTableHeight, 60), 'S')
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text('Image', imageColumnX + imageColumnWidth / 2 - 10, yPos + 30)
      }
    } else {
      // Image not loaded, draw placeholder
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.5)
      doc.rect(imageColumnX + 2, yPos, imageColumnWidth - 4, Math.min(totalTableHeight, 60), 'S')
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Diagram', imageColumnX + imageColumnWidth / 2 - 12, yPos + 30)
    }

    // Draw the table on the right side
    let currentTableY = tableStartY

    // Header Row 1: "Test Weight" | "50 kg" (merged 2 cols)
    const header1Y = currentTableY
    drawMergedHeaderCell('Test Weight', tableColumnX, eccCol1Width, header1Y, eccHeaderRowHeight, 'left')
    drawMergedHeaderCell(
      eccentricity.testWeight || '50 kg',
      tableColumnX + eccCol1Width,
      eccCol2Width + eccCol3Width,
      header1Y,
      eccHeaderRowHeight,
      'center'
    )
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.setLineWidth(0.3)
    doc.line(tableColumnX + eccCol1Width, header1Y, tableColumnX + eccCol1Width, header1Y + eccHeaderRowHeight)
    currentTableY += eccHeaderRowHeight

    // Header Row 2: "Position" | "As Found" (merged 2 cols)
    const header2Y = currentTableY
    drawMergedHeaderCell('Position', tableColumnX, eccCol1Width, header2Y, eccHeaderRowHeight, 'left')
    drawMergedHeaderCell(
      'As Found',
      tableColumnX + eccCol1Width,
      eccCol2Width + eccCol3Width,
      header2Y,
      eccHeaderRowHeight,
      'center'
    )
    doc.line(tableColumnX + eccCol1Width, header2Y, tableColumnX + eccCol1Width, header2Y + eccHeaderRowHeight)
    currentTableY += eccHeaderRowHeight

    // Header Row 3: (empty) | "Displayed Value" | "Deviation"
    const header3Y = currentTableY
    drawMergedHeaderCell('', tableColumnX, eccCol1Width, header3Y, eccHeaderRowHeight, 'left')
    drawMergedHeaderCell(
      'Displayed Value',
      tableColumnX + eccCol1Width,
      eccCol2Width,
      header3Y,
      eccHeaderRowHeight,
      'center'
    )
    drawMergedHeaderCell(
      'Deviation',
      tableColumnX + eccCol1Width + eccCol2Width,
      eccCol3Width,
      header3Y,
      eccHeaderRowHeight,
      'center'
    )
    doc.line(tableColumnX + eccCol1Width, header3Y, tableColumnX + eccCol1Width, header3Y + eccHeaderRowHeight)
    doc.line(
      tableColumnX + eccCol1Width + eccCol2Width,
      header3Y,
      tableColumnX + eccCol1Width + eccCol2Width,
      header3Y + eccHeaderRowHeight
    )
    currentTableY += eccHeaderRowHeight

    // Data Rows
    eccentricity.positions.forEach(pos => {
      const values = [pos.position || '', pos.displayedValue || '', pos.deviation || '']

      // Draw row with special handling for centered columns
      doc.setFontSize(8.5) // Reduced font size
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      const rowY = currentTableY
      const borderColorRow = [200, 200, 200]
      doc.setDrawColor(borderColorRow[0], borderColorRow[1], borderColorRow[2])
      doc.setLineWidth(0.2)
      doc.rect(tableColumnX, rowY, tableColumnWidth, eccRowHeight, 'S')

      // Position (left-aligned)
      doc.text(values[0], tableColumnX + cellPadding, rowY + 4.5) // Adjusted vertical position
      doc.line(tableColumnX + eccCol1Width, rowY, tableColumnX + eccCol1Width, rowY + eccRowHeight)

      // Displayed Value (centered)
      const dispTextWidth = doc.getTextWidth(values[1])
      doc.text(values[1], tableColumnX + eccCol1Width + eccCol2Width / 2 - dispTextWidth / 2, rowY + 4.5) // Adjusted vertical position
      doc.line(
        tableColumnX + eccCol1Width + eccCol2Width,
        rowY,
        tableColumnX + eccCol1Width + eccCol2Width,
        rowY + eccRowHeight
      )

      // Deviation (centered)
      const devTextWidth = doc.getTextWidth(values[2])
      doc.text(values[2], tableColumnX + eccCol1Width + eccCol2Width + eccCol3Width / 2 - devTextWidth / 2, rowY + 4.5) // Adjusted vertical position

      currentTableY += eccRowHeight
    })

    // Summary Rows
    const drawSummaryRow = (label, value) => {
      doc.setFontSize(8.5) // Reduced font size
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      const rowY = currentTableY
      const borderColorRow = [200, 200, 200]
      doc.setDrawColor(borderColorRow[0], borderColorRow[1], borderColorRow[2])
      doc.setLineWidth(0.2)
      doc.rect(tableColumnX, rowY, tableColumnWidth, eccRowHeight, 'S')

      // Label (left-aligned)
      doc.text(label, tableColumnX + cellPadding, rowY + 4.5) // Adjusted vertical position
      doc.line(tableColumnX + eccCol1Width, rowY, tableColumnX + eccCol1Width, rowY + eccRowHeight)

      // Value (centered in merged columns)
      const mergedWidth = eccCol2Width + eccCol3Width
      const valueWidth = doc.getTextWidth(value)
      doc.text(value, tableColumnX + eccCol1Width + mergedWidth / 2 - valueWidth / 2, rowY + 4.5) // Adjusted vertical position

      currentTableY += eccRowHeight
    }

    drawSummaryRow('Maximum Deviation:', eccentricity.maximumDeviation || '')
    drawSummaryRow('Allowable Deviation:', eccentricity.allowableDeviation || '')
    drawSummaryRow('Within Tolerances:', eccentricity.withinTolerances || '')

    // Update yPos to after the section (use the maximum height of image or table)
    yPos += Math.max(totalTableHeight, imageHeight) + 8 // Reduced spacing

    // ==================== REPEATABILITY SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 100) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Repeatability', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1) // Only bottom divider, no top border
    yPos += 4 // Reduced spacing after divider

    // Filter out empty records
    const validMeasurements = repeatability.measurements.filter(
      m => m.withoutTestWeight || m.withTestWeight || m.asFound
    )

    if (validMeasurements.length > 0) {
      // Repeatability Table Setup
      const repCol1Width = contentWidth * 0.33 // Without Test Weight column
      const repCol2Width = contentWidth * 0.33 // With Test Weight column
      const repCol3Width = contentWidth * 0.34 // As Found column
      const repRowHeight = 6 // Reduced row height
      const repHeaderRowHeight = 7 // Reduced header height
      const borderColor = [180, 180, 180]
      const cellPadding = 3 // Reduced padding

      // Header Row 1: "Test Weight" | "75 kg" (merged cols 2-3)
      const repHeader1Y = yPos
      drawMergedHeaderCell('Test Weight', margin, repCol1Width, repHeader1Y, repHeaderRowHeight, 'center')
      drawMergedHeaderCell(
        repeatability.testWeight || '75 kg',
        margin + repCol1Width,
        repCol2Width + repCol3Width,
        repHeader1Y,
        repHeaderRowHeight,
        'center'
      )
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.line(margin + repCol1Width, repHeader1Y, margin + repCol1Width, repHeader1Y + repHeaderRowHeight)
      yPos += repHeaderRowHeight

      // Header Row 2: "Without Test Weight" | "With Test Weight" | "As Found"
      const repHeader2Y = yPos
      drawMergedHeaderCell('Without Test Weight', margin, repCol1Width, repHeader2Y, repHeaderRowHeight, 'center')
      drawMergedHeaderCell(
        'With Test Weight',
        margin + repCol1Width,
        repCol2Width,
        repHeader2Y,
        repHeaderRowHeight,
        'center'
      )
      drawMergedHeaderCell(
        'As Found',
        margin + repCol1Width + repCol2Width,
        repCol3Width,
        repHeader2Y,
        repHeaderRowHeight,
        'center'
      )
      doc.line(margin + repCol1Width, repHeader2Y, margin + repCol1Width, repHeader2Y + repHeaderRowHeight)
      doc.line(
        margin + repCol1Width + repCol2Width,
        repHeader2Y,
        margin + repCol1Width + repCol2Width,
        repHeader2Y + repHeaderRowHeight
      )
      yPos += repHeaderRowHeight

      // Data Rows: Each measurement is a row
      validMeasurements.forEach(measurement => {
        // Check if we need a new page
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = margin
        }

        const values = [
          measurement.withoutTestWeight || '',
          measurement.withTestWeight || '',
          measurement.asFound || ''
        ]

        // Draw row with centered values
        doc.setFontSize(8.5) // Reduced font size
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        const rowY = yPos
        const borderColorRow = [200, 200, 200]
        doc.setDrawColor(borderColorRow[0], borderColorRow[1], borderColorRow[2])
        doc.setLineWidth(0.2)
        doc.rect(margin, rowY, contentWidth, repRowHeight, 'S')

        // Without Test Weight (centered)
        const withoutTextWidth = doc.getTextWidth(values[0])
        doc.text(values[0], margin + repCol1Width / 2 - withoutTextWidth / 2, rowY + 4.5) // Adjusted vertical position
        doc.line(margin + repCol1Width, rowY, margin + repCol1Width, rowY + repRowHeight)

        // With Test Weight (centered)
        const withTextWidth = doc.getTextWidth(values[1])
        doc.text(values[1], margin + repCol1Width + repCol2Width / 2 - withTextWidth / 2, rowY + 4.5) // Adjusted vertical position
        doc.line(margin + repCol1Width + repCol2Width, rowY, margin + repCol1Width + repCol2Width, rowY + repRowHeight)

        // As Found (centered)
        const asFoundTextWidth = doc.getTextWidth(values[2])
        doc.text(values[2], margin + repCol1Width + repCol2Width + repCol3Width / 2 - asFoundTextWidth / 2, rowY + 4.5) // Adjusted vertical position

        yPos += repRowHeight
      })

      // Summary Rows
      const drawRepSummaryRow = (label, value) => {
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = margin
        }

        doc.setFontSize(8.5) // Reduced font size
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        const rowY = yPos
        const borderColorRow = [200, 200, 200]
        doc.setDrawColor(borderColorRow[0], borderColorRow[1], borderColorRow[2])
        doc.setLineWidth(0.2)
        doc.rect(margin, rowY, contentWidth, repRowHeight, 'S')

        // Label (left-aligned)
        doc.text(label, margin + cellPadding, rowY + 4.5) // Adjusted vertical position
        doc.line(margin + repCol1Width, rowY, margin + repCol1Width, rowY + repRowHeight)

        // Value (centered in merged columns)
        const mergedWidth = repCol2Width + repCol3Width
        const valueWidth = doc.getTextWidth(value)
        doc.text(value, margin + repCol1Width + mergedWidth / 2 - valueWidth / 2, rowY + 4.5) // Adjusted vertical position

        yPos += repRowHeight
      }

      drawRepSummaryRow('Deviation:', repeatability.deviation || '')
      drawRepSummaryRow('Allowable Error:', repeatability.allowableError || '')
      drawRepSummaryRow('Within Tolerances:', repeatability.withinTolerances || '')

      // Add spacing after the table
      yPos += 8 // Reduced spacing
    } else {
      yPos += 6
    }

    // ==================== UNCERTAINTY SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Uncertainty', margin, yPos)
    yPos += 4 // Reduced spacing
    drawSectionDivider(yPos - 1)
    yPos += 4 // Reduced spacing

    // Get loads from uncertainty tables
    const tableOneLoads = Object.keys(uncertainty.tableOne).filter(load => load && load.trim() !== '')
    const tableTwoLoads = Object.keys(uncertainty.tableTwo).filter(load => load && load.trim() !== '')

    // Helper function to draw uncertainty table
    const drawUncertaintyTable = (tableLabel: string, loads: string[], tableData: Record<string, string>) => {
      if (loads.length === 0) return

      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = margin
      }

      // Table label
      doc.setFontSize(8.5) // Reduced font size
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(tableLabel, margin, yPos)
      yPos += 6 // Reduced spacing

      // Table setup
      const labelColWidth = contentWidth * 0.25 // "Loads Applied" / "Combined Uncertainty (u(E))" column
      const dataColWidth = (contentWidth - labelColWidth) / loads.length // Equal width for each load column
      const rowHeight = 6.5 // Reduced row height
      const headerRowHeight = 7 // Reduced header height
      const borderColor = [180, 180, 180]

      // Header Row: "Loads Applied" | Load values
      const headerY = yPos
      doc.setFontSize(8.5) // Reduced font size
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)

      // Background for header
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, headerY, contentWidth, headerRowHeight, 'F')

      // Border
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.3)
      doc.rect(margin, headerY, contentWidth, headerRowHeight, 'S')

      // "Loads Applied" label
      const labelTextWidth = doc.getTextWidth('Loads Applied')
      doc.text('Loads Applied', margin + labelColWidth / 2 - labelTextWidth / 2, headerY + 4.5) // Adjusted vertical position
      doc.line(margin + labelColWidth, headerY, margin + labelColWidth, headerY + headerRowHeight)

      // Load values
      loads.forEach((load, index) => {
        const colX = margin + labelColWidth + index * dataColWidth
        const loadTextWidth = doc.getTextWidth(load)
        doc.text(load, colX + dataColWidth / 2 - loadTextWidth / 2, headerY + 4.5) // Adjusted vertical position
        if (index < loads.length - 1) {
          doc.line(colX + dataColWidth, headerY, colX + dataColWidth, headerY + headerRowHeight)
        }
      })

      yPos += headerRowHeight

      // Data Row: "Combined Uncertainty (u(E))" | Uncertainty values
      const dataY = yPos
      doc.setFontSize(8.5) // Reduced font size
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      // Background for data row
      doc.setFillColor(250, 250, 250)
      doc.rect(margin, dataY, contentWidth, rowHeight, 'F')

      // Border
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.2)
      doc.rect(margin, dataY, contentWidth, rowHeight, 'S')

      // "Combined Uncertainty (u(E))" label
      const uncertaintyLabel = 'Combined Uncertainty (u(E))'
      const uncertaintyLabelWidth = doc.getTextWidth(uncertaintyLabel)
      doc.text(uncertaintyLabel, margin + labelColWidth / 2 - uncertaintyLabelWidth / 2, dataY + 4.5) // Adjusted vertical position
      doc.line(margin + labelColWidth, dataY, margin + labelColWidth, dataY + rowHeight)

      // Uncertainty values
      loads.forEach((load, index) => {
        const colX = margin + labelColWidth + index * dataColWidth
        const value = tableData[load] || ''
        if (value) {
          const valueTextWidth = doc.getTextWidth(value)
          doc.text(value, colX + dataColWidth / 2 - valueTextWidth / 2, dataY + 4.5) // Adjusted vertical position
        }
        if (index < loads.length - 1) {
          doc.line(colX + dataColWidth, dataY, colX + dataColWidth, dataY + rowHeight)
        }
      })

      yPos += rowHeight + 8 // Reduced spacing after table
    }

    // Draw Table 1
    if (tableOneLoads.length > 0) {
      drawUncertaintyTable('Loads Applied – Table 1', tableOneLoads, uncertainty.tableOne)
    }

    // Draw Table 2
    if (tableTwoLoads.length > 0) {
      drawUncertaintyTable('Loads Applied – Table 2', tableTwoLoads, uncertainty.tableTwo)
    }

    // If no uncertainty data, add minimal spacing
    if (tableOneLoads.length === 0 && tableTwoLoads.length === 0) {
      yPos += 6
    }

    // ==================== REFERENCE WEIGHTS SECTION ====================
    if (referenceWeights && referenceWeights.length > 0) {
      // Check if we need a new page
      if (yPos > pageHeight - 80) {
        doc.addPage()
        yPos = margin
      }

      // Section heading
      doc.setFontSize(9.5) // Reduced font size
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Reference Weights', margin, yPos)
      yPos += 4 // Reduced spacing
      drawSectionDivider(yPos - 1) // Only bottom divider, no top border
      yPos += 4 // Reduced spacing after divider

      // Traceability note
      doc.setFontSize(7.5) // Reduced font size
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(80, 80, 80)
      const traceabilityText =
        'All weights used for metrological testing are traceable to national or international standards. The weights were calibrated and certified by an accredited calibration laboratory.'
      const traceabilityLines = doc.splitTextToSize(traceabilityText, contentWidth)
      traceabilityLines.forEach(line => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
        }
        doc.text(line, margin, yPos)
        yPos += 4 // Reduced line spacing
      })
      yPos += 4 // Reduced spacing after traceability note

      // Display each weight set (using same format as Device Information section)
      referenceWeights.forEach((refWeight, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 80) {
          doc.addPage()
          yPos = margin
        }

        // Weight Set Header (similar to Device Information - no underline, just bold text)
        doc.setFontSize(8.5) // Reduced font size
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(`Weight Set ${index + 1}`, margin, yPos)
        yPos += 6 // Reduced spacing after header

        // Use same spacing settings as Device Information section
        const refWeightLeftY = yPos
        const refWeightRightY = yPos
        let refWeightMaxY = yPos

        // Left Column: Weight Set No., Class, Calibration Due Date (no wrapping)
        doc.setFontSize(9)
        let currentLeftY = refWeightLeftY
        currentLeftY += drawLabelValue(
          'Weight Set No.',
          refWeight.weightSetNo || '',
          leftColX,
          currentLeftY,
          labelWidth,
          false
        )
        currentLeftY += lineSpacing
        currentLeftY += drawLabelValue('Class', refWeight.class || '', leftColX, currentLeftY, labelWidth, false)
        currentLeftY += lineSpacing
        currentLeftY += drawLabelValue(
          'Calibration Due Date',
          refWeight.calibrationDueDate || '',
          leftColX,
          currentLeftY,
          labelWidth,
          false
        )

        // Right Column: Certificate Number, Date of Issue (no wrapping)
        let currentRightY = refWeightRightY
        currentRightY += drawLabelValue(
          'Certificate Number',
          refWeight.certificateNumber || '',
          rightColX,
          currentRightY,
          labelWidth,
          false
        )
        currentRightY += lineSpacing
        currentRightY += drawLabelValue(
          'Date of Issue',
          refWeight.dateOfIssue || '',
          rightColX,
          currentRightY,
          labelWidth,
          false
        )

        // Move yPos to the maximum of left and right columns
        refWeightMaxY = Math.max(currentLeftY, currentRightY)
        yPos = refWeightMaxY + 6 // Reduced spacing after weight set

        // Divider line between weight sets (except for last one) - same style as section dividers
        if (index < referenceWeights.length - 1) {
          drawSectionDivider(yPos)
          yPos += 4 // Reduced spacing after divider
        }
      })
    }

    // ==================== AUTHORIZATION SECTION ====================
    // Check if we need a new page
    if (yPos > pageHeight - 70) {
      doc.addPage()
      yPos = margin
    }

    // Section heading
    doc.setFontSize(9.5) // Reduced font size
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Authorization', margin, yPos)
    yPos += 4 // Reduced spacing after heading
    drawSectionDivider(yPos - 1) // Divider line
    yPos += 6 // Reduced spacing after divider

    // Engineer name section - improved spacing and alignment
    const authSectionX = margin
    const authLabelWidth = 50 // Label width for authorization section
    const authLabelValueSpacing = 3 // Spacing between label and value

    doc.setFontSize(8.5) // Reduced font size
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100) // Gray label
    doc.text('Engineer Name:', authSectionX, yPos)
    doc.setTextColor(0, 0, 0) // Black value
    doc.setFont('helvetica', 'normal')
    const engineerName = calibrationDetails.engineerName || ''
    const engineerNameX = authSectionX + authLabelWidth + authLabelValueSpacing
    doc.text(engineerName, engineerNameX, yPos)
    yPos += 8 // Reduced spacing after engineer name

    // Signature section - improved spacing and positioning
    const signatureImageY = yPos
    const signatureImageMaxWidth = 50 // Max width for signature image (50px)
    const signatureLineWidth = 80 // Width for signature line placeholder

    if (calibrationDetails.engineerSignature) {
      try {
        // Extract image format and base64 data from data URL
        const base64Data = calibrationDetails.engineerSignature
        let imageFormat = 'PNG' // Default format
        let imageData = base64Data

        // Check if it's a data URL (format: data:image/type;base64,data)
        if (base64Data.startsWith('data:image/')) {
          // Split by comma to separate metadata from base64 data
          const commaIndex = base64Data.indexOf(',')
          if (commaIndex > 0) {
            const metadataPart = base64Data.substring(0, commaIndex)
            imageData = base64Data.substring(commaIndex + 1)

            // Extract image type from metadata (e.g., "data:image/png;base64")
            const typeMatch = metadataPart.match(/image\/([^;]+)/i)
            if (typeMatch) {
              const mimeType = typeMatch[1].toLowerCase()
              // Map MIME type to jsPDF format
              if (mimeType === 'jpeg' || mimeType === 'jpg') {
                imageFormat = 'JPEG'
              } else if (mimeType === 'png') {
                imageFormat = 'PNG'
              } else if (mimeType === 'webp') {
                imageFormat = 'WEBP'
              }
            }
          }
        } else {
          // If it's already just base64 data, default to PNG
          imageData = base64Data
          imageFormat = 'PNG'
        }

        // Load image to get actual dimensions for proportional scaling
        const img = new Image()
        img.src = calibrationDetails.engineerSignature

        // Calculate dimensions
        let signatureImageWidth = signatureImageMaxWidth
        let signatureImageHeight = 15 // Default height (typical signature ratio)

        // Try to get image dimensions synchronously if possible
        if (img.complete && img.naturalWidth > 0) {
          const aspectRatio = img.naturalWidth / img.naturalHeight
          if (img.naturalWidth > signatureImageMaxWidth) {
            signatureImageWidth = signatureImageMaxWidth
            signatureImageHeight = signatureImageMaxWidth / aspectRatio
          } else {
            signatureImageWidth = img.naturalWidth
            signatureImageHeight = img.naturalHeight
          }
        } else {
          // Image not loaded yet, use typical signature aspect ratio (3.3:1)
          const defaultAspectRatio = 3.3
          signatureImageWidth = signatureImageMaxWidth
          signatureImageHeight = Math.round(signatureImageMaxWidth / defaultAspectRatio)
        }

        // Add signature image to PDF
        doc.addImage(
          imageData,
          imageFormat,
          authSectionX,
          signatureImageY,
          signatureImageWidth,
          signatureImageHeight,
          undefined,
          'FAST' // Compression mode
        )

        yPos += signatureImageHeight + 6 // Reduced space after image
      } catch (error) {
        // If image fails to load, fallback to signature line
        console.error('Error adding signature image to PDF:', error)
        doc.setDrawColor(150, 150, 150)
        doc.setLineWidth(0.5)
        doc.line(authSectionX, signatureImageY, authSectionX + signatureLineWidth, signatureImageY)
        doc.setFontSize(7.5) // Reduced font size
        doc.setTextColor(120, 120, 120)
        doc.text('Signature', authSectionX, signatureImageY + 5) // Adjusted vertical position
        yPos += 10 // Reduced spacing after signature line
      }
    } else {
      // No signature image, draw signature line as placeholder
      doc.setDrawColor(150, 150, 150)
      doc.setLineWidth(0.5)
      doc.line(authSectionX, signatureImageY, authSectionX + signatureLineWidth, signatureImageY)
      doc.setFontSize(7.5) // Reduced font size
      doc.setTextColor(120, 120, 120)
      doc.text('Signature', authSectionX, signatureImageY + 5) // Adjusted vertical position
      yPos += 10 // Reduced spacing after signature line
    }

    // Issue date section - improved spacing and alignment
    if (calibrationDetails.issueDate) {
      yPos += 6 // Reduced spacing before issue date
      doc.setFontSize(8.5) // Reduced font size
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100) // Gray label
      doc.text('Issue Date:', authSectionX, yPos)
      doc.setTextColor(0, 0, 0) // Black value
      doc.setFont('helvetica', 'normal')
      const issueDateX = authSectionX + authLabelWidth + authLabelValueSpacing
      doc.text(formatDate(calibrationDetails.issueDate), issueDateX, yPos)
    }

    // Remarks section (if exists)
    if (calibrationDetails.remarks) {
      yPos += 8 // Reduced spacing before remarks section
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = margin
      }
      doc.setFontSize(9.5) // Reduced font size
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Remarks', margin, yPos)
      yPos += 4 // Reduced spacing
      drawSectionDivider(yPos - 1) // Only bottom divider, no top border
      yPos += 4 // Reduced spacing after divider
      doc.setFontSize(8.5) // Reduced font size
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      const remarksLines = doc.splitTextToSize(calibrationDetails.remarks, contentWidth)
      remarksLines.forEach(line => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
        }
        doc.text(line, margin, yPos)
        yPos += 4.2 // Reduced line height
      })
    }

    // Open PDF in new window
    doc.output('dataurlnewwindow')
  }, [
    certificateNo,
    customer,
    device,
    procedureTemplate,
    linearityRecords,
    eccentricity,
    repeatability,
    uncertainty,
    referenceWeights,
    calibrationDetails
  ])

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
            fontFamily: 'Inter, "Open Sans", sans-serif',
            backgroundColor: PAGE_BACKGROUND
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
                  Create Calibration Certificate
                </Typography>
                <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                  Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
                </Typography>
              </Box>
              <Button variant='outlined' onClick={() => navigate('/certificates')} sx={{ ...secondaryButtonStyles }}>
                Cancel
              </Button>
            </Paper>

            <Paper sx={{ ...cardBaseStyles, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <LinearProgress
                  variant='determinate'
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 999,
                      backgroundColor: PRIMARY_COLOR
                    }
                  }}
                />
              </Box>

              <Box className='cc_stepper_container' sx={{ mb: 0 }}>
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
            </Paper>

            {/* Step content */}
            {activeStep === 0 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Certificate Number
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem' }}>
                    Auto-generated certificate number
                  </Typography>
                </Box>

                {/* Bootstrap-style rows/cols (no Grid) */}
                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Certificate Number
                    </Typography>
                    <TextField
                      // value={certificateNo}
                      onChange={e => setCertificateNo(e.target.value)}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Device Name
                    </Typography>
                    <Autocomplete
                      options={deviceNameOptions}
                      value={selectedDeviceName}
                      onChange={handleDeviceNameSelect}
                      inputValue={deviceNameInputValue}
                      onInputChange={(_, newInputValue) => setDeviceNameInputValue(newInputValue)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Search device...'
                          size='small'
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Serial Number
                    </Typography>
                    <Autocomplete
                      options={serialNumberOptions}
                      value={device.serialNo ? device.serialNo : null}
                      onChange={handleSerialNumberSelect}
                      inputValue={serialNumberInputValue}
                      onInputChange={(_, newInputValue) => setSerialNumberInputValue(newInputValue)}
                      disabled={!selectedDeviceName || serialNumberOptions.length === 0}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder={selectedDeviceName ? 'Select serial number' : 'Select device first'}
                          size='small'
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <Box
                  sx={{
                    mt: 4
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: '#111827',
                      mb: 2
                    }}
                  >
                    Calibration Date
                  </Typography>
                  <Box sx={{ height: 1, backgroundColor: 'divider', mb: 2 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { xs: 2, md: 4 },
                      mb: 2
                    }}
                  >
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          As Found Calibration Date
                        </Typography>
                        <TextField
                          type='date'
                          fullWidth
                          size='small'
                          value={calibrationDetails.asFoundCalibrationDate}
                          onChange={e => handleCalibrationFieldChange('asFoundCalibrationDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          placeholder='Enter value'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          As Left Calibration Date
                        </Typography>
                        <TextField
                          placeholder='Enter value'
                          fullWidth
                          size='small'
                          value={calibrationDetails.asLeftCalibrationDate}
                          onChange={e => handleCalibrationFieldChange('asLeftCalibrationDate', e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          Next Cal. Due Date
                        </Typography>
                        <TextField
                          type='date'
                          fullWidth
                          size='small'
                          value={calibrationDetails.nextCalibrationDueDate}
                          onChange={e => handleCalibrationFieldChange('nextCalibrationDueDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          placeholder='Enter value'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          Issue Date
                        </Typography>
                        <TextField
                          type='date'
                          fullWidth
                          size='small'
                          value={calibrationDetails.issueDate}
                          onChange={e => handleCalibrationFieldChange('issueDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          placeholder='Enter value'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { xs: 2, md: 4 },
                      alignItems: { md: 'flex-end' }
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                        Engineer Name
                      </Typography>
                      <TextField
                        placeholder='Enter engineer name'
                        fullWidth
                        size='small'
                        value={calibrationDetails.engineerName}
                        onChange={e => handleCalibrationFieldChange('engineerName', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                        Engineer Signature
                      </Typography>
                      <Box
                        sx={{
                          border: '1px dashed',
                          borderColor: calibrationDetails.engineerSignature ? 'success.light' : 'divider',
                          borderRadius: 2,
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: calibrationDetails.engineerSignature
                            ? 'rgba(16, 185, 129, 0.08)'
                            : 'transparent',
                          minHeight: 120,
                          textAlign: 'center'
                        }}
                      >
                        {calibrationDetails.engineerSignature ? (
                          <>
                            <Box
                              component='img'
                              src={calibrationDetails.engineerSignature}
                              alt='Engineer Signature'
                              sx={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain', mb: 1 }}
                            />
                            <Button
                              size='small'
                              variant='outlined'
                              color='error'
                              onClick={handleCalibrationSignatureRemove}
                              sx={{ textTransform: 'none' }}
                            >
                              Remove Signature
                            </Button>
                          </>
                        ) : (
                          <>
                            <Typography variant='body2' sx={{ mb: 1, color: 'text.secondary' }}>
                              Upload scanned signature image
                            </Typography>
                            <Button
                              size='small'
                              variant='outlined'
                              onClick={() => calibrationSignatureInputRef.current?.click()}
                              sx={{ textTransform: 'none' }}
                            >
                              Upload Signature
                            </Button>
                            <input
                              ref={calibrationSignatureInputRef}
                              type='file'
                              accept='image/*'
                              hidden
                              onChange={handleCalibrationSignatureUpload}
                            />
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 3
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: '#111827',
                      mb: 2
                    }}
                  >
                    Remarks
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    Add any additional notes or observations related to this certificate.
                  </Typography>
                  <TextField
                    placeholder='Enter remarks'
                    multiline
                    minRows={3}
                    fullWidth
                    value={calibrationDetails.remarks}
                    onChange={e => handleCalibrationFieldChange('remarks', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Box>
              </Box>
            ) : activeStep === 1 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Customer
                  </Typography>
                </Box>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Customer Name
                    </Typography>
                    <Autocomplete
                      options={customerOptions}
                      value={selectedCustomer}
                      onChange={(_, newValue) => {
                        setSelectedCustomer(newValue)
                        if (newValue) {
                          const derived = deriveCityStateFromLocation(newValue.location)
                          setCustomer({
                            company: newValue.company || '',
                            address: newValue.address || '',
                            city: newValue.city || derived.city,
                            state: newValue.state || derived.state,
                            zip: newValue.zip || newValue.pincode || '',
                            contact: newValue.contactPerson || '',
                            mobile: newValue.mobile || ''
                          })
                          setCustomerNameInputValue(newValue.customerName || newValue.name || '')
                        } else {
                          setCustomer(createInitialCustomerFields())
                          setCustomerNameInputValue('')
                        }
                      }}
                      inputValue={customerNameInputValue}
                      onInputChange={(_, newInputValue) => setCustomerNameInputValue(newInputValue)}
                      getOptionLabel={option => option?.customerName || option?.name || ''}
                      isOptionEqualToValue={(option, value) =>
                        (option?.id || option?.customerName) === (value?.id || value?.customerName)
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Search customer...'
                          size='small'
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Bootstrap-style rows/cols (no Grid) */}
                <div className='row'>
                  <div className='col-12'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Company
                    </Typography>
                    <TextField
                      value={customer.company}
                      onChange={e => setCustomer(p => ({ ...p, company: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Address
                    </Typography>
                    <TextField
                      value={customer.address}
                      onChange={e => setCustomer(p => ({ ...p, address: e.target.value }))}
                      fullWidth
                      size='small'
                      multiline
                      rows={2}
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      City
                    </Typography>
                    <TextField
                      value={customer.city}
                      onChange={e => setCustomer(p => ({ ...p, city: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      State/Province
                    </Typography>
                    <TextField
                      value={customer.state}
                      onChange={e => setCustomer(p => ({ ...p, state: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Zip/Postal
                    </Typography>
                    <TextField
                      value={customer.zip}
                      onChange={e => setCustomer(p => ({ ...p, zip: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Contact
                    </Typography>
                    <TextField
                      value={customer.contact}
                      onChange={e => setCustomer(p => ({ ...p, contact: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Mobile NO.
                    </Typography>
                    <TextField
                      value={customer.mobile}
                      onChange={e => setCustomer(p => ({ ...p, mobile: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>
              </Box>
            ) : activeStep === 2 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Device
                  </Typography>
                </Box>

                {/* Bootstrap-style rows/cols (no Grid) */}
                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Manufacturer
                    </Typography>
                    <TextField
                      value={device.manufacturer}
                      onChange={e => setDevice(p => ({ ...p, manufacturer: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Serial No
                    </Typography>
                    <TextField
                      value={device.serialNo}
                      onChange={e => {
                        const value = e.target.value
                        setDevice(p => ({ ...p, serialNo: value }))
                        setSerialNumberInputValue(value)
                      }}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Model
                    </Typography>
                    <TextField
                      value={device.model}
                      onChange={e => setDevice(p => ({ ...p, model: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Terminal Model
                    </Typography>
                    <TextField
                      value={device.terminalModel}
                      onChange={e => setDevice(p => ({ ...p, terminalModel: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Max Capacity
                    </Typography>
                    <TextField
                      value={device.maxCapacity}
                      onChange={e => setDevice(p => ({ ...p, maxCapacity: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Tag No
                    </Typography>
                    <TextField
                      value={device.tagNo}
                      onChange={e => setDevice(p => ({ ...p, tagNo: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Readability
                    </Typography>
                    <TextField
                      value={device.readability}
                      onChange={e => setDevice(p => ({ ...p, readability: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Verification Value
                    </Typography>
                    <TextField
                      value={device.verificationValue}
                      onChange={e => setDevice(p => ({ ...p, verificationValue: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' component='label' sx={{ mb: 0.7 }} className='cc_label'>
                      Location
                    </Typography>
                    <TextField
                      value={device.location}
                      onChange={e => setDevice(p => ({ ...p, location: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                </div>
              </Box>
            ) : activeStep === 3 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Procedure Template
                  </Typography>
                </Box>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Template Name
                    </Typography>
                    <Autocomplete
                      options={procedureTemplateOptions}
                      value={selectedTemplateName}
                      onChange={(_, newValue) => {
                        setSelectedTemplateName(newValue)
                        if (newValue) {
                          setProcedureTemplate(newValue.templateText || '')
                          setTemplateNameInputValue(newValue.templateName || '')
                        } else if (!newValue) {
                          setProcedureTemplate('')
                          setTemplateNameInputValue('')
                        }
                      }}
                      inputValue={templateNameInputValue}
                      onInputChange={(_, newInputValue) => setTemplateNameInputValue(newInputValue)}
                      getOptionLabel={option => option?.templateName || ''}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Search template...'
                          size='small'
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: 1.5
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Procedure Template
                    </Typography>
                    <TextField
                      value={procedureTemplate}
                      onChange={e => setProcedureTemplate(e.target.value)}
                      fullWidth
                      size='small'
                      multiline
                      rows={8}
                      placeholder='Enter procedure template details...'
                    />
                  </div>
                </div>
              </Box>
            ) : activeStep === 4 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Linearity
                  </Typography>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setLinearityRecords([
                        ...linearityRecords,
                        {
                          nominalValue: '',
                          reading: '',
                          error: '',
                          allowableError: '',
                          withinTolerances: ''
                        }
                      ])
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Add Row
                  </Button>
                </Box>

                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                >
                  <Table size='small'>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Nominal Value</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Reading</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Error</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Allowable Error</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Within Tolerances</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', width: '80px' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {linearityRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ padding: '8px' }}>
                            <TextField
                              value={record.nominalValue}
                              onChange={e => {
                                const updated = [...linearityRecords]
                                updated[index].nominalValue = e.target.value
                                setLinearityRecords(updated)
                              }}
                              size='small'
                              fullWidth
                              placeholder='Enter value'
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '8px' }}>
                            <TextField
                              value={record.reading}
                              onChange={e => {
                                const updated = [...linearityRecords]
                                updated[index].reading = e.target.value
                                setLinearityRecords(updated)
                              }}
                              size='small'
                              fullWidth
                              placeholder='Enter reading'
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '8px' }}>
                            <TextField
                              value={record.error}
                              onChange={e => {
                                const updated = [...linearityRecords]
                                updated[index].error = e.target.value
                                setLinearityRecords(updated)
                              }}
                              size='small'
                              fullWidth
                              placeholder='Enter error'
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '8px' }}>
                            <TextField
                              value={record.allowableError}
                              onChange={e => {
                                const updated = [...linearityRecords]
                                updated[index].allowableError = e.target.value
                                setLinearityRecords(updated)
                              }}
                              size='small'
                              fullWidth
                              placeholder='Enter allowable error'
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '8px' }}>
                            <TextField
                              value={record.withinTolerances}
                              onChange={e => {
                                const updated = [...linearityRecords]
                                updated[index].withinTolerances = e.target.value
                                setLinearityRecords(updated)
                              }}
                              size='small'
                              fullWidth
                              placeholder='Yes/No'
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '8px' }}>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => {
                                if (linearityRecords.length > 1) {
                                  setLinearityRecords(linearityRecords.filter((_, i) => i !== index))
                                }
                              }}
                              disabled={linearityRecords.length === 1}
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : activeStep === 5 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Eccentricity
                  </Typography>
                </Box>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Test Weight
                    </Typography>
                    <TextField
                      value={eccentricity.testWeight}
                      onChange={e => setEccentricity(p => ({ ...p, testWeight: e.target.value }))}
                      fullWidth
                      size='small'
                      placeholder='e.g., 50 kg'
                    />
                  </div>
                </div>

                <Box sx={{ mt: 3 }}>
                  <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Positions
                  </Typography>
                  {eccentricity.positions.map((pos, index) => (
                    <div key={index} className='row' style={{ marginBottom: '12px' }}>
                      <div className='col-12 col-md-2 col-lg-2 col-xl-1'>
                        <Typography variant='body2' sx={{ mb: 0.7, mt: 2 }} component='label' className='cc_label'>
                          <b>{pos.position}</b>
                        </Typography>
                      </div>
                      <div className='col-12 col-md-4'>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          Displayed Value
                        </Typography>
                        <TextField
                          value={pos.displayedValue}
                          onChange={e => {
                            const updated = [...eccentricity.positions]
                            updated[index].displayedValue = e.target.value
                            setEccentricity(p => ({ ...p, positions: updated }))
                          }}
                          fullWidth
                          size='small'
                          placeholder='Displayed Value'
                        />
                      </div>
                      <div className='col-12 col-md-4'>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          Deviation
                        </Typography>
                        <TextField
                          value={pos.deviation}
                          onChange={e => {
                            const updated = [...eccentricity.positions]
                            updated[index].deviation = e.target.value
                            setEccentricity(p => ({ ...p, positions: updated }))
                          }}
                          fullWidth
                          size='small'
                          placeholder='Deviation'
                        />
                      </div>
                    </div>
                  ))}
                </Box>

                <div className='row' style={{ marginTop: '20px' }}>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Maximum Deviation
                    </Typography>
                    <TextField
                      value={eccentricity.maximumDeviation}
                      onChange={e => setEccentricity(p => ({ ...p, maximumDeviation: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Allowable Deviation
                    </Typography>
                    <TextField
                      value={eccentricity.allowableDeviation}
                      onChange={e => setEccentricity(p => ({ ...p, allowableDeviation: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Within Tolerances
                    </Typography>
                    <TextField
                      value={eccentricity.withinTolerances}
                      onChange={e => setEccentricity(p => ({ ...p, withinTolerances: e.target.value }))}
                      fullWidth
                      size='small'
                      placeholder='YES/NO'
                    />
                  </div>
                </div>
              </Box>
            ) : activeStep === 6 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Repeatability
                  </Typography>
                </Box>

                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Test Weight
                    </Typography>
                    <TextField
                      value={repeatability.testWeight}
                      onChange={e => setRepeatability(p => ({ ...p, testWeight: e.target.value }))}
                      fullWidth
                      size='small'
                      placeholder='e.g., 75 kg'
                    />
                  </div>
                </div>

                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      Measurements
                    </Typography>
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setRepeatability(p => ({
                          ...p,
                          measurements: [...p.measurements, { withoutTestWeight: '', withTestWeight: '', asFound: '' }]
                        }))
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Add Row
                    </Button>
                  </Box>

                  <TableContainer
                    component={Paper}
                    sx={{ mt: 2, boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                  >
                    <Table size='small'>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Without Test Weight</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>With Test Weight</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>As Found</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', width: '80px' }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {repeatability.measurements.map((measurement, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ padding: '8px' }}>
                              <TextField
                                value={measurement.withoutTestWeight}
                                onChange={e => {
                                  const updated = [...repeatability.measurements]
                                  updated[index].withoutTestWeight = e.target.value
                                  setRepeatability(p => ({ ...p, measurements: updated }))
                                }}
                                size='small'
                                fullWidth
                                placeholder='Enter value'
                              />
                            </TableCell>
                            <TableCell sx={{ padding: '8px' }}>
                              <TextField
                                value={measurement.withTestWeight}
                                onChange={e => {
                                  const updated = [...repeatability.measurements]
                                  updated[index].withTestWeight = e.target.value
                                  setRepeatability(p => ({ ...p, measurements: updated }))
                                }}
                                size='small'
                                fullWidth
                                placeholder='Enter value'
                              />
                            </TableCell>
                            <TableCell sx={{ padding: '8px' }}>
                              <TextField
                                value={measurement.asFound}
                                onChange={e => {
                                  const updated = [...repeatability.measurements]
                                  updated[index].asFound = e.target.value
                                  setRepeatability(p => ({ ...p, measurements: updated }))
                                }}
                                size='small'
                                fullWidth
                                placeholder='Enter value'
                              />
                            </TableCell>
                            <TableCell sx={{ padding: '8px' }}>
                              <IconButton
                                size='small'
                                color='error'
                                onClick={() => {
                                  if (repeatability.measurements.length > 1) {
                                    setRepeatability(p => ({
                                      ...p,
                                      measurements: p.measurements.filter((_, i) => i !== index)
                                    }))
                                  }
                                }}
                                disabled={repeatability.measurements.length === 1}
                              >
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <div className='row' style={{ marginTop: '20px' }}>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Deviation
                    </Typography>
                    <TextField
                      value={repeatability.deviation}
                      onChange={e => setRepeatability(p => ({ ...p, deviation: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Allowable Error
                    </Typography>
                    <TextField
                      value={repeatability.allowableError}
                      onChange={e => setRepeatability(p => ({ ...p, allowableError: e.target.value }))}
                      fullWidth
                      size='small'
                    />
                  </div>
                  <div className='col-12 col-md-4'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Within Tolerances
                    </Typography>
                    <TextField
                      value={repeatability.withinTolerances}
                      onChange={e => setRepeatability(p => ({ ...p, withinTolerances: e.target.value }))}
                      fullWidth
                      size='small'
                      placeholder='YES/NO'
                    />
                  </div>
                </div>
              </Box>
            ) : activeStep === 7 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Uncertainty
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Capture uncertainty matrices for loads applied during calibration.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Loads Applied – Table 1
                  </Typography>
                  <div className='row'>
                    {uncertaintyTableOneColumns.map(column => (
                      <div key={column} className='col-12 col-sm-6 col-md-4 col-lg-3' style={{ marginBottom: '16px' }}>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          {column.toUpperCase()}
                        </Typography>
                        <TextField
                          size='small'
                          fullWidth
                          placeholder='Enter value'
                          value={uncertainty.tableOne[column]}
                          onChange={e => updateUncertaintyValue('tableOne', column, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </Box>

                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Loads Applied – Table 2
                  </Typography>
                  <div className='row'>
                    {uncertaintyTableTwoColumns.map(column => (
                      <div key={column} className='col-12 col-sm-6 col-md-4 col-lg-3' style={{ marginBottom: '16px' }}>
                        <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                          {column.toUpperCase()}
                        </Typography>
                        <TextField
                          size='small'
                          fullWidth
                          placeholder='Enter value'
                          value={uncertainty.tableTwo[column]}
                          onChange={e => updateUncertaintyValue('tableTwo', column, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </Box>
              </Box>
            ) : activeStep === 8 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 3 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Reference Weights
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Select and manage reference weights used for calibration.
                  </Typography>

                  {/* Traceability Note */}
                  <Box
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: '#F8FAFC',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: 2,
                      borderLeft: '4px solid #2563EB'
                    }}
                  >
                    <Typography variant='body2' sx={{ color: '#1F2937', fontStyle: 'italic', lineHeight: 1.6 }}>
                      All weights used for metrological testing are traceable to national or international standards.
                      The weights were calibrated and certified by an accredited calibration laboratory.
                    </Typography>
                  </Box>

                  {/* Multi-select dropdown for weight sets */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }} component='label' className='cc_label'>
                      Select Weight Sets
                    </Typography>
                    <Autocomplete
                      multiple
                      options={weightSets}
                      getOptionLabel={option => option.weightSetNo || ''}
                      value={weightSets.filter(ws => referenceWeights.some(rw => rw.id === ws.id))}
                      onChange={handleWeightSetSelect}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Select weight sets...'
                          size='small'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                              '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                              '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR }
                            }
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component='li' {...props} key={option.id}>
                          <Box>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                              {option.weightSetNo}
                            </Typography>
                            <Typography variant='caption' sx={{ color: SUBTEXT_COLOR }}>
                              Cert: {option.certificateNumber} | Class: {option.class}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Box
                            key={option.id}
                            {...getTagProps({ index })}
                            sx={{
                              backgroundColor: '#EFF6FF',
                              color: PRIMARY_COLOR,
                              borderRadius: '6px',
                              px: 1,
                              py: 0.5,
                              fontSize: '0.875rem',
                              fontWeight: 500
                            }}
                          >
                            {option.weightSetNo}
                          </Box>
                        ))
                      }
                    />
                  </Box>

                  {/* Display selected weight sets */}
                  {referenceWeights.length > 0 && (
                    <Box>
                      {referenceWeights.map((refWeight, index) => (
                        <Box key={refWeight.id}>
                          {/* Weight Set Section */}
                          <Box
                            sx={{
                              p: 2.5,
                              mb: 2,
                              border: '1px solid rgba(148, 163, 184, 0.25)',
                              borderRadius: 2,
                              backgroundColor: '#FFFFFF',
                              position: 'relative'
                            }}
                          >
                            {/* Section Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant='subtitle1' sx={{ fontWeight: 600, color: TITLE_COLOR }}>
                                Weight Set {index + 1}
                              </Typography>
                              <IconButton
                                size='small'
                                onClick={() => handleRemoveReferenceWeight(refWeight.id)}
                                sx={{
                                  color: '#EF4444',
                                  '&:hover': { backgroundColor: '#FEE2E2' }
                                }}
                              >
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Box>

                            {/* Divider */}
                            <Box
                              sx={{
                                height: '1px',
                                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                                mb: 2
                              }}
                            />

                            {/* Weight Set Fields */}
                            <div className='row'>
                              <div className='col-12 col-md-6' style={{ marginBottom: '16px' }}>
                                <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                                  Weight Set No.
                                </Typography>
                                <TextField
                                  fullWidth
                                  size='small'
                                  value={refWeight.weightSetNo}
                                  onChange={e =>
                                    handleReferenceWeightChange(refWeight.id, 'weightSetNo', e.target.value)
                                  }
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      backgroundColor: '#FFFFFF',
                                      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                                      '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                                      '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR }
                                    }
                                  }}
                                />
                              </div>

                              <div className='col-12 col-md-6' style={{ marginBottom: '16px' }}>
                                <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                                  Class
                                </Typography>
                                <TextField
                                  fullWidth
                                  size='small'
                                  value={refWeight.class}
                                  onChange={e => handleReferenceWeightChange(refWeight.id, 'class', e.target.value)}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      backgroundColor: '#FFFFFF',
                                      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                                      '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                                      '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR }
                                    }
                                  }}
                                />
                              </div>

                              <div className='col-12 col-md-6' style={{ marginBottom: '16px' }}>
                                <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                                  Calibration Due Date
                                </Typography>
                                <TextField
                                  fullWidth
                                  size='small'
                                  value={refWeight.calibrationDueDate}
                                  onChange={e =>
                                    handleReferenceWeightChange(refWeight.id, 'calibrationDueDate', e.target.value)
                                  }
                                  placeholder='DD.MM.YYYY'
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      backgroundColor: '#FFFFFF',
                                      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                                      '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                                      '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR }
                                    }
                                  }}
                                />
                              </div>

                              <div className='col-12 col-md-6' style={{ marginBottom: '16px' }}>
                                <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                                  Certificate Number
                                </Typography>
                                <TextField
                                  fullWidth
                                  size='small'
                                  value={refWeight.certificateNumber}
                                  onChange={e =>
                                    handleReferenceWeightChange(refWeight.id, 'certificateNumber', e.target.value)
                                  }
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      backgroundColor: '#FFFFFF',
                                      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                                      '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                                      '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR }
                                    }
                                  }}
                                />
                              </div>

                              <div className='col-12 col-md-6' style={{ marginBottom: '16px' }}>
                                <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                                  Date of Issue
                                </Typography>
                                <TextField
                                  fullWidth
                                  size='small'
                                  value={refWeight.dateOfIssue}
                                  onChange={e =>
                                    handleReferenceWeightChange(refWeight.id, 'dateOfIssue', e.target.value)
                                  }
                                  placeholder='DD.MM.YYYY'
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      backgroundColor: '#FFFFFF',
                                      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                                      '&:hover fieldset': { borderColor: PRIMARY_COLOR },
                                      '&.Mui-focused fieldset': { borderColor: PRIMARY_COLOR }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </Box>

                          {/* Divider between weight sets (except for last one) */}
                          {index < referenceWeights.length - 1 && (
                            <Box
                              sx={{
                                height: '1px',
                                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                                my: 2
                              }}
                            />
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {referenceWeights.length === 0 && (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: '#F8FAFC',
                        borderRadius: 2,
                        border: '1px dashed rgba(148, 163, 184, 0.3)'
                      }}
                    >
                      <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                        No weight sets selected. Use the dropdown above to select weight sets.
                      </Typography>
                    </Box>
                  )}
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant='contained'
                    sx={{
                      ...primaryButtonStyles,
                      minWidth: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    endIcon={<ArrowForwardIcon fontSize='small' />}
                    onClick={() => setActiveStep(s => Math.min(steps.length - 1, s + 1))}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant='outlined'
                    color='primary'
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      minWidth: '100px',
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }
                    }}
                    startIcon={<PictureAsPdfIcon fontSize='small' />}
                    onClick={generatePDF}
                  >
                    PDF
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CreateCertificate
