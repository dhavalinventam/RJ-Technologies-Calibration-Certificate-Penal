import { useEffect } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchStatusListByModule } from '@/redux/slices/templateSlice'
import { deleteStatus } from '@/redux/slices/statusSlice'
import { renderData, renderColor } from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import StatusForm from '@/view/modal/status-modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

interface StatusTableProps {
  module: string
}

const StatusTable: React.FC<StatusTableProps> = ({ module }) => {
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const editModal = useModal()
  const { statusList, loading } = useAppSelector(({ template }) => template)

  // Function to fetch status list with current parameters
  const fetchStatusListWithParams = (state: TableState) => {
    const payload = {
      module,
      page: state.currentPage,
      limit: state.rowsPerPage,
      ...(state.sortBy && { sortBy: state.sortBy }),
      ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
      ...(state.searchTerm && { search: state.searchTerm })
    }
    dispatch(fetchStatusListByModule(payload))
  }

  // Use the table state hook
  const {
    handleSortChange,
    handlePageChange,
    handleSearchDebounced: handleSearchChange,
    getState
  } = useTableState({
    onStateChange: state => {
      fetchStatusListWithParams(state)
    }
  })

  // Fetch status list on component mount
  useEffect(() => {
    fetchStatusListWithParams(getState())
  }, [dispatch, module])

  const handleReloadTable = () => {
    fetchStatusListWithParams(getState())
  }

  // Define table columns for status - only showing specific columns as requested
  const columns: Column[] = [
    {
      id: 'name',
      label: 'Status Name',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'sequence',
      label: 'Order',
      minWidth: 100,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'color',
      label: 'Color',
      minWidth: 50,
      format: (data: any) => renderColor(data),
      sortable: false
    }
  ]

  // Define table actions for status
  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: status => editModal.onOpen(status),
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async status => {
        deleteModal.onOpen(status)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected statuses:', selected)
  }

  const handleRowClick = (status: any) => {
    console.log('Clicked status:', status)
  }

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    const payload = {
      module,
      organizationId: row?.organization_id
    }
    try {
      await dispatch(deleteStatus({ id: row.status_id, payload })).unwrap()
      fetchStatusListWithParams(getState())
    } catch (error) {
      console.error('Delete status error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  // Get the status data array and total count
  const statusData = statusList?.data || []
  const totalCount = statusList?.total_records || 0

  return (
    <Box sx={{ py: 1 }}>
      <ReusableTable
        columns={columns}
        data={statusData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No statuses found'
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
          onDelete={() => handleDelete()}
          onCancel={() => deleteModal.onClose()}
        />
      )}
      {editModal.isOpen && (
        <StatusForm
          isOpen={editModal.isOpen}
          onCancel={editModal.onClose}
          editData={editModal.selectedRow}
          module={module}
          reloadTable={handleReloadTable}
        />
      )}
    </Box>
  )
}

export default StatusTable
