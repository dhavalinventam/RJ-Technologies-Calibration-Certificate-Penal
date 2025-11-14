import React, { useCallback, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultDevices, Device } from './deviceData'

const PRIMARY_ACCENT = '#2563EB'
const TITLE_COLOR = '#111827'
const LABEL_COLOR = '#4B5563'
const VALUE_COLOR = '#1F2937'
const CARD_BORDER = '1px solid rgba(148, 163, 184, 0.25)'
const CARD_SHADOW = '0 1px 3px rgba(15, 23, 42, 0.08)'

const ECCENTRICITY_POSITION_LABELS: Record<'center' | 'leftFront' | 'leftRear' | 'rightRear' | 'rightFront', string> = {
  center: 'Center',
  leftFront: 'Left Front',
  leftRear: 'Left Rear',
  rightRear: 'Right Rear',
  rightFront: 'Right Front'
}

const UNCERTAINTY_TABLE_ONE_COLUMNS: Array<'xi' | '0 kg' | '20 kg' | '50 kg' | '70 kg'> = [
  'xi',
  '0 kg',
  '20 kg',
  '50 kg',
  '70 kg'
]

const UNCERTAINTY_TABLE_TWO_COLUMNS: Array<'xi' | '100 kg' | '120 kg' | '150 kg' | 'N/A'> = [
  'xi',
  '100 kg',
  '120 kg',
  '150 kg',
  'N/A'
]

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Paper
    sx={{
      p: { xs: 2.5, md: 3 },
      borderRadius: 3,
      border: CARD_BORDER,
      boxShadow: CARD_SHADOW,
      backgroundColor: '#FFFFFF'
    }}
  >
    <Typography variant='h6' sx={{ fontWeight: 600, color: TITLE_COLOR, mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
)

const DataSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Accordion
    defaultExpanded
    disableGutters
    sx={{
      borderRadius: 3,
      border: CARD_BORDER,
      boxShadow: CARD_SHADOW,
      '&:before': { display: 'none' },
      overflow: 'hidden'
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: VALUE_COLOR }} />}
      sx={{
        backgroundColor: '#FFFFFF',
        px: { xs: 2.5, md: 3 },
        py: 2
      }}
    >
      <Typography variant='h6' sx={{ fontWeight: 600, color: TITLE_COLOR }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ px: { xs: 2.5, md: 3 }, pb: 3, backgroundColor: '#FFFFFF' }}>{children}</AccordionDetails>
  </Accordion>
)

const ResponsiveTable: React.FC<{ headers: string[]; rows: (string | number)[][] }> = ({ headers, rows }) => (
  <TableContainer
    sx={{
      borderRadius: 2,
      border: '1px solid rgba(148, 163, 184, 0.25)',
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      overflowX: 'auto'
    }}
  >
    <Table size='small' sx={{ minWidth: 720 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
          {headers.map(header => (
            <TableCell
              key={header}
              sx={{
                fontWeight: 600,
                color: VALUE_COLOR,
                fontSize: '0.9rem',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={`row-${rowIndex}`} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
            {row.map((cell, cellIndex) => (
              <TableCell
                key={`cell-${rowIndex}-${cellIndex}`}
                sx={{ fontSize: '0.9rem', color: VALUE_COLOR, textAlign: 'center', whiteSpace: 'nowrap' }}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

const ViewDevice = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { mode, toggleTheme } = useThemeContext()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const device: Device | undefined = useMemo(() => {
    try {
      const stored = localStorage.getItem('devices')
      if (stored) {
        const parsed: Device[] = JSON.parse(stored)
        const found = parsed.find(item => item.id === id)
        if (found) return found
      }
    } catch (err) {
      console.error('Failed to read devices from storage', err)
    }
    return defaultDevices.find(item => item.id === id)
  }, [id])

  const renderKeyValue = (label: string, value?: string | null) => (
    <Box>
      <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar open={sidebarOpen} onToggle={handleToggleSidebar} />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#F8FAFC',
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
            zIndex: 1,
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

            fontFamily: 'Inter, "Open Sans", sans-serif'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mx: 'auto' }}>
            <Paper
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2.5,
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                border: CARD_BORDER,
                boxShadow: CARD_SHADOW,
                backgroundColor: '#FFFFFF'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => navigate('/devices')}
                  sx={{
                    color: VALUE_COLOR,
                    borderRadius: 2,
                    border: '1px solid rgba(148, 163, 184, 0.4)',
                    backgroundColor: '#FFFFFF',
                    width: 42,
                    height: 42,
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      color: PRIMARY_ACCENT
                    }
                  }}
                >
                  <ArrowBackIcon fontSize='small' />
                </IconButton>
                <Box>
                  <Typography
                    variant='h5'
                    sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.4rem', md: '1.75rem' } }}
                  >
                    Device Details
                  </Typography>
                  <Typography variant='body2' sx={{ color: LABEL_COLOR }}>
                    View device information
                  </Typography>
                </Box>
              </Box>
              {device && (
                <Button
                  variant='contained'
                  startIcon={<EditIcon />}
                  onClick={() => navigate('/devices', { state: { editDeviceId: device.id } })}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: PRIMARY_ACCENT,
                    borderRadius: 2,
                    px: 3,
                    py: 1.15,
                    boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: '#1D4ED8'
                    }
                  }}
                >
                  Edit Device
                </Button>
              )}
            </Paper>

            {!device ? (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: CARD_BORDER,
                  boxShadow: CARD_SHADOW,
                  backgroundColor: '#FFFFFF'
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 600, color: TITLE_COLOR, mb: 1 }}>
                  Device Not Found
                </Typography>
                <Typography variant='body2' sx={{ color: LABEL_COLOR }}>
                  We couldn’t find the device you were looking for. It may have been removed or the link is incorrect.
                </Typography>
              </Paper>
            ) : (
              <>
                <Paper
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: CARD_BORDER,
                    boxShadow: CARD_SHADOW,
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <Typography variant='h5' sx={{ fontWeight: 700, color: TITLE_COLOR, mb: 0.75 }}>
                    {device.deviceName}
                  </Typography>
                  <Typography variant='body2' sx={{ color: LABEL_COLOR }}>
                    Serial Number:&nbsp;
                    <Typography component='span' variant='body2' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                      {device.serialNumber}
                    </Typography>
                  </Typography>
                </Paper>

                <SectionCard title='Customer Details'>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
                    }}
                  >
                    {[
                      { label: 'Customer', value: device.customer },
                      { label: 'Location', value: device.location },
                      { label: 'Tag Number', value: device.tagNumber }
                    ].map(detail => (
                      <Box
                        key={detail.label}
                        sx={{
                          backgroundColor: '#F9FAFB',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: 2,
                          p: 2
                        }}
                      >
                        <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 0.5 }}>
                          {detail.label}
                        </Typography>
                        <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                          {detail.value || '—'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </SectionCard>

                <SectionCard title='Device Information'>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
                    }}
                  >
                    {renderKeyValue('Manufacturer', device.manufacturer)}
                    {renderKeyValue('Model', device.model)}
                    {renderKeyValue('Terminal Model', device.terminalModel)}
                    {renderKeyValue('Max Capacity', device.maxCapacity)}
                    {renderKeyValue('Readability', device.readability)}
                    {renderKeyValue('Verification Value', device.verificationValue)}
                  </Box>
                </SectionCard>

                <DataSection title='Linearity'>
                  <ResponsiveTable
                    headers={['Nominal Value', 'Reading', 'Error', 'Allowable Error', 'Within Tolerances']}
                    rows={device.linearityRows.map(row => [
                      row.nominalValue || '—',
                      row.reading || '—',
                      row.error || '—',
                      row.allowableError || '—',
                      row.withinTolerance || '—'
                    ])}
                  />
                </DataSection>

                <DataSection title='Eccentricity'>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                      mb: 2
                    }}
                  >
                    {[
                      { label: 'Test Weight', value: device.eccentricityData.testWeight },
                      { label: 'Maximum Deviation', value: device.eccentricityData.maximumDeviation },
                      { label: 'Allowable Deviation', value: device.eccentricityData.allowableDeviation },
                      { label: 'Within Tolerances', value: device.eccentricityData.withinTolerance }
                    ].map(detail => (
                      <Box
                        key={detail.label}
                        sx={{
                          backgroundColor: '#F9FAFB',
                          borderRadius: 2,
                          p: 2,
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}
                      >
                        <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 0.5 }}>
                          {detail.label}
                        </Typography>
                        <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                          {detail.value || '—'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
                    }}
                  >
                    {(
                      Object.keys(ECCENTRICITY_POSITION_LABELS) as Array<keyof typeof ECCENTRICITY_POSITION_LABELS>
                    ).map(positionKey => (
                      <Paper
                        key={positionKey}
                        elevation={0}
                        sx={{
                          border: CARD_BORDER,
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                          borderRadius: 2,
                          p: 2,
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 600 }}>
                          {ECCENTRICITY_POSITION_LABELS[positionKey]}
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#6B7280', mt: 1 }}>
                          Displayed Value
                        </Typography>
                        <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                          {device.eccentricityData.positions[positionKey].displayedValue || '—'}
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#6B7280', mt: 1 }}>
                          Deviation
                        </Typography>
                        <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                          {device.eccentricityData.positions[positionKey].deviation || '—'}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </DataSection>

                <DataSection title='Repeatability'>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                      mb: 2
                    }}
                  >
                    {[
                      { label: 'Test Weight', value: device.repeatabilityData.testWeight },
                      { label: 'Deviation', value: device.repeatabilityData.deviation },
                      { label: 'Allowable Error', value: device.repeatabilityData.allowableError },
                      { label: 'Within Tolerances', value: device.repeatabilityData.withinTolerance }
                    ].map(detail => (
                      <Box
                        key={detail.label}
                        sx={{
                          backgroundColor: '#F9FAFB',
                          borderRadius: 2,
                          p: 2,
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}
                      >
                        <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 0.5 }}>
                          {detail.label}
                        </Typography>
                        <Typography variant='body1' sx={{ color: VALUE_COLOR, fontWeight: 600 }}>
                          {detail.value || '—'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <ResponsiveTable
                    headers={['Without Test Weight', 'With Test Weight', 'As Found']}
                    rows={device.repeatabilityData.measurements.map(row => [
                      row.withoutTestWeight || '—',
                      row.withTestWeight || '—',
                      row.asFound || '—'
                    ])}
                  />
                </DataSection>

                <DataSection title='Uncertainty'>
                  <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 1 }}>
                    Loads Applied – Table 1
                  </Typography>
                  <TableContainer sx={{ mb: 3 }}>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          {UNCERTAINTY_TABLE_ONE_COLUMNS.map(column => (
                            <TableCell key={column}>{column.toUpperCase()}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {UNCERTAINTY_TABLE_ONE_COLUMNS.map(column => (
                            <TableCell key={column}>{device.uncertaintyData.tableOne[column] || '-'}</TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant='subtitle2' sx={{ color: LABEL_COLOR, fontWeight: 500, mb: 1 }}>
                    Loads Applied – Table 2
                  </Typography>
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          {UNCERTAINTY_TABLE_TWO_COLUMNS.map(column => (
                            <TableCell key={column}>{column.toUpperCase()}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {UNCERTAINTY_TABLE_TWO_COLUMNS.map(column => (
                            <TableCell key={column}>{device.uncertaintyData.tableTwo[column] || '-'}</TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </DataSection>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ViewDevice
