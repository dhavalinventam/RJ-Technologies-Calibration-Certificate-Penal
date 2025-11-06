import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { renderAddress, renderData } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { deleteOrganization, fetchOrganizations } from '@/redux/slices/organizationSlice'
import { fetchOrganizationList } from '@/redux/slices/authSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const OrganizationTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { organizationsList, loading } = useAppSelector(({ organization }) => organization)

  // Function to fetch organizations with current parameters
  const fetchOrganizationsWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchOrganizations(payload))
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
      fetchOrganizationsWithParams(state)
    }
  })

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizationsWithParams(getState())
  }, [])

  // Define table columns for organizations
  const columns: Column<any>[] = [
    {
      id: 'organization_name',
      label: 'Organization',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'industry',
      label: 'Industry',
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'phone_number',
      label: 'Phone',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: false
    },
    {
      id: 'gst_registration_type',
      label: 'GST Type',
      minWidth: 100,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'address_details',
      label: 'Location',
      minWidth: 120,
      format: (data: any) => renderAddress(data),
      sortable: false
    }
  ]

  // Define table actions for organizations
  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: organization => {
        navigate(`/organization/edit/${organization?.organization_id}`)
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async organization => {
        deleteModal.onOpen(organization)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = useCallback((selected: any) => {
    console.log('Selected organizations:', selected)
  }, [])

  const handleRowClick = useCallback(
    (organization: any) => {
      navigate(`/organization/edit/${organization.organization_id}`)
    },
    [navigate]
  )

  const handleDelete = useCallback(async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteOrganization(row?.organization_id))
        .unwrap()
        .then(() => {
          dispatch(fetchOrganizationList({}))
        })
      fetchOrganizationsWithParams(getState())
    } catch (error) {
      console.error('Delete organization error:', error)
    } finally {
      deleteModal.onClose()
    }
  }, [dispatch, deleteModal.selectedRow, deleteModal.onClose, fetchOrganizationsWithParams, getState])

  // Get the organization data array and total count
  const organizationData = organizationsList?.data || []
  const totalCount = organizationsList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={organizationData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No Organization found'
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

export default OrganizationTable
