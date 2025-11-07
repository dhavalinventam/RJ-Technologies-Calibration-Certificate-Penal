import { useCallback, useMemo, useState } from 'react'
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
  IconButton
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
  const [device, setDevice] = useState({
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

  // Procedure Template (Step 3) field
  const [procedureTemplate, setProcedureTemplate] = useState('')

  // Linearity (Step 4) records
  const [linearityRecords, setLinearityRecords] = useState([
    {
      nominalValue: '',
      reading: '',
      error: '',
      allowableError: '',
      withinTolerances: ''
    }
  ])

  // Eccentricity (Step 5) data
  const [eccentricity, setEccentricity] = useState({
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

    procedureLines.forEach((line, idx) => {
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
      const tableStartY = yPos
      const colWidths = [
        (pageWidth - margin * 2) * 0.2, // Nominal Value
        (pageWidth - margin * 2) * 0.2, // Reading
        (pageWidth - margin * 2) * 0.2, // Error
        (pageWidth - margin * 2) * 0.2, // Allowable Error
        (pageWidth - margin * 2) * 0.2 // Within Tolerances
      ]
      const rowHeight = 8
      let currentX = margin

      // Draw table header
      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.setFillColor(240, 240, 240)
      const headerY = yPos - 5
      doc.rect(currentX, headerY, pageWidth - margin * 2, rowHeight, 'F')
      doc.text('Nominal Value', currentX + 2, yPos)
      currentX += colWidths[0]
      doc.text('Reading', currentX + 2, yPos)
      currentX += colWidths[1]
      doc.text('Error', currentX + 2, yPos)
      currentX += colWidths[2]
      doc.text('Allowable Error', currentX + 2, yPos)
      currentX += colWidths[3]
      doc.text('Within Tolerances', currentX + 2, yPos)

      // Draw header border
      doc.setLineWidth(0.5)
      doc.setDrawColor(0, 0, 0)
      doc.rect(margin, headerY, pageWidth - margin * 2, rowHeight, 'S')

      // Draw vertical lines for header
      currentX = margin
      for (let i = 0; i < colWidths.length; i++) {
        currentX += colWidths[i]
        if (i < colWidths.length - 1) {
          doc.line(currentX, headerY, currentX, headerY + rowHeight)
        }
      }

      yPos += rowHeight
      doc.setFont(undefined, 'normal')

      // Draw table rows
      validRecords.forEach((record, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
          // Redraw header on new page
          currentX = margin
          doc.setFontSize(10)
          doc.setFont(undefined, 'bold')
          doc.setFillColor(240, 240, 240)
          const newHeaderY = yPos - 5
          doc.rect(currentX, newHeaderY, pageWidth - margin * 2, rowHeight, 'F')
          doc.text('Nominal Value', currentX + 2, yPos)
          currentX += colWidths[0]
          doc.text('Reading', currentX + 2, yPos)
          currentX += colWidths[1]
          doc.text('Error', currentX + 2, yPos)
          currentX += colWidths[2]
          doc.text('Allowable Error', currentX + 2, yPos)
          currentX += colWidths[3]
          doc.text('Within Tolerances', currentX + 2, yPos)

          // Draw header border
          doc.setLineWidth(0.5)
          doc.setDrawColor(0, 0, 0)
          doc.rect(margin, newHeaderY, pageWidth - margin * 2, rowHeight, 'S')

          // Draw vertical lines for header
          currentX = margin
          for (let i = 0; i < colWidths.length; i++) {
            currentX += colWidths[i]
            if (i < colWidths.length - 1) {
              doc.line(currentX, newHeaderY, currentX, newHeaderY + rowHeight)
            }
          }

          yPos += rowHeight
          doc.setFont(undefined, 'normal')
        }

        currentX = margin
        doc.setFontSize(9)
        const rowY = yPos - 3

        // Draw cell content
        doc.text(record.nominalValue || '', currentX + 2, yPos)
        currentX += colWidths[0]

        doc.text(record.reading || '', currentX + 2, yPos)
        currentX += colWidths[1]

        doc.text(record.error || '', currentX + 2, yPos)
        currentX += colWidths[2]

        doc.text(record.allowableError || '', currentX + 2, yPos)
        currentX += colWidths[3]

        doc.text(record.withinTolerances || '', currentX + 2, yPos)

        // Draw row border (bottom)
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.1)
        doc.line(margin, rowY + rowHeight, pageWidth - margin, rowY + rowHeight)

        // Draw vertical lines
        currentX = margin
        for (let i = 0; i < colWidths.length; i++) {
          currentX += colWidths[i]
          if (i < colWidths.length - 1) {
            doc.line(currentX, rowY, currentX, rowY + rowHeight)
          }
        }

        yPos += rowHeight
      })

      // Draw bottom border
      doc.setLineWidth(0.5)
      doc.setDrawColor(0, 0, 0)
      doc.line(margin, yPos - 3, pageWidth - margin, yPos - 3)
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
    const eccRowHeight = 7
    const eccHeaderRowHeight = 7

    // Header Row 1: "Test Weight" | "50 kg" (merged 2 cols) | (empty or "As Found" merged 2 cols)
    const header1Y = yPos
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')

    // Draw borders for header row 1
    doc.setLineWidth(0.5)
    doc.setDrawColor(0, 0, 0)
    doc.rect(margin, header1Y - 5, eccTableWidth, eccHeaderRowHeight, 'S')

    // "Test Weight" (left-aligned in first column)
    doc.text('Test Weight', margin + 2, header1Y)

    // "50 kg" (centered in merged cell spanning col2 and col3)
    const testWeightX = margin + eccCol1Width
    const testWeightWidth = eccCol2Width + eccCol3Width
    const testWeightText = eccentricity.testWeight || '50 kg'
    const testWeightTextWidth = doc.getTextWidth(testWeightText)
    doc.text(testWeightText, testWeightX + testWeightWidth / 2 - testWeightTextWidth / 2, header1Y)

    // Vertical line after "Test Weight"
    doc.line(margin + eccCol1Width, header1Y - 5, margin + eccCol1Width, header1Y - 5 + eccHeaderRowHeight)

    yPos += eccHeaderRowHeight

    // Header Row 2: "Position" | "As Found" (merged 2 cols) | "Displayed Value" | "Deviation"
    const header2Y = yPos
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')

    // Draw borders for header row 2
    doc.rect(margin, header2Y - 5, eccTableWidth, eccHeaderRowHeight, 'S')

    // "Position" (left-aligned)
    doc.text('Position', margin + 2, header2Y)

    // "As Found" (centered in merged cell spanning col2 and col3)
    const asFoundX = margin + eccCol1Width
    const asFoundWidth = eccCol2Width + eccCol3Width
    const asFoundText = 'As Found'
    const asFoundTextWidth = doc.getTextWidth(asFoundText)
    doc.text(asFoundText, asFoundX + asFoundWidth / 2 - asFoundTextWidth / 2, header2Y)

    // Vertical line after "Position"
    doc.line(margin + eccCol1Width, header2Y - 5, margin + eccCol1Width, header2Y - 5 + eccHeaderRowHeight)

    // "Displayed Value" and "Deviation" are sub-columns under "As Found"
    // We'll draw them in a third header row or adjust the layout
    // Actually, based on the description, "As Found" spans both, so we don't need separate headers for Displayed Value and Deviation in row 2
    // But we need them for clarity - let me add a row 3 or adjust

    yPos += eccHeaderRowHeight

    // Header Row 3: (empty) | "Displayed Value" | "Deviation"
    const header3Y = yPos
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')

    // Draw borders for header row 3
    doc.rect(margin, header3Y - 5, eccTableWidth, eccHeaderRowHeight, 'S')

    // Empty first column (or we can put a space)
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
    doc.setFont(undefined, 'normal')

    // Data Rows
    eccentricity.positions.forEach((pos, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 20) {
        doc.addPage()
        yPos = margin
      }

      const rowY = yPos - 3
      doc.setFontSize(9)
      doc.setLineWidth(0.1)
      doc.setDrawColor(0, 0, 0)

      // Position (left-aligned)
      doc.text(pos.position || '', margin + 2, yPos)

      // Displayed Value (centered)
      const dispValueText = pos.displayedValue || ''
      const dispValueTextWidth = doc.getTextWidth(dispValueText)
      doc.text(dispValueText, margin + eccCol1Width + eccCol2Width / 2 - dispValueTextWidth / 2, yPos)

      // Deviation (centered)
      const devText = pos.deviation || ''
      const devTextWidth = doc.getTextWidth(devText)
      doc.text(devText, margin + eccCol1Width + eccCol2Width + eccCol3Width / 2 - devTextWidth / 2, yPos)

      // Draw row borders
      doc.line(margin, rowY + eccRowHeight, pageWidth - margin, rowY + eccRowHeight)
      doc.line(margin + eccCol1Width, rowY, margin + eccCol1Width, rowY + eccRowHeight)
      doc.line(margin + eccCol1Width + eccCol2Width, rowY, margin + eccCol1Width + eccCol2Width, rowY + eccRowHeight)

      yPos += eccRowHeight
    })

    // Summary Rows
    // Maximum Deviation (label spans Position and Displayed Value columns, value in Deviation column, right-aligned)
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = margin
    }
    const maxDevY = yPos - 3
    doc.setFontSize(9)
    doc.text('Maximum Deviation:', margin + 2, yPos)
    const maxDevValue = eccentricity.maximumDeviation || ''
    const maxDevValueWidth = doc.getTextWidth(maxDevValue)
    // Right-align the value in Deviation column
    doc.text(maxDevValue, margin + eccCol1Width + eccCol2Width + eccCol3Width - maxDevValueWidth - 2, yPos)
    doc.setLineWidth(0.1)
    doc.line(margin, maxDevY + eccRowHeight, pageWidth - margin, maxDevY + eccRowHeight)
    doc.line(margin + eccCol1Width, maxDevY, margin + eccCol1Width, maxDevY + eccRowHeight)
    doc.line(
      margin + eccCol1Width + eccCol2Width,
      maxDevY,
      margin + eccCol1Width + eccCol2Width,
      maxDevY + eccRowHeight
    )
    yPos += eccRowHeight

    // Allowable Deviation (label spans Position and Displayed Value columns, value in Deviation column, right-aligned)
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = margin
    }
    const allowDevY = yPos - 3
    doc.text('Allowable Deviation:', margin + 2, yPos)
    const allowDevValue = eccentricity.allowableDeviation || ''
    const allowDevValueWidth = doc.getTextWidth(allowDevValue)
    // Right-align the value in Deviation column
    doc.text(allowDevValue, margin + eccCol1Width + eccCol2Width + eccCol3Width - allowDevValueWidth - 2, yPos)
    doc.line(margin, allowDevY + eccRowHeight, pageWidth - margin, allowDevY + eccRowHeight)
    doc.line(margin + eccCol1Width, allowDevY, margin + eccCol1Width, allowDevY + eccRowHeight)
    doc.line(
      margin + eccCol1Width + eccCol2Width,
      allowDevY,
      margin + eccCol1Width + eccCol2Width,
      allowDevY + eccRowHeight
    )
    yPos += eccRowHeight

    // Within Tolerances (label spans Position and Displayed Value columns, value in Deviation column, centered)
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = margin
    }
    const withinTolY = yPos - 3
    doc.text('Within Tolerances:', margin + 2, yPos)
    const withinTolValue = eccentricity.withinTolerances || ''
    const withinTolValueWidth = doc.getTextWidth(withinTolValue)
    // Center the value in Deviation column
    doc.text(withinTolValue, margin + eccCol1Width + eccCol2Width + eccCol3Width / 2 - withinTolValueWidth / 2, yPos)
    doc.setLineWidth(0.5)
    doc.line(margin, withinTolY + eccRowHeight, pageWidth - margin, withinTolY + eccRowHeight)
    doc.line(margin + eccCol1Width, withinTolY, margin + eccCol1Width, withinTolY + eccRowHeight)
    doc.line(
      margin + eccCol1Width + eccCol2Width,
      withinTolY,
      margin + eccCol1Width + eccCol2Width,
      withinTolY + eccRowHeight
    )

    // Open PDF in new window
    const fileName = `Calibration_Certificate_${certificateNo || 'Certificate'}.pdf`
    doc.output('dataurlnewwindow')
  }, [certificateNo, customer, device, procedureTemplate, linearityRecords, eccentricity])

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
          <Box>
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
                  sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.5rem', md: '1.75rem' } }}
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
                  <div className='col-12'>
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
                  <div className='col-12'>
                    <Typography variant='body2' sx={{ mb: 0.7 }} component='label' className='cc_label'>
                      Draft ID
                    </Typography>
                    <TextField onChange={e => setDraftId(e.target.value)} fullWidth size='small' />
                  </div>
                </div>
              </Box>
            ) : activeStep === 1 ? (
              <Box className='cc_card'>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.125rem' }}>
                    Customer
                  </Typography>
                </Box>

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
                      onChange={e => setDevice(p => ({ ...p, serialNo: e.target.value }))}
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
