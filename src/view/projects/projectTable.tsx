import { useEffect } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getAllProjects, deleteProject } from '@/redux/slices/projectManagementSlice'
import { useTranslation } from 'react-i18next'
import {
  renderAssignedUsers,
  renderData,
  renderDate,
  renderDescription,
  renderPriority,
  renderStatus,
  renderTags
} from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const ProjectTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { t } = useTranslation()
  const { projectList, loading } = useAppSelector(({ project }) => project)

  // Function to fetch projects with current parameters
  const fetchProjectsWithParams = (state: TableState) => {
    const payload = {
      page: state.currentPage,
      limit: state.rowsPerPage,
      is_with_respect_branch: 1,
      ...(state.sortBy && { sortBy: state.sortBy }),
      ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
      ...(state.searchTerm && { search: state.searchTerm })
    }
    dispatch(getAllProjects(payload))
  }

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
  }, [dispatch])

  const columns: Column<any>[] = [
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

  // Define table actions for projects
  const actions: TableAction[] = [
    {
      label: t('common.edit'),
      icon: <Edit fontSize='small' />,
      onClick: project => {
        navigate(`/projects/edit/${project.project_id}`)
      },
      color: 'primary'
    },
    {
      label: t('common.delete'),
      icon: <Delete fontSize='small' />,
      onClick: async project => {
        deleteModal.onOpen(project)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected projects:', selected)
  }
  const handleRowClick = (project: any) => {
    console.log('Clicked project:', project)
  }

  // Handle delete for DeleteModal
  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteProject(row.project_id)).unwrap()
      fetchProjectsWithParams(getState())
    } catch (error) {
      console.error('Delete project error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  // Get the project data array and total count
  const projectData = projectList?.data || []
  const totalCount = projectList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={projectData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No projects found'
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        totalCount={totalCount}
        onSearchChange={handleSearchChange}
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

export default ProjectTable
