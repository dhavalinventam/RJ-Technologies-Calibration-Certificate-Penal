import React, { useCallback, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
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
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/layout/Sidebar'
import Header from '@/layout/Header'
import { useTheme as useThemeContext } from '@/context/ThemeContext'

interface WeightSet {
  id: string
  weightSetNo: string
  certificateNumber: string
  class: string
  dateOfIssue: string
  calibrationDueDate: string
  createdAt?: string
}

const PRIMARY_COLOR = '#2563EB'
const PAGE_BACKGROUND = '#F8FAFC'
const TITLE_COLOR = '#111827'
const SUBTEXT_COLOR = '#6B7280'
const TABLE_TEXT_COLOR = '#1F2937'
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

const tableHeaderCellStyles = {
  fontWeight: 600,
  color: TABLE_TEXT_COLOR,
  fontSize: '0.9rem',
  py: 1.5,
  whiteSpace: 'nowrap'
}

const tableCellStyles = {
  color: TABLE_TEXT_COLOR,
  fontSize: '0.9rem',
  whiteSpace: 'nowrap'
}

const WeightSets = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const { mode, toggleTheme } = useThemeContext()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Sample weight set data - replace with actual data from API
  const [weightSets, setWeightSets] = useState<WeightSet[]>([
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
  ])

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleView = (weightSet: WeightSet) => {
    navigate(`/weight-sets/${weightSet.id}`)
  }

  const handleEdit = (weightSet: WeightSet) => {
    navigate(`/weight-sets/${weightSet.id}/edit`)
  }

  const handleDelete = (weightSetId: string) => {
    // Delete weight set logic here
    setWeightSets(prev => prev.filter(ws => ws.id !== weightSetId))
  }

  const handleAdd = () => {
    navigate('/weight-sets/add')
  }

  const filteredWeightSets = weightSets.filter(
    weightSet =>
      weightSet.weightSetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weightSet.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weightSet.class.toLowerCase().includes(searchTerm.toLowerCase())
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

            fontFamily: 'Inter, "Open Sans", sans-serif'
          }}
        >
          {/* Page Header */}
          <Paper
            sx={{
              ...cardBaseStyles,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Box>
              <Typography
                variant='h5'
                component='h1'
                sx={{ fontWeight: 700, color: TITLE_COLOR, fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 0.5 }}
              >
                Weight Sets
              </Typography>
              <Typography variant='body2' sx={{ color: SUBTEXT_COLOR }}>
                Manage calibration weight sets
              </Typography>
            </Box>
            <Button variant='contained' startIcon={<AddIcon />} onClick={handleAdd} sx={{ ...primaryButtonStyles }}>
              Add Weight Set
            </Button>
          </Paper>

          {/* Search Bar */}
          <Paper sx={{ ...cardBaseStyles, mb: 3, p: { xs: 2, md: 2.5 } }}>
            <TextField
              fullWidth
              placeholder='Search by weight set, certificate number, or class...'
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
              sx={{ ...inputStyles }}
            />
          </Paper>

          {/* Weight Sets Table */}
          <Paper sx={{ ...cardBaseStyles, p: 0, overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F3F4F6' }}>
                    {[
                      'Weight Set No.',
                      'Certificate Number',
                      'Class',
                      'Date of Issue',
                      'Calibration Due Date',
                      'Actions'
                    ].map(header => (
                      <TableCell key={header} sx={{ ...tableHeaderCellStyles }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWeightSets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align='center' sx={{ py: 4, color: SUBTEXT_COLOR }}>
                        No weight sets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWeightSets.map((weightSet, index) => (
                      <TableRow
                        key={weightSet.id}
                        hover
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                          transition: 'background-color 0.2s ease',
                          '&:hover': { backgroundColor: '#EFF6FF' }
                        }}
                      >
                        <TableCell sx={{ ...tableCellStyles, fontWeight: 600 }}>{weightSet.weightSetNo}</TableCell>
                        <TableCell sx={{ ...tableCellStyles }}>{weightSet.certificateNumber}</TableCell>
                        <TableCell sx={{ ...tableCellStyles }}>{weightSet.class}</TableCell>
                        <TableCell sx={{ ...tableCellStyles }}>{weightSet.dateOfIssue}</TableCell>
                        <TableCell sx={{ ...tableCellStyles }}>{weightSet.calibrationDueDate}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title='View' arrow>
                              <IconButton
                                size='small'
                                onClick={() => handleView(weightSet)}
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
                                onClick={() => handleEdit(weightSet)}
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
                                onClick={() => handleDelete(weightSet.id)}
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
      </Box>
    </Box>
  )
}

export default WeightSets
