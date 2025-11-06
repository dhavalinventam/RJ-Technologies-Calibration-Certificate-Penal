import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { renderEmail, renderPhone, renderData, renderName } from '@/utils/dataGridCommonFunc'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { deleteUser, fetchUser } from '@/redux/slices/userSlice'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const InviteUsersTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const { userList, loading } = useAppSelector(({ user }) => user)
  const { organization } = useAppSelector(({ organization }) => organization)
  const deleteModal = useModal()

  // Function to fetch users with current parameters
  const fetchUsersWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        organization_id: organization?.organization_id,
        branch_id: organization?.branch_id,
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchUser(payload))
    },
    [dispatch, organization?.organization_id, organization?.branch_id]
  )

  // Use the table state hook
  const {
    handleSortChange,
    handlePageChange,
    handleSearchDebounced: handleSearchChange,
    getState
  } = useTableState({
    onStateChange: state => {
      fetchUsersWithParams(state)
    }
  })

  // Fetch users on component mount and when organization changes
  useEffect(() => {
    fetchUsersWithParams(getState())
  }, [organization?.organization_id, organization?.branch_id])

  const columns: Column[] = [
    {
      id: 'first_name',
      label: 'Name',
      minWidth: 200,
      format: (_, data: any) => renderName(data?.invitation?.first_name, data?.invitation?.last_name),
      sortable: true
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
      format: (data: any) => renderEmail(data),
      sortable: false
    },
    {
      id: 'contact_number',
      label: 'Phone Number',
      minWidth: 150,
      format: (data: any) => renderPhone(data),
      sortable: false
    },
    {
      id: 'organization_name',
      label: 'Organization Name',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'branch_name',
      label: 'Branch Name',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'designation',
      label: 'Designation',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    }
  ]

  const actions: TableAction[] = [
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async user => {
        deleteModal.onOpen(user)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = useCallback((selected: any) => {
    console.log('Selected users:', selected)
  }, [])

  const handleRowClick = useCallback((user: any) => {
    console.log(user)
  }, [])

  const handleDelete = useCallback(() => {
    const row = deleteModal.selectedRow
    dispatch(
      deleteUser({
        id: row.user_invitation_id,
        organization_id: organization?.organization_id,
        branch_id: organization?.branch_id
      })
    )
  }, [dispatch, deleteModal.selectedRow, organization?.organization_id, organization?.branch_id])

  const userData = userList?.data || []
  const totalCount = userList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={userData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No Users found'
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

export default InviteUsersTable
