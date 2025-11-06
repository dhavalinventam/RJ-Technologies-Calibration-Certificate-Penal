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
import ReusableTable, { type Column } from '@/components/common-table'
import { Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchDashboardProjectList } from '@/redux/slices/dashboardSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const ProjectList: React.FC = () => {
  const { projectList, loading } = useAppSelector(({ dashboard }) => dashboard)
  const dispatch = useAppDispatch()

  // Function to fetch projects with current parameters
  const fetchProjectsWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        is_with_respect_branch: 1,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchDashboardProjectList(payload))
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
      fetchProjectsWithParams(state)
    }
  })

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjectsWithParams(getState())
  }, [])

  const columns: Column[] = [
    { id: 'sr_number', label: '#', minWidth: 150, format: (data: any) => renderData(data), sortable: true },
    { id: 'name', label: 'Project Name', minWidth: 150, format: (data: any) => renderData(data), sortable: true },
    {
      id: 'start_date',
      label: 'Start Date',
      minWidth: 150,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'end_date',
      label: 'Deadline',
      minWidth: 150,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'assigned_to',
      label: 'Members',
      minWidth: 150,
      format: (data: any) => <div className='assigned_user_main'>{renderAssignedUsers(data)}</div>,
      sortable: false
    },
    { id: 'tags', label: 'Tags', minWidth: 150, format: (data: any) => renderTags(data), sortable: false },
    {
      id: 'status',
      label: 'Status',
      minWidth: 180,
      format: (data: any) => renderStatus(data),
      sortable: true
    },
    { id: 'priority', label: 'Priority', minWidth: 120, format: (data: any) => renderPriority(data), sortable: true },
    {
      id: 'description',
      label: 'Description',
      minWidth: 150,
      format: (data: any) => renderDescription(data),
      sortable: false
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected projects:', selected)
  }

  const handleRowClick = (project: any) => {
    console.log('Clicked project:', project)
  }

  const projectData = projectList?.data || []
  const totalCount = projectList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={projectData || []}
        loading={loading}
        actions={[]}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No projects found'
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

export default memo(ProjectList)
