import { memo, useEffect, useCallback } from 'react'
import { renderAssignedUsers, renderDate, renderData, renderDescription } from '@/utils/dataGridCommonFunc'
import { useTranslation } from 'react-i18next'
import ReusableTable, { type Column } from '@/components/common-table'
import { Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchDashboardReminderList } from '@/redux/slices/dashboardSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const ReminderList: React.FC = () => {
  const { t } = useTranslation()
  const { reminderList, loading } = useAppSelector(({ dashboard }) => dashboard)
  const dispatch = useAppDispatch()

  // Function to fetch reminders with current parameters
  const fetchRemindersWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        is_with_respect_branch: 1,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchDashboardReminderList(payload))
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
      fetchRemindersWithParams(state)
    }
  })

  // Fetch reminders on component mount
  useEffect(() => {
    fetchRemindersWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'reminder_title',
      label: t('reminderTable.title'),
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'start_date',
      label: t('reminderTable.startDate'),
      minWidth: 150,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'end_date',
      label: t('reminderTable.endDate'),
      minWidth: 150,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'frequency',
      label: t('reminderTable.frequency'),
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'assigned_to',
      label: t('reminderTable.assignedTo'),
      minWidth: 150,
      format: (data: any) => <div className='assigned_user_main'>{renderAssignedUsers(data)}</div>,
      sortable: false
    },
    {
      id: 'reminder_description',
      label: t('reminderTable.description'),
      minWidth: 150,
      format: (data: any) => renderDescription(data),
      sortable: false
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected reminders:', selected)
  }

  const handleRowClick = (reminder: any) => {
    console.log('Clicked reminder:', reminder)
  }

  const reminderData = reminderList?.data || []
  const totalCount = reminderList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={reminderData || []}
        loading={loading}
        actions={[]}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No reminders found'
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

export default memo(ReminderList)
