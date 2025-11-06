import { memo, useEffect, useCallback } from 'react'
import {
  renderAssignedUsers,
  renderPriority,
  renderStatus,
  renderTags,
  renderDate,
  renderData,
  renderDescription
} from '@/utils/dataGridCommonFunc'
import { useTranslation } from 'react-i18next'
import ReusableTable, { type Column } from '@/components/common-table'
import { Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchDashboardTaskList } from '@/redux/slices/dashboardSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const TaskList: React.FC = () => {
  const { t } = useTranslation()
  const { taskList, loading } = useAppSelector(({ dashboard }) => dashboard)
  const dispatch = useAppDispatch()

  // Function to fetch tasks with current parameters
  const fetchTasksWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        is_with_respect_branch: 1,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchDashboardTaskList(payload))
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
      fetchTasksWithParams(state)
    }
  })

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasksWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'task_public_id',
      label: '#',
      minWidth: 130,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'task_title',
      label: t('taskTable.title'),
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'start_date',
      label: t('taskTable.startDate'),
      minWidth: 120,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'due_date',
      label: t('taskTable.dueDate'),
      minWidth: 120,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'assigned_users',
      label: t('taskTable.assignedTo'),
      minWidth: 150,
      format: (data: any) => <div className='assigned_user_main'>{renderAssignedUsers(data)}</div>,
      sortable: false
    },
    {
      id: 'tag_ids',
      label: t('taskTable.tags'),
      minWidth: 150,
      format: (data: any) => renderTags(data),
      sortable: false
    },
    {
      id: 'status',
      label: t('taskTable.status'),
      minWidth: 150,
      format: (data: any) => renderStatus(data),
      sortable: true
    },
    {
      id: 'priority',
      label: t('taskTable.priority'),
      minWidth: 150,
      format: (data: any) => renderPriority(data),
      sortable: true
    },
    {
      id: 'task_description',
      label: 'Description',
      minWidth: 150,
      format: (data: any) => renderDescription(data),
      sortable: false
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected tasks:', selected)
  }

  const handleRowClick = (task: any) => {
    console.log('Clicked task:', task)
  }

  const taskData = taskList?.data || []
  const totalCount = taskList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={taskData || []}
        loading={loading}
        actions={[]}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No tasks found'
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

export default memo(TaskList)
