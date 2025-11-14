import React, { useState, useCallback } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'
import jsPDF from 'jspdf'

const PRIMARY_COLOR = '#2563EB'
const PAGE_BACKGROUND = '#F8FAFC'
const TITLE_COLOR = '#111827'
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

const GeneratePDF = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()

  // Form state
  const [formData, setFormData] = useState({
    // To section
    toCompany: 'UNISON PHARMACEUTICALS PVT. LTD.',
    toAddress: 'Unit - III, C/7, 8, 9 Steel Town, Vill. Moraiya, Tal. Sanand, Ahmedabad.',

    // General Machine Details
    refNo: '',
    make: '',
    model: '',
    mcSrNo: '',
    idNo: '',
    refCertificateNo: '',
    refCertificateDate: '',
    capacity: '',
    leastCount: '',
    acceptanceCriteria: '',
    typeOfWeight: '',
    mcLocation: '',
    calibrationDoneBy: '',
    calibrationDate: '',

    // Calibration Chart (6 rows)
    calibrationChart: Array(6)
      .fill(null)
      .map((_, i) => ({
        srNo: i + 1,
        standardWeight: '',
        displayedWeight: '',
        deviation: ''
      })),

    // Linearity (5 rows)
    linearity: Array(5)
      .fill(null)
      .map((_, i) => ({
        srNo: i + 1,
        loadingWeight: '',
        loadingDisplayed: '',
        unloadingWeight: '',
        unloadingDisplayed: ''
      })),

    // Eccentricity (5 rows: Centre + 4)
    eccentricity: [
      { testPoint: 'Centre', standardWeight: '', displayedWeight: '' },
      ...Array(4)
        .fill(null)
        .map((_, i) => ({
          testPoint: (i + 1).toString(),
          standardWeight: '',
          displayedWeight: ''
        }))
    ],

    // Repeatability (5 rows)
    repeatability: Array(5)
      .fill(null)
      .map((_, i) => ({
        testNo: ['1st', '2nd', '3rd', '4th', '5th'][i],
        displayedWeight: ''
      })),

    // Creep Test (4 rows)
    creepTest: [
      { time: '00 Minutes', displayedWeight: '' },
      { time: '01 Minutes', displayedWeight: '' },
      { time: '03 Minutes', displayedWeight: '' },
      { time: '05 Minutes', displayedWeight: '' }
    ],

    // Remarks and Status
    remarks: 'Checked the machine and calibrate with standard weights.',
    status: 'Found working satisfactory',
    nextCalibrationDueDate: '',
    calibratedBy: ''
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTableChange = (section: string, index: number, field: string, value: string) => {
    setFormData(prev => {
      const newSection = [...(prev[section as keyof typeof prev] as any[])]
      newSection[index] = { ...newSection[index], [field]: value }
      return { ...prev, [section]: newSection }
    })
  }

  const generatePDF = useCallback(() => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 7 // Optimized margin for single page
    const contentWidth = pageWidth - margin * 2
    let yPos = margin

    doc.setFont('helvetica')

    // Optimized table drawing function for single page layout
    const drawTable = (
      headers: string[],
      rows: any[][],
      startY: number,
      colWidths: number[],
      startX: number = margin
    ) => {
      const rowHeight = 6 // Increased row height for better spacing
      const headerHeight = 6 // Increased header height for better spacing
      const borderColor = [180, 180, 180] // Gray border for headers
      const cellBorderColor = [200, 200, 200] // Lighter gray for cells
      const cellPadding = 2.5 // Slightly increased padding
      let currentY = startY

      // Draw header with borders only (no background color) for clear visibility
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.3)
      let xPos = startX
      headers.forEach((header, idx) => {
        // Draw border only, no fill - for clear heading visibility
        doc.rect(xPos, currentY, colWidths[idx], headerHeight, 'S')
        doc.setFontSize(8) // Increased font size
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0) // Black text for clear visibility
        const textX = xPos + colWidths[idx] / 2
        const textY = currentY + headerHeight / 2 + 1.5
        doc.text(header, textX, textY, { align: 'center' })
        xPos += colWidths[idx]
      })
      currentY += headerHeight

      // Draw rows with borders
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8) // Increased font size
      rows.forEach(row => {
        xPos = startX
        row.forEach((cell, colIdx) => {
          doc.setDrawColor(cellBorderColor[0], cellBorderColor[1], cellBorderColor[2])
          doc.setLineWidth(0.2)
          doc.rect(xPos, currentY, colWidths[colIdx], rowHeight, 'S')
          doc.setTextColor(0, 0, 0) // Black text
          const textX = xPos + colWidths[colIdx] / 2
          const textY = currentY + rowHeight / 2 + 1.5
          const cellText = (cell || '').toString()
          const maxWidth = colWidths[colIdx] - cellPadding * 2
          if (doc.getTextWidth(cellText) > maxWidth) {
            const wrapped = doc.splitTextToSize(cellText, maxWidth)
            doc.text(wrapped[0], textX, textY, { align: 'center' })
          } else {
            doc.text(cellText, textX, textY, { align: 'center' })
          }
          xPos += colWidths[colIdx]
        })
        currentY += rowHeight
      })

      return currentY
    }

    // ========== HEADER SECTION ==========
    // "To," block
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('To,', margin, yPos)
    yPos += 4

    // Company Name
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(formData.toCompany, margin, yPos)
    yPos += 4

    // Address
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    const addressLines = doc.splitTextToSize(formData.toAddress, contentWidth)
    addressLines.forEach((line: string) => {
      doc.text(line, margin, yPos)
      yPos += 5
    })
    yPos += 5

    // Main Title: CALIBRATION CERTIFICATE (centered, bold)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const title = 'CALIBRATION CERTIFICATE'
    const titleWidth = doc.getTextWidth(title)
    doc.text(title, (pageWidth - titleWidth) / 2, yPos)
    yPos += 2
    // Underline
    doc.setLineWidth(0.3)
    doc.setDrawColor(0, 0, 0)
    doc.line((pageWidth - titleWidth) / 2, yPos, (pageWidth - titleWidth) / 2 + titleWidth, yPos)
    yPos += 3

    // ========== DEVICE DETAILS TABLE ==========
    // Create a two-column table for device details (no header row)
    const deviceDetailsColWidths = [42, 56, 42, 56]

    const deviceDetailsRows = [
      ['Ref. No.', formData.refNo || '', 'Capacity', formData.capacity || ''],
      ['Make', formData.make || '', 'Least Count', formData.leastCount || ''],
      ['Model', formData.model || '', 'Acceptance Criteria', formData.acceptanceCriteria || ''],
      ['M/C Sr. No.', formData.mcSrNo || '', 'Type of weight used for Calibration', formData.typeOfWeight || ''],
      ['ID No.', formData.idNo || '', 'M/C Location', formData.mcLocation || ''],
      [
        'Ref. Certificate No.',
        formData.refCertificateNo || '',
        'Calibration Done By',
        formData.calibrationDoneBy || ''
      ],
      ['Ref. Certificate Date', formData.refCertificateDate || '', 'Calibration Date', formData.calibrationDate || '']
    ]

    // Draw table without headers (optimized for single page)
    const deviceRowHeight = 6
    const deviceCellBorderColor = [200, 200, 200]
    const deviceCellPadding = 2.5
    let currentY = yPos

    deviceDetailsRows.forEach(row => {
      let xPos = margin
      row.forEach((cell, colIdx) => {
        doc.setDrawColor(deviceCellBorderColor[0], deviceCellBorderColor[1], deviceCellBorderColor[2])
        doc.setLineWidth(0.2)
        doc.rect(xPos, currentY, deviceDetailsColWidths[colIdx], deviceRowHeight, 'S')
        doc.setTextColor(0, 0, 0) // Black text
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        const textX = xPos + deviceCellPadding
        const textY = currentY + deviceRowHeight / 2 + 1.5
        const cellText = (cell || '').toString()
        const maxWidth = deviceDetailsColWidths[colIdx] - deviceCellPadding * 2
        if (doc.getTextWidth(cellText) > maxWidth) {
          const wrapped = doc.splitTextToSize(cellText, maxWidth)
          doc.text(wrapped[0], textX, textY)
        } else {
          doc.text(cellText, textX, textY)
        }
        xPos += deviceDetailsColWidths[colIdx]
      })
      currentY += deviceRowHeight
    })

    yPos = currentY + 3

    // ========== CALIBRATION CHART ==========
    // Add top space before title
    yPos += 3

    // Section heading (centered)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const calChartTitle = 'Calibration Chart'
    const calChartTitleWidth = doc.getTextWidth(calChartTitle)
    doc.text(calChartTitle, (pageWidth - calChartTitleWidth) / 2, yPos)
    yPos += 3

    const calChartHeaders = ['Sr. No.', 'Standard weight in kg/gm', 'Displayed Weight kg/gm', 'Deviation kg/gm']
    const calChartColWidths = [22, 58, 58, 58]
    const calChartRows = formData.calibrationChart.map(row => [
      row.srNo.toString(),
      row.standardWeight || '',
      row.displayedWeight || '',
      row.deviation || ''
    ])
    yPos = drawTable(calChartHeaders, calChartRows, yPos, calChartColWidths) + 3

    // ========== LINEARITY ==========
    // Add top space before title
    yPos += 3

    // Section heading (centered)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const linearityTitle = 'Linearity'
    const linearityTitleWidth = doc.getTextWidth(linearityTitle)
    doc.text(linearityTitle, (pageWidth - linearityTitleWidth) / 2, yPos)
    yPos += 3

    const linearityHeaders = [
      'Sr. No.',
      'Loading weight kg/gm',
      'Displayed Weight kg/gm',
      'Unloading weight kg/gm',
      'Displayed Weight kg/gm'
    ]
    const linearityColWidths = [22, 43, 43, 44, 44]
    const linearityRows = formData.linearity.map(row => [
      row.srNo.toString(),
      row.loadingWeight || '',
      row.loadingDisplayed || '',
      row.unloadingWeight || '',
      row.unloadingDisplayed || ''
    ])
    yPos = drawTable(linearityHeaders, linearityRows, yPos, linearityColWidths) + 3

    // ========== ECCENTRICITY AND REPEATABILITY (SIDE BY SIDE) ==========
    // Add top space before titles
    yPos += 3

    const eccTableWidth = 116 // Sum of column widths (22 + 47 + 47)
    const repTableWidth = 70 // Sum of column widths (22 + 48)
    const gapBetweenTables = 8

    // Calculate table positions
    const repStartX = margin + eccTableWidth + gapBetweenTables

    // Eccentricity (left side) - Section heading (centered above its table)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const eccTitle = 'Eccentricity'
    const eccTitleWidth = doc.getTextWidth(eccTitle)
    const eccTableCenterX = margin + eccTableWidth / 2
    doc.text(eccTitle, eccTableCenterX - eccTitleWidth / 2, yPos)

    // Repeatability (right side) - Section heading (centered above its table)
    const repTitle = 'Repeatability'
    const repTitleWidth = doc.getTextWidth(repTitle)
    const repTableCenterX = repStartX + repTableWidth / 2
    doc.text(repTitle, repTableCenterX - repTitleWidth / 2, yPos)

    yPos += 3

    const eccHeaders = ['Test Point No.', 'Standard weight in kg/gm', 'Displayed Weight kg/gm']
    const eccColWidths = [22, 47, 50]
    const eccRows = formData.eccentricity.map(row => [
      row.testPoint,
      row.standardWeight || '',
      row.displayedWeight || ''
    ])
    const eccEndY = drawTable(eccHeaders, eccRows, yPos, eccColWidths, margin)

    const repHeaders = ['No. of Test', 'Displayed Weight kg/gm']
    const repColWidths = [22, 50]
    const repRows = formData.repeatability.map(row => [row.testNo, row.displayedWeight || ''])
    const repEndY = drawTable(repHeaders, repRows, yPos, repColWidths, repStartX)

    yPos = Math.max(eccEndY, repEndY) + 3

    // ========== CREEP TEST (Extended Table with Footer) ==========
    // Add top space before title
    yPos += 3

    // Section heading (centered)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const creepTitle = 'Creep Test'
    const creepTitleWidth = doc.getTextWidth(creepTitle)
    doc.text(creepTitle, (pageWidth - creepTitleWidth) / 2, yPos)
    yPos += 3

    // Extended Creep Test table with footer information (optimized for single page)
    const creepTableWidth = contentWidth
    const creepColWidths = [95, 101]
    const creepRowHeight = 6
    const creepHeaderHeight = 6
    const creepCellPadding = 2.5
    const creepBorderColor = [180, 180, 180]
    const creepCellBorderColor = [200, 200, 200]
    let creepCurrentY = yPos

    // Draw header row (no background color, borders only)
    doc.setDrawColor(creepBorderColor[0], creepBorderColor[1], creepBorderColor[2])
    doc.setLineWidth(0.2)
    doc.rect(margin, creepCurrentY, creepColWidths[0], creepHeaderHeight, 'S')
    doc.rect(margin + creepColWidths[0], creepCurrentY, creepColWidths[1], creepHeaderHeight, 'S')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Time', margin + creepColWidths[0] / 2, creepCurrentY + creepHeaderHeight / 2 + 1.5, { align: 'center' })
    doc.text(
      'Displayed Weight kg/gm',
      margin + creepColWidths[0] + creepColWidths[1] / 2,
      creepCurrentY + creepHeaderHeight / 2 + 1.5,
      { align: 'center' }
    )
    creepCurrentY += creepHeaderHeight

    // Draw time data rows (no background color, borders only)
    formData.creepTest.forEach(row => {
      doc.setDrawColor(creepCellBorderColor[0], creepCellBorderColor[1], creepCellBorderColor[2])
      doc.setLineWidth(0.2)
      doc.rect(margin, creepCurrentY, creepColWidths[0], creepRowHeight, 'S')
      doc.rect(margin + creepColWidths[0], creepCurrentY, creepColWidths[1], creepRowHeight, 'S')

      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text(row.time || '', margin + creepColWidths[0] / 2, creepCurrentY + creepRowHeight / 2 + 1.5, {
        align: 'center'
      })
      doc.text(
        row.displayedWeight || '',
        margin + creepColWidths[0] + creepColWidths[1] / 2,
        creepCurrentY + creepRowHeight / 2 + 1.5,
        { align: 'center' }
      )
      creepCurrentY += creepRowHeight
    })

    // Draw Remarks row (spans both columns, no background color, borders only)
    doc.setDrawColor(creepCellBorderColor[0], creepCellBorderColor[1], creepCellBorderColor[2])
    doc.setLineWidth(0.2)
    doc.rect(margin, creepCurrentY, creepTableWidth, creepRowHeight, 'S')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const remarksText = `Remarks: ${formData.remarks}`
    const remarksLines = doc.splitTextToSize(remarksText, creepTableWidth - creepCellPadding * 2)
    doc.text(remarksLines[0], margin + creepCellPadding, creepCurrentY + creepRowHeight / 2 + 1.5)
    if (remarksLines.length > 1) {
      creepCurrentY += creepRowHeight
      doc.rect(margin, creepCurrentY, creepTableWidth, creepRowHeight, 'S')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      doc.text(remarksLines[1], margin + creepCellPadding, creepCurrentY + creepRowHeight / 2 + 1.5)
    }
    creepCurrentY += creepRowHeight

    // Draw Status and Next Calibration Due Date row (no background color, borders only)
    doc.setDrawColor(creepCellBorderColor[0], creepCellBorderColor[1], creepCellBorderColor[2])
    doc.setLineWidth(0.2)
    doc.rect(margin, creepCurrentY, creepColWidths[0], creepRowHeight, 'S')
    doc.rect(margin + creepColWidths[0], creepCurrentY, creepColWidths[1], creepRowHeight, 'S')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(`Status: ${formData.status}`, margin + creepCellPadding, creepCurrentY + creepRowHeight / 2 + 1.5)
    doc.text(
      `Next Calibration Due Date: ${formData.nextCalibrationDueDate || ''}`,
      margin + creepColWidths[0] + creepCellPadding,
      creepCurrentY + creepRowHeight / 2 + 1.5
    )
    creepCurrentY += creepRowHeight

    // Draw Note and Calibrated By row (no background color, borders only)
    doc.setDrawColor(creepCellBorderColor[0], creepCellBorderColor[1], creepCellBorderColor[2])
    doc.setLineWidth(0.2)
    doc.rect(margin, creepCurrentY, creepColWidths[0], creepRowHeight, 'S')
    doc.rect(margin + creepColWidths[0], creepCurrentY, creepColWidths[1], creepRowHeight, 'S')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    const noteText = 'Note: This Certificate refers to the value obtained at the time of calibration.'
    const noteLines = doc.splitTextToSize(noteText, creepColWidths[0] - creepCellPadding * 2)
    doc.text(noteLines[0], margin + creepCellPadding, creepCurrentY + creepRowHeight / 2 + 1.5)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(
      `Calibrated By: ${formData.calibratedBy || ''}`,
      margin + creepColWidths[0] + creepCellPadding,
      creepCurrentY + creepRowHeight / 2 + 1.5
    )
    creepCurrentY += creepRowHeight

    yPos = creepCurrentY

    // Add bottom space
    yPos += 5

    // Save PDF
    doc.save('calibration-certificate.pdf')
  }, [formData])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'row', backgroundColor: PAGE_BACKGROUND }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleTheme={toggleTheme}
          mode={mode}
          sidebarOpen={sidebarOpen}
        />
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            zIndex: '1',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
            p: 3,
            mt: 10,
            fontFamily: 'Inter, "Open Sans", sans-serif'
          }}
        >
          <Paper sx={{ ...cardBaseStyles, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                pb: 2,
                borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
              }}
            >
              <Typography variant='h5' sx={{ fontWeight: 700, color: TITLE_COLOR }}>
                Generate Calibration Certificate PDF
              </Typography>
              <Button
                variant='contained'
                onClick={generatePDF}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 1.15,
                  backgroundColor: PRIMARY_COLOR,
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                  '&:hover': {
                    backgroundColor: '#1D4ED8',
                    boxShadow: '0 4px 8px rgba(37, 99, 235, 0.3)'
                  }
                }}
              >
                Generate PDF
              </Button>
            </Box>

            {/* To Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                To
              </Typography>
              <TextField
                fullWidth
                label='Company Name'
                value={formData.toCompany}
                onChange={e => handleInputChange('toCompany', e.target.value)}
                sx={{ mb: 2 }}
                size='small'
              />
              <TextField
                fullWidth
                label='Address'
                value={formData.toAddress}
                onChange={e => handleInputChange('toAddress', e.target.value)}
                multiline
                rows={2}
              />
            </Box>

            {/* General Machine Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                General Machine and Calibration Details
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: '1fr', // 1 column on extra-small screens
                    sm: 'repeat(2, 1fr)', // 2 columns on small screens
                    md: 'repeat(3, 1fr)', // 4 columns on medium and up
                    lg: 'repeat(4, 1fr)'
                  }
                }}
              >
                <TextField
                  label='Ref. No.'
                  value={formData.refNo}
                  onChange={e => handleInputChange('refNo', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Make'
                  value={formData.make}
                  onChange={e => handleInputChange('make', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Model'
                  value={formData.model}
                  onChange={e => handleInputChange('model', e.target.value)}
                  size='small'
                />
                <TextField
                  label='M/C Sr. No.'
                  value={formData.mcSrNo}
                  onChange={e => handleInputChange('mcSrNo', e.target.value)}
                  size='small'
                />
                <TextField
                  label='ID No.'
                  value={formData.idNo}
                  onChange={e => handleInputChange('idNo', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Ref. Certificate No.'
                  value={formData.refCertificateNo}
                  onChange={e => handleInputChange('refCertificateNo', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Ref. Certificate Date'
                  value={formData.refCertificateDate}
                  onChange={e => handleInputChange('refCertificateDate', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Capacity'
                  value={formData.capacity}
                  onChange={e => handleInputChange('capacity', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Least Count'
                  value={formData.leastCount}
                  onChange={e => handleInputChange('leastCount', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Acceptance Criteria'
                  value={formData.acceptanceCriteria}
                  onChange={e => handleInputChange('acceptanceCriteria', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Type of weight used for Calibration'
                  value={formData.typeOfWeight}
                  onChange={e => handleInputChange('typeOfWeight', e.target.value)}
                  size='small'
                />
                <TextField
                  label='M/C Location'
                  value={formData.mcLocation}
                  onChange={e => handleInputChange('mcLocation', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Calibration Done By'
                  value={formData.calibrationDoneBy}
                  onChange={e => handleInputChange('calibrationDoneBy', e.target.value)}
                  size='small'
                />
                <TextField
                  label='Calibration Date'
                  value={formData.calibrationDate}
                  onChange={e => handleInputChange('calibrationDate', e.target.value)}
                  size='small'
                />
              </Box>
            </Box>

            {/* Calibration Chart */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Calibration Chart
              </Typography>
              <TableContainer>
                <Table size='small' sx={{ border: '1px solid #ddd' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Sr. NO.</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                        Standard weight in Kg/gm
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Displayed Weight kg/gm</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Deviation kg/gm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.calibrationChart.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.srNo}</TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.standardWeight}
                            onChange={e => handleTableChange('calibrationChart', idx, 'standardWeight', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.displayedWeight}
                            onChange={e =>
                              handleTableChange('calibrationChart', idx, 'displayedWeight', e.target.value)
                            }
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.deviation}
                            onChange={e => handleTableChange('calibrationChart', idx, 'deviation', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Linearity */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Linearity
              </Typography>
              <TableContainer>
                <Table size='small' sx={{ border: '1px solid #ddd' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Sr. NO.</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Loading weight kg/gm</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Displayed Weight kg/gm</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Unloading weight kg/gm</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Displayed Weight kg/gm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.linearity.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.srNo}</TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.loadingWeight}
                            onChange={e => handleTableChange('linearity', idx, 'loadingWeight', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.loadingDisplayed}
                            onChange={e => handleTableChange('linearity', idx, 'loadingDisplayed', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.unloadingWeight}
                            onChange={e => handleTableChange('linearity', idx, 'unloadingWeight', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.unloadingDisplayed}
                            onChange={e => handleTableChange('linearity', idx, 'unloadingDisplayed', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Eccentricity and Repeatability */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 400 }}>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                  Eccentricity
                </Typography>
                <TableContainer>
                  <Table size='small' sx={{ border: '1px solid #ddd' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Test Point NO.</TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                          Standard weight in Kg/gm
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                          Displayed Weight kg/gm
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.eccentricity.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{row.testPoint}</TableCell>
                          <TableCell>
                            <TextField
                              size='small'
                              value={row.standardWeight}
                              onChange={e => handleTableChange('eccentricity', idx, 'standardWeight', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size='small'
                              value={row.displayedWeight}
                              onChange={e => handleTableChange('eccentricity', idx, 'displayedWeight', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                  Repeatability
                </Typography>
                <TableContainer>
                  <Table size='small' sx={{ border: '1px solid #ddd' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>No. Of Test</TableCell>
                        <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                          Displayed Weight kg/gm
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.repeatability.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{row.testNo}</TableCell>
                          <TableCell>
                            <TextField
                              size='small'
                              value={row.displayedWeight}
                              onChange={e => handleTableChange('repeatability', idx, 'displayedWeight', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            {/* Creep Test */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Creep Test
              </Typography>
              <TableContainer>
                <Table size='small' sx={{ border: '1px solid #ddd' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>Displayed Weight kg/gm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.creepTest.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            value={row.displayedWeight}
                            onChange={e => handleTableChange('creepTest', idx, 'displayedWeight', e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Remarks and Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Remarks and Status
              </Typography>
              <TextField
                fullWidth
                label='Remarks'
                value={formData.remarks}
                onChange={e => handleInputChange('remarks', e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Status'
                value={formData.status}
                onChange={e => handleInputChange('status', e.target.value)}
                sx={{ mb: 2 }}
                size='small'
              />
              <TextField
                label='Next Calibration Due Date'
                value={formData.nextCalibrationDueDate}
                onChange={e => handleInputChange('nextCalibrationDueDate', e.target.value)}
                sx={{ mr: 2, minWidth: 250 }}
                size='small'
              />
              <TextField
                label='Calibrated By'
                value={formData.calibratedBy}
                onChange={e => handleInputChange('calibratedBy', e.target.value)}
                sx={{ minWidth: 250 }}
                size='small'
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default GeneratePDF
