import React, { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchTasks, deleteTask } from '@/redux/slices/taskSlice'
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
import { deleteLeadTask, getLeadTasks } from '@/redux/slices/leadSlice'
import { useTranslation } from 'react-i18next'
import useTableState, { type TableState } from '@/hooks/use-table-state'

// Task interface based on your API structure
interface Task {
  task_id: string
  task_public_id: string
  task_title: string
  task_description?: string
  priority?: string
  category?: string
  status_name?: string
  status?: any
  assigned_users?: Array<{
    user_id: string
    first_name: string
    last_name: string
    email: string
  }>
  start_date?: number
  due_date?: number
  reminder_date?: number
  is_completed?: boolean
  source_id?: string
  source_type?: string
  department?: string
  created_at?: number
  updated_at?: number
  tag_ids?: string[]
}

interface IProps {
  leadId?: string
  setIsOpen?: (isOpen: boolean) => void
  setTask?: (task: Task) => void
}

const TaskTable: React.FC<IProps> = ({ leadId, setIsOpen, setTask }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { taskList, loading: taskLoading } = useAppSelector(({ task }) => task)
  const { leadTaskList, loading: leadTaskLoading } = useAppSelector(({ lead }) => lead)

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
      if (leadId) {
        dispatch(getLeadTasks({ id: leadId, payload }))
      } else {
        dispatch(fetchTasks(payload))
      }
    },
    [dispatch, leadId]
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
  }, [leadId])

  // Define table columns for tasks
  const columns: Column<Task>[] = [
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

  // Define table actions for tasks
  const actions: TableAction<Task>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: task => {
        if (leadId) {
          setIsOpen?.(true)
          setTask?.(task)
        } else {
          navigate(`/tasks/edit/${task?.task_id}`)
        }
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async task => {
        deleteModal.onOpen(task)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = (selected: Task[]) => {
    console.log('Selected tasks:', selected)
  }

  const handleRowClick = (task: Task) => {
    console.log('Clicked task:', task)
    // You can implement row click behavior here
  }

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    const payload = {
      SourceId: row?.source_id || undefined,
      SourceType: row?.source_type || undefined
    }
    try {
      if (leadId) {
        await dispatch(deleteLeadTask({ id: leadId, task_id: row.task_id })).unwrap()
      } else {
        await dispatch(deleteTask({ id: row.task_id, payload })).unwrap()
      }
      fetchTasksWithParams(getState())
    } catch (error) {
      console.error('Delete task error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  // Get the task data array and total count
  const taskData = leadId ? leadTaskList?.data : taskList?.data || []
  const totalCount = leadId ? leadTaskList?.total_records : taskList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={taskData || []}
        loading={leadId ? leadTaskLoading : taskLoading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No tasks found'
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
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

export default TaskTable
