import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { renderDescription, renderEmail, renderLocation, renderName, renderPhone } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { deleteCustomer, fetchAllCustomer } from '@/redux/slices/customerSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const CustomerTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { customerList, loading } = useAppSelector(({ customer }) => customer)
  const { organization } = useAppSelector(({ organization }) => organization)

  // Function to fetch customers with current parameters
  const fetchCustomersWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchAllCustomer(payload))
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
      fetchCustomersWithParams(state)
    }
  })

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomersWithParams(getState())
  }, [organization?.organization_id])

  const columns: Column[] = [
    {
      id: 'first_name',
      label: 'Customer Name',
      minWidth: 150,
      format: (_, row: any) => renderName(row?.contact?.first_name, row?.contact?.last_name),
      sortable: true
    },
    {
      id: 'phones',
      label: 'Phone Number',
      minWidth: 120,
      format: (data: any) => renderPhone(data?.[0]?.phone_number),
      sortable: false
    },
    {
      id: 'emails',
      label: 'Email',
      minWidth: 150,
      format: (data: any) => renderEmail(data?.[0]?.email),
      sortable: false
    },
    {
      id: 'addresses',
      label: 'Location',
      minWidth: 100,
      format: (data: any) => renderLocation(data?.[0]),
      sortable: false
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 120,
      format: (data: any) => renderDescription(data),
      sortable: false
    }
  ]

  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: customer => {
        navigate(`/customers/edit/${customer?.account_master_id}`)
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async customer => {
        deleteModal.onOpen(customer)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = useCallback((selected: any) => {
    console.log('Selected customers:', selected)
  }, [])

  const handleRowClick = useCallback(
    (customer: any) => {
      navigate(`/customers/edit/${customer?.account_master_id}`)
    },
    [navigate]
  )

  const handleDelete = useCallback(async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteCustomer(row?.account_master_id)).unwrap()
      fetchCustomersWithParams(getState())
    } catch (error) {
      console.error('Delete customer error:', error)
    } finally {
      deleteModal.onClose()
    }
  }, [dispatch, deleteModal.selectedRow, deleteModal.onClose, fetchCustomersWithParams, getState])

  const customerData = customerList?.data || []
  const totalCount = customerList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={customerData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No Customer found'
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

export default CustomerTable
