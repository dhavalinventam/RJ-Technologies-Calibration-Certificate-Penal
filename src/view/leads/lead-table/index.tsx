import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Delete, Visibility } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getAllLeads, deleteLead } from '@/redux/slices/leadSlice'
import {
  renderDate,
  renderCurrency,
  renderAssignedUsers,
  renderTags,
  renderPriority,
  renderData,
  renderSource,
  renderDescription
} from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { useNavigate } from 'react-router-dom'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const LeadTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { leadList, loading } = useAppSelector(({ lead }) => lead)
  const navigate = useNavigate()

  // Function to fetch leads with current parameters
  const fetchLeadsWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        is_with_respect_branch: 1,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getAllLeads(payload))
    },
    [dispatch]
  )

  // Use the table state hook
  const {
    handleSortChange,
    handlePageChange,
    handleSearchDebounced: handleSearchChange,
    getState
  } = useTableState({
    onStateChange: state => {
      fetchLeadsWithParams(state)
    }
  })

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeadsWithParams(getState())
  }, [])

  // Define table columns for leads - only showing specific columns as requested
  const columns: Column[] = [
    {
      id: 'sr_number',
      label: '#',
      minWidth: 130,
      format: (_, item: any) => renderData(item?.lead?.sr_number),
      sortable: true
    },
    {
      id: 'lead_receive_date',
      label: 'Receive Date',
      minWidth: 150,
      format: (_, item: any) => renderDate(item?.lead?.lead_receive_date),
      type: 'date',
      sortable: true
    },
    {
      id: 'last_contact_date',
      label: 'Contact Date',
      minWidth: 150,
      format: (_, item: any) => renderDate(item?.lead?.last_contact_date),
      type: 'date',
      sortable: true
    },
    {
      id: 'source_platforms',
      label: 'Source',
      minWidth: 120,
      format: (_, item: any) => renderSource(item?.source_platforms),
      sortable: true
    },
    {
      id: 'budget',
      label: 'Budget',
      minWidth: 100,
      format: (_, item: any) => renderCurrency(item?.lead?.budget),
      sortable: true
    },
    {
      id: 'assigned_to',
      label: 'Members',
      minWidth: 150,
      format: (_, item: any) => <div className='assigned_user_main'>{renderAssignedUsers(item?.assigned_to)}</div>,
      sortable: false
    },
    {
      id: 'tags',
      label: 'Tags',
      minWidth: 150,
      format: (_, item: any) => renderTags(item?.tags),
      sortable: false
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 120,
      format: (_, item: any) => renderPriority(item?.lead?.priority),
      sortable: true
    },
    {
      id: 'details',
      label: 'Description',
      minWidth: 150,
      format: (_, item: any) => renderDescription(item?.lead?.details),
      sortable: false
    }
  ]

  // Define table actions for leads
  const actions: TableAction<any>[] = [
    {
      label: 'View',
      icon: <Visibility fontSize='small' />,
      onClick: lead => navigate(`/leads/details/${lead?.lead?.lead_id}`),
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async lead => {
        deleteModal.onOpen(lead)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected leads:', selected)
  }

  const handleRowClick = (lead: any) => {
    console.log('Clicked lead:', lead)
  }

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteLead(row.lead.lead_id)).unwrap()
      fetchLeadsWithParams(getState())
    } catch (error) {
      console.error('Delete lead error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  // Get the lead data array and total count
  const leadData = leadList?.data || []
  const totalCount = leadList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={leadData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No leads found'
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        totalCount={totalCount}
        sortBy={getState().sortBy}
        sortOrder={getState().sortOrder}
      />
      {deleteModal.isOpen && (
        <DeleteModal
          show={deleteModal.isOpen}
          onHide={deleteModal.onClose}
          onDelete={handleDelete}
          onCancel={deleteModal.onClose}
        />
      )}
    </Box>
  )
}

export default LeadTable
