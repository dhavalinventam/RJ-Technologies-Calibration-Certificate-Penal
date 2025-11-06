import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { useTranslation } from 'react-i18next'
import { renderAssignedUsers, renderData, renderDate, renderDescription } from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { deleteLeadReminder, getLeadReminderById, getLeadReminders } from '@/redux/slices/leadSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

interface IProps {
  leadId: string
}

const ReminderTable: React.FC<IProps> = ({ leadId }) => {
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { t } = useTranslation()
  const { leadReminders, loading } = useAppSelector(({ lead }) => lead)

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
      dispatch(getLeadReminders({ id: String(leadId), payload }))
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
      fetchRemindersWithParams(state)
    }
  })

  // Fetch reminders on component mount
  useEffect(() => {
    fetchRemindersWithParams(getState())
  }, [leadId])

  // Define table columns for reminders - matching the image structure
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

  // Define table actions for reminders
  const actions: TableAction<any>[] = [
    {
      label: t('common.edit'),
      icon: <Edit fontSize='small' />,
      onClick: reminder => {
        dispatch(
          getLeadReminderById({
            id: String(leadId),
            reminderId: reminder?.reminder_id
          })
        ).unwrap()
      },
      color: 'primary'
    },
    {
      label: t('common.delete'),
      icon: <Delete fontSize='small' />,
      onClick: async reminder => {
        deleteModal.onOpen(reminder)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected reminders:', selected)
  }
  const handleRowClick = (reminder: any) => {
    console.log('Clicked reminder:', reminder)
  }

  // Handle delete for DeleteModal
  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(
        deleteLeadReminder({
          id: String(leadId),
          reminderId: row?.reminder_id
        })
      )
      fetchRemindersWithParams(getState())
    } catch (error) {
      console.error('Delete reminder error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  // Get the reminder data array and total count
  const reminderData = leadReminders?.data || []
  const totalCount = leadReminders?.total_records || 0

  return (
    <Box sx={{ py: 1 }}>
      <ReusableTable
        columns={columns}
        data={reminderData}
        loading={loading}
        actions={actions}
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

export default ReminderTable
