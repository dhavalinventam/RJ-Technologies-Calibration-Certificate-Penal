import React, { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getProductServiceList, deleteProductService } from '@/redux/slices/productSlice'
import { renderData, renderDescription, renderStatus } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const ServiceTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { productList, loading } = useAppSelector(({ product }) => product)

  // Function to fetch services with current parameters
  const fetchServicesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        type: 'service',
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getProductServiceList(payload))
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
      fetchServicesWithParams(state)
    }
  })

  // Fetch services on component mount
  useEffect(() => {
    fetchServicesWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'code',
      label: 'Code',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'product_type',
      label: 'Type',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 120,
      format: (data: any) => renderData(data || '--'),
      sortable: true
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 250,
      format: (data: any) => renderDescription(data),
      sortable: false
    },
    {
      id: 'is_active',
      label: 'Status',
      minWidth: 120,
      format: (data: any) => renderStatus({ name: data ? 'Active' : 'Inactive', color: data ? '#4caf50' : '#f44336' }),
      sortable: true
    }
  ]

  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: service => {
        navigate(`/products-catalog/services/edit/${service?.product_service_id}`)
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async service => {
        deleteModal.onOpen(service)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteProductService(row.product_service_id))
        .unwrap()
        .then(() => {
          fetchServicesWithParams(getState())
        })
    } catch (error) {
      console.error('Delete service error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const serviceData = productList.data || []
  const totalCount = productList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={serviceData}
        loading={loading}
        actions={actions}
        emptyMessage='No services found'
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

export default ServiceTable
