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

const ECCENTRICITY_POSITION_MAP = [
  { key: 'center', label: 'Center' },
  { key: 'leftFront', label: 'Left Front' },
  { key: 'leftRear', label: 'Left Rear' },
  { key: 'rightRear', label: 'Right Rear' },
  { key: 'rightFront', label: 'Right Front' }
] as const

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
  const [customerOptions, setCustomerOptions] = useState(defaultCustomerOptions)
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
          setCustomerOptions(parsed)
        } else {
          setCustomerOptions(defaultCustomerOptions)
        }
      } else {
        setCustomerOptions(defaultCustomerOptions)
      }
    } catch (error) {
      console.error('Failed to load customers:', error)
      setCustomerOptions(defaultCustomerOptions)
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

  // Customer (Step 1) fields
  const [customer, setCustomer] = useState({
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    contact: '',
    mobile: ''
  })

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

  const resetDeviceDependentState = () => {
    setDevice(createInitialDeviceFields())
    setLinearityRecords(createInitialLinearityRecords())
    setEccentricity(createInitialEccentricity())
    setRepeatability(createInitialRepeatability())
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

  // PDF Generation function
  const generatePDF = useCallback(() => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    // Helper function to draw underlined text
    const drawUnderlinedText = (x, y, text, fontSize = 10) => {
      doc.setFontSize(fontSize)
      const textWidth = doc.getTextWidth(text)
      doc.text(text, x, y)
      doc.setLineWidth(0.1)
      doc.line(x, y + 1, x + textWidth, y + 1)
    }

    // Helper function to split address into multiple lines
    const splitAddress = (address, maxWidth) => {
      const words = address.split(' ')
      const lines = []
      let currentLine = ''

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        if (doc.getTextWidth(testLine) <= maxWidth) {
          currentLine = testLine
        } else {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        }
      })
      if (currentLine) lines.push(currentLine)
      return lines
    }

    // Header Section
    // Certificate Number (top-left)
    doc.setFontSize(10)
    doc.text('Certificate No.:', margin, yPos)
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(certificateNo || '', margin + 40, yPos)
    doc.setFont(undefined, 'normal')

    // RJ Technologies (top-right)
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    const companyName = 'RJ Technologies'
    const companyNameWidth = doc.getTextWidth(companyName)
    doc.text(companyName, pageWidth - margin - companyNameWidth, yPos)
    doc.setFont(undefined, 'normal')

    // Address below certificate number
    yPos += 7
    doc.setFontSize(9)
    const addressLines = splitAddress(
      '301, Shahjanand Plaza, Bhattha, Paldi, Ahmedabad - 380007.',
      pageWidth - margin * 2 - 50
    )
    addressLines.forEach((line, index) => {
      doc.text(line, margin, yPos + index * 4)
    })
    yPos += addressLines.length * 4 + 5

    // Title: Calibration Certificate (centered)
    yPos += 10
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    const title = 'Calibration Certificate'
    const titleWidth = doc.getTextWidth(title)
    doc.text(title, (pageWidth - titleWidth) / 2, yPos)
    doc.setFont(undefined, 'normal')

    // Customer Section
    yPos += 20
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Customer :', margin, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 8

    // Customer details in two columns
    const leftColX = margin
    const rightColX = pageWidth / 2 + 10
    const lineHeight = 7
    let customerY = yPos

    // Left column
    doc.setFontSize(10)
    doc.text('Company:', leftColX, customerY)
    drawUnderlinedText(leftColX + 30, customerY, customer.company || '', 10)

    customerY += lineHeight
    doc.text('Address:', leftColX, customerY)
    const addressText = customer.address || ''
    if (addressText) {
      // Handle multi-line addresses (split by newline or wrap if too long)
      const addressParts = addressText.split('\n').filter(part => part.trim())
      if (addressParts.length > 0) {
        addressParts.forEach((part, idx) => {
          drawUnderlinedText(leftColX + 30, customerY + idx * lineHeight, part, 10)
        })
        customerY += addressParts.length * lineHeight
      } else {
        drawUnderlinedText(leftColX + 30, customerY, '', 10)
        customerY += lineHeight
      }
    } else {
      drawUnderlinedText(leftColX + 30, customerY, '', 10)
      customerY += lineHeight
    }

    customerY += lineHeight
    doc.text('City:', leftColX, customerY)
    drawUnderlinedText(leftColX + 30, customerY, customer.city || '', 10)

    customerY += lineHeight
    doc.text('Zip/Postal:', leftColX, customerY)
    drawUnderlinedText(leftColX + 30, customerY, customer.zip || '', 10)

    customerY += lineHeight
    doc.text('Contact:', leftColX, customerY)
    drawUnderlinedText(leftColX + 30, customerY, customer.contact || '', 10)

    // Right column
    let rightColY = yPos
    doc.text('State/Province:', rightColX, rightColY)
    drawUnderlinedText(rightColX + 40, rightColY, customer.state || '', 10)

    rightColY += lineHeight * 2 // Align with Mobile NO. position
    doc.text('Mobile NO.:', rightColX, rightColY)
    drawUnderlinedText(rightColX + 40, rightColY, customer.mobile || '', 10)

    // Device Section
    yPos = Math.max(customerY, rightColY) + 15
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Device :', margin, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 8

    // Device details in two columns
    let deviceY = yPos
    const deviceLineHeight = 7

    // Left column
    doc.setFontSize(10)
    doc.text('Manufacturer:', leftColX, deviceY)
    drawUnderlinedText(leftColX + 35, deviceY, device.manufacturer || '', 10)

    deviceY += deviceLineHeight
    doc.text('Model:', leftColX, deviceY)
    drawUnderlinedText(leftColX + 35, deviceY, device.model || '', 10)

    deviceY += deviceLineHeight
    doc.text('Max Capacity:', leftColX, deviceY)
    drawUnderlinedText(leftColX + 35, deviceY, device.maxCapacity || '', 10)

    deviceY += deviceLineHeight
    doc.text('Readability:', leftColX, deviceY)
    drawUnderlinedText(leftColX + 35, deviceY, device.readability || '', 10)

    deviceY += deviceLineHeight
    doc.text('Location:', leftColX, deviceY)
    drawUnderlinedText(leftColX + 35, deviceY, device.location || '', 10)

    // Right column
    let deviceRightY = yPos
    doc.text('Serial No.:', rightColX, deviceRightY)
    drawUnderlinedText(rightColX + 40, deviceRightY, device.serialNo || '', 10)

    deviceRightY += deviceLineHeight
    doc.text('Terminal Model:', rightColX, deviceRightY)
    drawUnderlinedText(rightColX + 40, deviceRightY, device.terminalModel || '', 10)

    deviceRightY += deviceLineHeight
    doc.text('Tag No.:', rightColX, deviceRightY)
    drawUnderlinedText(rightColX + 40, deviceRightY, device.tagNo || '', 10)

    deviceRightY += deviceLineHeight
    doc.text('Verification Value:', rightColX, deviceRightY)
    drawUnderlinedText(rightColX + 40, deviceRightY, device.verificationValue || '', 10)

    // Procedure Template Section
    yPos = Math.max(deviceY, deviceRightY) + 15

    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = margin
    }

    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Procedure Template :', margin, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 8

    // Helper function to wrap text for procedure template
    const wrapText = (text, maxWidth, fontSize = 10) => {
      if (!text) return ['']
      doc.setFontSize(fontSize)
      const words = text.split(' ')
      const lines = []
      let currentLine = ''

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        if (doc.getTextWidth(testLine) <= maxWidth) {
          currentLine = testLine
        } else {
          if (currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            // Word itself is too long, add it anyway
            lines.push(word)
            currentLine = ''
          }
        }
      })
      if (currentLine) lines.push(currentLine)
      return lines.length > 0 ? lines : ['']
    }

    // Display Procedure Template with word wrapping
    const procedureText = procedureTemplate || ''
    const maxWidth = pageWidth - margin * 2
    const procedureLines = wrapText(procedureText, maxWidth, 10)
    const templateLineHeight = 6

    procedureLines.forEach(line => {
      // Check if we need a new page
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = margin
      }
      doc.setFontSize(10)
      doc.text(line, margin, yPos)
      yPos += templateLineHeight
    })

    // Linearity Section
    yPos += 10
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = margin
    }

    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Linearity :', margin, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 10

    // Filter out empty records
    const validRecords = linearityRecords.filter(
      record =>
        record.nominalValue || record.reading || record.error || record.allowableError || record.withinTolerances
    )

    if (validRecords.length > 0) {
      // Table setup
      const colWidths = [
        (pageWidth - margin * 2) * 0.2, // Nominal Value
        (pageWidth - margin * 2) * 0.2, // Reading
        (pageWidth - margin * 2) * 0.2, // Error
        (pageWidth - margin * 2) * 0.2, // Allowable Error
        (pageWidth - margin * 2) * 0.2 // Within Tolerances
      ]
      const rowHeight = 8
      const cellPadding = 4 // Padding inside cells
      const borderWidth = 0.3 // Thin border (normal weight)
      const borderColor = [150, 150, 150] // Gray color for borders

      // Set consistent border style for all borders
      doc.setLineWidth(borderWidth)
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])

      // Draw table header
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      const headerY = yPos - 5

      // Draw header borders - complete rectangle with all sides
      doc.rect(margin, headerY, pageWidth - margin * 2, rowHeight, 'S')

      // Header text with padding
      let headerX = margin
      doc.text('Nominal Value', headerX + cellPadding, yPos)
      headerX += colWidths[0]
      doc.text('Reading', headerX + cellPadding, yPos)
      headerX += colWidths[1]
      doc.text('Error', headerX + cellPadding, yPos)
      headerX += colWidths[2]
      doc.text('Allowable Error', headerX + cellPadding, yPos)
      headerX += colWidths[3]
      doc.text('Within Tolerances', headerX + cellPadding, yPos)

      // Draw vertical lines for header
      let lineX = margin
      for (let i = 0; i < colWidths.length; i++) {
        lineX += colWidths[i]
        if (i < colWidths.length - 1) {
          doc.line(lineX, headerY, lineX, headerY + rowHeight)
        }
      }

      yPos += rowHeight

      // Draw table rows
      validRecords.forEach(record => {
        // Check if we need a new page
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
          // Redraw header on new page
          doc.setFontSize(9)
          doc.setFont(undefined, 'normal')
          const newHeaderY = yPos - 5

          // Draw header borders - complete rectangle with all sides
          doc.rect(margin, newHeaderY, pageWidth - margin * 2, rowHeight, 'S')

          // Header text with padding
          let headerX = margin
          doc.text('Nominal Value', headerX + cellPadding, yPos)
          headerX += colWidths[0]
          doc.text('Reading', headerX + cellPadding, yPos)
          headerX += colWidths[1]
          doc.text('Error', headerX + cellPadding, yPos)
          headerX += colWidths[2]
          doc.text('Allowable Error', headerX + cellPadding, yPos)
          headerX += colWidths[3]
          doc.text('Within Tolerances', headerX + cellPadding, yPos)

          // Draw vertical lines for header
          let lineX = margin
          for (let i = 0; i < colWidths.length; i++) {
            lineX += colWidths[i]
            if (i < colWidths.length - 1) {
              doc.line(lineX, newHeaderY, lineX, newHeaderY + rowHeight)
            }
          }

          yPos += rowHeight
        }

        doc.setFontSize(9)
        const rowY = yPos - 3
        let cellX = margin

        // Draw cell content with padding
        doc.text(record.nominalValue || '', cellX + cellPadding, yPos)
        cellX += colWidths[0]

        doc.text(record.reading || '', cellX + cellPadding, yPos)
        cellX += colWidths[1]

        doc.text(record.error || '', cellX + cellPadding, yPos)
        cellX += colWidths[2]

        doc.text(record.allowableError || '', cellX + cellPadding, yPos)
        cellX += colWidths[3]

        doc.text(record.withinTolerances || '', cellX + cellPadding, yPos)

        // Draw complete row borders - all sides with consistent border
        // Left border
        doc.line(margin, rowY, margin, rowY + rowHeight)
        // Right border
        doc.line(pageWidth - margin, rowY, pageWidth - margin, rowY + rowHeight)
        // Bottom border
        doc.line(margin, rowY + rowHeight, pageWidth - margin, rowY + rowHeight)

        // Draw vertical lines
        let lineX = margin
        for (let i = 0; i < colWidths.length; i++) {
          lineX += colWidths[i]
          if (i < colWidths.length - 1) {
            doc.line(lineX, rowY, lineX, rowY + rowHeight)
          }
        }

        yPos += rowHeight
      })

      // Add spacing after the table
      yPos += 10
    }

    // Eccentricity Section
    yPos += 15
    // Check if we need a new page
    if (yPos > pageHeight - 100) {
      doc.addPage()
      yPos = margin
    }

    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Eccentricity :', margin, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 10

    // Eccentricity Table Setup
    const eccTableWidth = pageWidth - margin * 2
    const eccCol1Width = eccTableWidth * 0.25 // Position column
    const eccCol2Width = eccTableWidth * 0.375 // Displayed Value column
    const eccCol3Width = eccTableWidth * 0.375 // Deviation column
    const eccRowHeight = 8
    const eccHeaderRowHeight = 8
    const cellPadding = 4 // Padding inside cells
    const borderWidth = 0.3 // Thin border (normal weight)
    const borderColor = [150, 150, 150] // Gray color for borders

    // Set consistent border style for all borders
    doc.setLineWidth(borderWidth)
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])

    // Header Row 1: "Test Weight" | "50 kg" (merged 2 cols)
    const header1Y = yPos
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')

    // Draw borders for header row 1 - complete rectangle with all sides
    doc.rect(margin, header1Y - 5, eccTableWidth, eccHeaderRowHeight, 'S')

    // "Test Weight" (left-aligned in first column with padding)
    doc.text('Test Weight', margin + cellPadding, header1Y)

    // "50 kg" (centered in merged cell spanning col2 and col3)
    const testWeightX = margin + eccCol1Width
    const testWeightWidth = eccCol2Width + eccCol3Width
    const testWeightText = eccentricity.testWeight || '50 kg'
    const testWeightTextWidth = doc.getTextWidth(testWeightText)
    doc.text(testWeightText, testWeightX + testWeightWidth / 2 - testWeightTextWidth / 2, header1Y)

    // Vertical line after "Test Weight"
    doc.line(margin + eccCol1Width, header1Y - 5, margin + eccCol1Width, header1Y - 5 + eccHeaderRowHeight)

    yPos += eccHeaderRowHeight

    // Header Row 2: "Position" | "As Found" (merged 2 cols)
    const header2Y = yPos
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')

    // Draw borders for header row 2 - complete rectangle with all sides
    doc.rect(margin, header2Y - 5, eccTableWidth, eccHeaderRowHeight, 'S')

    // "Position" (left-aligned with padding)
    doc.text('Position', margin + cellPadding, header2Y)

    // "As Found" (centered in merged cell spanning col2 and col3)
    const asFoundX = margin + eccCol1Width
    const asFoundWidth = eccCol2Width + eccCol3Width
    const asFoundText = 'As Found'
    const asFoundTextWidth = doc.getTextWidth(asFoundText)
    doc.text(asFoundText, asFoundX + asFoundWidth / 2 - asFoundTextWidth / 2, header2Y)

    // Vertical line after "Position"
    doc.line(margin + eccCol1Width, header2Y - 5, margin + eccCol1Width, header2Y - 5 + eccHeaderRowHeight)

    yPos += eccHeaderRowHeight

    // Header Row 3: (empty) | "Displayed Value" | "Deviation"
    const header3Y = yPos
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')

    // Draw borders for header row 3 - complete rectangle with all sides
    doc.rect(margin, header3Y - 5, eccTableWidth, eccHeaderRowHeight, 'S')

    // "Displayed Value" (centered in col2)
    const displayedValueText = 'Displayed Value'
    const displayedValueTextWidth = doc.getTextWidth(displayedValueText)
    doc.text(displayedValueText, margin + eccCol1Width + eccCol2Width / 2 - displayedValueTextWidth / 2, header3Y)

    // "Deviation" (centered in col3)
    const deviationText = 'Deviation'
    const deviationTextWidth = doc.getTextWidth(deviationText)
    doc.text(deviationText, margin + eccCol1Width + eccCol2Width + eccCol3Width / 2 - deviationTextWidth / 2, header3Y)

    // Vertical lines
    doc.line(margin + eccCol1Width, header3Y - 5, margin + eccCol1Width, header3Y - 5 + eccHeaderRowHeight)
    doc.line(
      margin + eccCol1Width + eccCol2Width,
      header3Y - 5,
      margin + eccCol1Width + eccCol2Width,
      header3Y - 5 + eccHeaderRowHeight
    )

    yPos += eccHeaderRowHeight

    // Data Rows
    eccentricity.positions.forEach(pos => {
      // Check if we need a new page
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = margin
      }

      const rowY = yPos - 3
      doc.setFontSize(9)

      // Position (left-aligned with padding)
      doc.text(pos.position || '', margin + cellPadding, yPos)

      // Displayed Value (centered)
      const dispValueText = pos.displayedValue || ''
      const dispValueTextWidth = doc.getTextWidth(dispValueText)
      doc.text(dispValueText, margin + eccCol1Width + eccCol2Width / 2 - dispValueTextWidth / 2, yPos)

      // Deviation (centered)
      const devText = pos.deviation || ''
      const devTextWidth = doc.getTextWidth(devText)
      doc.text(devText, margin + eccCol1Width + eccCol2Width + eccCol3Width / 2 - devTextWidth / 2, yPos)

      // Draw complete row borders - all sides with consistent 1px border
      // Left border
      doc.line(margin, rowY, margin, rowY + eccRowHeight)
      // Right border
      doc.line(pageWidth - margin, rowY, pageWidth - margin, rowY + eccRowHeight)
      // Bottom border
      doc.line(margin, rowY + eccRowHeight, pageWidth - margin, rowY + eccRowHeight)
      // Vertical dividers
      doc.line(margin + eccCol1Width, rowY, margin + eccCol1Width, rowY + eccRowHeight)
      doc.line(margin + eccCol1Width + eccCol2Width, rowY, margin + eccCol1Width + eccCol2Width, rowY + eccRowHeight)

      yPos += eccRowHeight
    })

    // Summary Rows
    // Maximum Deviation (label in first column, value centered in merged last two columns)
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = margin
    }
    const maxDevY = yPos - 3
    doc.setFontSize(9)
    doc.text('Maximum Deviation:', margin + cellPadding, yPos)
    const maxDevValue = eccentricity.maximumDeviation || ''
    const maxDevValueWidth = doc.getTextWidth(maxDevValue)
    // Center the value in merged columns 2 and 3
    const mergedColWidth = eccCol2Width + eccCol3Width
    const mergedColStartX = margin + eccCol1Width
    doc.text(maxDevValue, mergedColStartX + mergedColWidth / 2 - maxDevValueWidth / 2, yPos)
    // Draw complete row borders - all sides (no vertical divider between columns 2 and 3)
    doc.line(margin, maxDevY, margin, maxDevY + eccRowHeight) // Left border
    doc.line(pageWidth - margin, maxDevY, pageWidth - margin, maxDevY + eccRowHeight) // Right border
    doc.line(margin, maxDevY + eccRowHeight, pageWidth - margin, maxDevY + eccRowHeight) // Bottom border
    doc.line(margin + eccCol1Width, maxDevY, margin + eccCol1Width, maxDevY + eccRowHeight) // Vertical divider (only between col1 and merged cols)
    yPos += eccRowHeight

    // Allowable Deviation (label in first column, value centered in merged last two columns)
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = margin
    }
    const allowDevY = yPos - 3
    doc.text('Allowable Deviation:', margin + cellPadding, yPos)
    const allowDevValue = eccentricity.allowableDeviation || ''
    const allowDevValueWidth = doc.getTextWidth(allowDevValue)
    // Center the value in merged columns 2 and 3
    const allowMergedColWidth = eccCol2Width + eccCol3Width
    const allowMergedColStartX = margin + eccCol1Width
    doc.text(allowDevValue, allowMergedColStartX + allowMergedColWidth / 2 - allowDevValueWidth / 2, yPos)
    // Draw complete row borders - all sides (no vertical divider between columns 2 and 3)
    doc.line(margin, allowDevY, margin, allowDevY + eccRowHeight) // Left border
    doc.line(pageWidth - margin, allowDevY, pageWidth - margin, allowDevY + eccRowHeight) // Right border
    doc.line(margin, allowDevY + eccRowHeight, pageWidth - margin, allowDevY + eccRowHeight) // Bottom border
    doc.line(margin + eccCol1Width, allowDevY, margin + eccCol1Width, allowDevY + eccRowHeight) // Vertical divider (only between col1 and merged cols)
    yPos += eccRowHeight

    // Within Tolerances (label in first column, value centered in merged last two columns)
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = margin
    }
    const withinTolY = yPos - 3
    doc.text('Within Tolerances:', margin + cellPadding, yPos)
    const withinTolValue = eccentricity.withinTolerances || ''
    const withinTolValueWidth = doc.getTextWidth(withinTolValue)
    // Center the value in merged columns 2 and 3
    const withinMergedColWidth = eccCol2Width + eccCol3Width
    const withinMergedColStartX = margin + eccCol1Width
    doc.text(withinTolValue, withinMergedColStartX + withinMergedColWidth / 2 - withinTolValueWidth / 2, yPos)
    // Draw final row borders - all sides (no vertical divider between columns 2 and 3)
    doc.line(margin, withinTolY, margin, withinTolY + eccRowHeight) // Left border
    doc.line(pageWidth - margin, withinTolY, pageWidth - margin, withinTolY + eccRowHeight) // Right border
    doc.line(margin, withinTolY + eccRowHeight, pageWidth - margin, withinTolY + eccRowHeight) // Bottom border
    doc.line(margin + eccCol1Width, withinTolY, margin + eccCol1Width, withinTolY + eccRowHeight) // Vertical divider (only between col1 and merged cols)

    // Add spacing after the table
    yPos += eccRowHeight + 10

    // Repeatability Section
    yPos += 15
    // Check if we need a new page
    if (yPos > pageHeight - 100) {
      doc.addPage()
      yPos = margin
    }

    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Repeatability :', margin, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 10

    // Filter out empty records
    const validMeasurements = repeatability.measurements.filter(
      m => m.withoutTestWeight || m.withTestWeight || m.asFound
    )

    if (validMeasurements.length > 0) {
      // Repeatability Table Setup
      const repTableWidth = pageWidth - margin * 2
      const repCol1Width = repTableWidth * 0.33 // Without Test Weight column
      const repCol2Width = repTableWidth * 0.33 // With Test Weight column
      const repCol3Width = repTableWidth * 0.34 // As Found column
      const repRowHeight = 8
      const repHeaderRowHeight = 8
      const borderWidth = 0.3 // Thin border (normal weight)
      const borderColor = [150, 150, 150] // Gray color for borders

      // Set consistent border style for all borders
      doc.setLineWidth(borderWidth)
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])

      // Header Row 1: "Test Weight" | "75 kg" (merged cols 2-3)
      const repHeader1Y = yPos
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')

      // Draw borders for header row 1 - complete rectangle with all sides
      doc.rect(margin, repHeader1Y - 5, repTableWidth, repHeaderRowHeight, 'S')

      // "Test Weight" (centered in first column)
      const testWeightLabelText = 'Test Weight'
      const testWeightLabelWidth = doc.getTextWidth(testWeightLabelText)
      doc.text(testWeightLabelText, margin + repCol1Width / 2 - testWeightLabelWidth / 2, repHeader1Y)

      // Test weight value (centered in merged cell spanning cols 2-3)
      const repTestWeightX = margin + repCol1Width
      const repTestWeightWidth = repCol2Width + repCol3Width
      const repTestWeightText = repeatability.testWeight || '75 kg'
      const repTestWeightTextWidth = doc.getTextWidth(repTestWeightText)
      doc.text(repTestWeightText, repTestWeightX + repTestWeightWidth / 2 - repTestWeightTextWidth / 2, repHeader1Y)

      // Vertical line after "Test Weight"
      doc.line(margin + repCol1Width, repHeader1Y - 5, margin + repCol1Width, repHeader1Y - 5 + repHeaderRowHeight)

      yPos += repHeaderRowHeight

      // Header Row 2: "Without Test Weight" | "With Test Weight" | "As Found"
      const repHeader2Y = yPos
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')

      // Draw borders for header row 2 - complete rectangle with all sides
      doc.rect(margin, repHeader2Y - 5, repTableWidth, repHeaderRowHeight, 'S')

      // Header text (centered in each column)
      const withoutText = 'Without Test Weight'
      const withoutTextWidth = doc.getTextWidth(withoutText)
      doc.text(withoutText, margin + repCol1Width / 2 - withoutTextWidth / 2, repHeader2Y)

      const withText = 'With Test Weight'
      const withTextWidth = doc.getTextWidth(withText)
      doc.text(withText, margin + repCol1Width + repCol2Width / 2 - withTextWidth / 2, repHeader2Y)

      const repAsFoundText = 'As Found'
      const repAsFoundTextWidth = doc.getTextWidth(repAsFoundText)
      doc.text(
        repAsFoundText,
        margin + repCol1Width + repCol2Width + repCol3Width / 2 - repAsFoundTextWidth / 2,
        repHeader2Y
      )

      // Vertical lines
      doc.line(margin + repCol1Width, repHeader2Y - 5, margin + repCol1Width, repHeader2Y - 5 + repHeaderRowHeight)
      doc.line(
        margin + repCol1Width + repCol2Width,
        repHeader2Y - 5,
        margin + repCol1Width + repCol2Width,
        repHeader2Y - 5 + repHeaderRowHeight
      )

      yPos += repHeaderRowHeight

      // Data Rows: Each measurement is a row
      validMeasurements.forEach(measurement => {
        // Check if we need a new page
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
        }

        const rowY = yPos - 3
        doc.setFontSize(9)

        // Without Test Weight (centered)
        const withoutValue = measurement.withoutTestWeight || ''
        const withoutValueWidth = doc.getTextWidth(withoutValue)
        doc.text(withoutValue, margin + repCol1Width / 2 - withoutValueWidth / 2, yPos)

        // With Test Weight (centered)
        const withValue = measurement.withTestWeight || ''
        const withValueWidth = doc.getTextWidth(withValue)
        doc.text(withValue, margin + repCol1Width + repCol2Width / 2 - withValueWidth / 2, yPos)

        // As Found (centered)
        const asFoundValue = measurement.asFound || ''
        const asFoundValueWidth = doc.getTextWidth(asFoundValue)
        doc.text(asFoundValue, margin + repCol1Width + repCol2Width + repCol3Width / 2 - asFoundValueWidth / 2, yPos)

        // Draw complete row borders - all sides with consistent border
        // Left border
        doc.line(margin, rowY, margin, rowY + repRowHeight)
        // Right border
        doc.line(pageWidth - margin, rowY, pageWidth - margin, rowY + repRowHeight)
        // Bottom border
        doc.line(margin, rowY + repRowHeight, pageWidth - margin, rowY + repRowHeight)
        // Vertical dividers
        doc.line(margin + repCol1Width, rowY, margin + repCol1Width, rowY + repRowHeight)
        doc.line(margin + repCol1Width + repCol2Width, rowY, margin + repCol1Width + repCol2Width, rowY + repRowHeight)

        yPos += repRowHeight
      })
    }

    // Summary Rows (only if we have measurements)
    if (validMeasurements.length > 0) {
      // Reuse variables from data rows section
      const repTableWidth = pageWidth - margin * 2
      const repCol1Width = repTableWidth * 0.33
      const repCol2Width = repTableWidth * 0.33
      const repCol3Width = repTableWidth * 0.34
      const repRowHeight = 8
      const repMergedColWidth = repCol2Width + repCol3Width
      const repMergedColStartX = margin + repCol1Width
      const cellPadding = 4 // Padding inside cells
      const borderWidth = 0.3 // Thin border (normal weight)
      const borderColor = [150, 150, 150] // Gray color for borders

      // Set consistent border style for summary rows
      doc.setLineWidth(borderWidth)
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])

      // Deviation (label in first column, value centered in merged last two columns)
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = margin
      }
      const repDevY = yPos - 3
      doc.setFontSize(9)
      doc.text('Deviation:', margin + cellPadding, yPos)
      const repDevValue = repeatability.deviation || ''
      const repDevValueWidth = doc.getTextWidth(repDevValue)
      // Center the value in merged columns 2 and 3
      doc.text(repDevValue, repMergedColStartX + repMergedColWidth / 2 - repDevValueWidth / 2, yPos)
      // Draw complete row borders - all sides (no vertical divider between columns 2 and 3)
      doc.line(margin, repDevY, margin, repDevY + repRowHeight) // Left border
      doc.line(pageWidth - margin, repDevY, pageWidth - margin, repDevY + repRowHeight) // Right border
      doc.line(margin, repDevY + repRowHeight, pageWidth - margin, repDevY + repRowHeight) // Bottom border
      doc.line(margin + repCol1Width, repDevY, margin + repCol1Width, repDevY + repRowHeight) // Vertical divider (only between col1 and merged cols)
      yPos += repRowHeight

      // Allowable Error (label in first column, value centered in merged last two columns)
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = margin
      }
      const repAllowY = yPos - 3
      doc.text('Allowable Error:', margin + cellPadding, yPos)
      const repAllowValue = repeatability.allowableError || ''
      const repAllowValueWidth = doc.getTextWidth(repAllowValue)
      // Center the value in merged columns 2 and 3
      doc.text(repAllowValue, repMergedColStartX + repMergedColWidth / 2 - repAllowValueWidth / 2, yPos)
      // Draw complete row borders - all sides (no vertical divider between columns 2 and 3)
      doc.line(margin, repAllowY, margin, repAllowY + repRowHeight) // Left border
      doc.line(pageWidth - margin, repAllowY, pageWidth - margin, repAllowY + repRowHeight) // Right border
      doc.line(margin, repAllowY + repRowHeight, pageWidth - margin, repAllowY + repRowHeight) // Bottom border
      doc.line(margin + repCol1Width, repAllowY, margin + repCol1Width, repAllowY + repRowHeight) // Vertical divider (only between col1 and merged cols)
      yPos += repRowHeight

      // Within Tolerances (label in first column, value centered in merged last two columns)
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = margin
      }
      const repWithinY = yPos - 3
      doc.text('Within Tolerances:', margin + cellPadding, yPos)
      const repWithinValue = repeatability.withinTolerances || ''
      const repWithinValueWidth = doc.getTextWidth(repWithinValue)
      // Center the value in merged columns 2 and 3
      doc.text(repWithinValue, repMergedColStartX + repMergedColWidth / 2 - repWithinValueWidth / 2, yPos)
      // Draw final row borders - all sides (no vertical divider between columns 2 and 3)
      doc.line(margin, repWithinY, margin, repWithinY + repRowHeight) // Left border
      doc.line(pageWidth - margin, repWithinY, pageWidth - margin, repWithinY + repRowHeight) // Right border
      doc.line(margin, repWithinY + repRowHeight, pageWidth - margin, repWithinY + repRowHeight) // Bottom border
      doc.line(margin + repCol1Width, repWithinY, margin + repCol1Width, repWithinY + repRowHeight) // Vertical divider (only between col1 and merged cols)

      // Add spacing after the table
      yPos += repRowHeight + 10
    } else {
      // Add spacing even if no measurements
      yPos += 10
    }

    // Open PDF in new window
    doc.output('dataurlnewwindow')
  }, [certificateNo, customer, device, procedureTemplate, linearityRecords, eccentricity, repeatability])

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
                          setCustomer({
                            company: newValue.company || '',
                            address: newValue.address || '',
                            city: newValue.city || '',
                            state: newValue.state || '',
                            zip: newValue.zip || newValue.pincode || '',
                            contact: newValue.contactPerson || '',
                            mobile: newValue.mobile || ''
                          })
                          setCustomerNameInputValue(newValue.customerName || '')
                        } else {
                          setCustomer({
                            company: '',
                            address: '',
                            city: '',
                            state: '',
                            zip: '',
                            contact: '',
                            mobile: ''
                          })
                          setCustomerNameInputValue('')
                        }
                      }}
                      inputValue={customerNameInputValue}
                      onInputChange={(_, newInputValue) => setCustomerNameInputValue(newInputValue)}
                      getOptionLabel={option => option?.customerName || ''}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
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
