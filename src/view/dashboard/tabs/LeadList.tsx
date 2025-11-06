import { memo, useEffect, useCallback } from 'react'
import {
  renderAssignedUsers,
  renderPriority,
  renderTags,
  renderDate,
  renderData,
  renderDescription,
  renderSource,
  renderCurrency
} from '@/utils/dataGridCommonFunc'
import ReusableTable, { type Column } from '@/components/common-table'
import { Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchDashboardLeadList } from '@/redux/slices/dashboardSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const LeadList: React.FC = () => {
  const { leadList, loading } = useAppSelector(({ dashboard }) => dashboard)
  const dispatch = useAppDispatch()

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
      dispatch(fetchDashboardLeadList(payload))
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
      minWidth: 120,
      format: (_, item: any) => renderDate(item?.lead?.lead_receive_date),
      type: 'date',
      sortable: true
    },
    {
      id: 'last_contact_date',
      label: 'Contact Date',
      minWidth: 120,
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

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected leads:', selected)
  }

  const handleRowClick = (lead: any) => {
    console.log('Clicked lead:', lead)
  }

  const leadData = leadList?.data || []
  const totalCount = leadList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={leadData || []}
        loading={loading}
        actions={[]}
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
    </Box>
  )
}

export default memo(LeadList)
