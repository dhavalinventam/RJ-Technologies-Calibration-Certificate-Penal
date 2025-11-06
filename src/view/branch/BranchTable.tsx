import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { renderAddress, renderData } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { deleteOrganizationBranch, fetchOrganizationBranches } from '@/redux/slices/organizationBranchSlice'
import { useTranslation } from 'react-i18next'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const BranchTable: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { allbranchesList, loading } = useAppSelector(({ organizationBranch }) => organizationBranch)

  // Function to fetch branches with current parameters
  const fetchBranchesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchOrganizationBranches(payload))
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
      fetchBranchesWithParams(state)
    }
  })

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranchesWithParams(getState())
  }, [dispatch])

  const columns: Column<any>[] = [
    {
      id: 'branch_name',
      label: t('branchTable.branch'),
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'currency_code',
      label: t('branchTable.currency'),
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'address_details',
      label: t('branchTable.address'),
      minWidth: 120,
      format: (data: any) => renderAddress(data),
      sortable: true
    },
    {
      id: 'phone_number',
      label: t('branchTable.phone'),
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: false
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: branch => {
        navigate(`/organization/branch/edit/${branch?.branch_id}`)
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async branch => {
        deleteModal.onOpen(branch)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = useCallback((selected: any) => {
    console.log('Selected branches:', selected)
  }, [])

  const handleRowClick = useCallback(
    (branch: any) => {
      navigate(`/organization/branch/edit/${branch.branch_id}`)
    },
    [navigate]
  )

  const handleDelete = useCallback(async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteOrganizationBranch(row?.branch_id))
        .unwrap()
        .then(() => {
          fetchBranchesWithParams(getState())
        })
    } finally {
      deleteModal.onClose()
    }
  }, [dispatch, deleteModal.selectedRow, deleteModal.onClose, fetchBranchesWithParams, getState])

  const branchData = allbranchesList?.data || []
  const totalCount = allbranchesList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={branchData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No Branch found'
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

export default BranchTable
