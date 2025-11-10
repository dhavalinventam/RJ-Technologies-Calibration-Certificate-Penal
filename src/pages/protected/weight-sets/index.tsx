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
  IconButton
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
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box>
              <Typography variant='h5' component='h1' sx={{ fontWeight: 700 }}>
                Weight Sets
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Manage calibration weight sets
              </Typography>
            </Box>
            <Button variant='contained' startIcon={<AddIcon />} onClick={handleAdd} sx={{ textTransform: 'none' }}>
              Add Weight Set
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, width: '100%', mb: 3 }}>
            <TextField
              fullWidth
              placeholder='Search weight sets...'
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

          {/* Weight Sets Table */}
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
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Weight Set No.</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Certificate Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Date of Issue</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Calibration Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWeightSets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                      <Typography variant='body2' color='text.secondary'>
                        No weight sets found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWeightSets.map(weightSet => (
                    <TableRow key={weightSet.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{weightSet.weightSetNo}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{weightSet.certificateNumber}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{weightSet.class}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{weightSet.dateOfIssue}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{weightSet.calibrationDueDate}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <IconButton
                            size='small'
                            onClick={() => handleView(weightSet)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              }
                            }}
                          >
                            <VisibilityIcon fontSize='small' />
                          </IconButton>
                          <IconButton
                            size='small'
                            onClick={() => handleEdit(weightSet)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              }
                            }}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => handleDelete(weightSet.id)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'error.dark',
                                color: 'white'
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
        </Box>
      </Box>
    </Box>
  )
}

export default WeightSets
