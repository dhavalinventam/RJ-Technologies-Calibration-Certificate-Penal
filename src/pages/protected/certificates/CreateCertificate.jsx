import { useCallback, useMemo, useState } from 'react'
import { Box, Typography, Button, TextField, LinearProgress, useTheme, useMediaQuery } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
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

    // Open PDF in new window
    const fileName = `Calibration_Certificate_${certificateNo || 'Certificate'}.pdf`
    doc.output('dataurlnewwindow')
  }, [certificateNo, customer, device])

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
