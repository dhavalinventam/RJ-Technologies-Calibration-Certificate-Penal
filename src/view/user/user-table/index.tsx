import React, { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Visibility } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { renderEmail, renderPhone, renderData, renderName } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchAllUser } from '@/redux/slices/userSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const UsersTable: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector(({ user }) => user)

  // Function to fetch users with current parameters
  const fetchUsersWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        is_with_respect_branch: 0,
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchAllUser(payload))
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
      fetchUsersWithParams(state)
    }
  })

  // Fetch users on component mount
  useEffect(() => {
    fetchUsersWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'first_name',
      label: 'Name',
      minWidth: 200,
      format: (_, row: any) => renderName(row?.first_name, row?.last_name),
      sortable: true
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
      format: (data: any) => renderEmail(data),
      sortable: true
    },
    {
      id: 'contact_no',
      label: 'Phone Number',
      minWidth: 150,
      format: (data: any) => renderPhone(data),
      sortable: true
    },
    {
      id: 'organization_name',
      label: 'Organization Name',
      minWidth: 200,
      format: (_, data: any) => renderData(data?.[0]?.organization_name),
      sortable: true
    },
    {
      id: 'organizations',
      label: 'Branch Name',
      minWidth: 200,
      format: (data: any) => renderData(data?.[0]?.branches?.[0]?.branch_name),
      sortable: true
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'View',
      icon: <Visibility fontSize='small' />,
      onClick: user => {
        navigate(`/organization/user-profile/${user.user_id}`)
      },
      color: 'info'
    }
  ]

  const handleSelectionChange = useCallback((selected: any) => {
    console.log('Selected users:', selected)
  }, [])

  const handleRowClick = useCallback((user: any) => {
    console.log(user)
  }, [])

  const userData = users?.data || []
  const totalCount = users?.total_records || 0

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
    </Box>
  )
}

export default UsersTable
