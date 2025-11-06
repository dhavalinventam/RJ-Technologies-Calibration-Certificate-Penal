import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getProductTypeList, deleteProductType, getProductTypeById } from '@/redux/slices/productTypeSlice'
import { renderData, renderDescription } from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const ProductTypeTable = React.forwardRef<any, { addEditModal: any }>(({ addEditModal }, ref) => {
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { productTypeList, loading } = useAppSelector(({ productType }) => productType)

  // Function to fetch product types with current parameters
  const fetchProductTypesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getProductTypeList(payload))
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
      fetchProductTypesWithParams(state)
    }
  })

  const refreshTable = useCallback(() => {
    fetchProductTypesWithParams(getState())
  }, [fetchProductTypesWithParams, getState])

  useImperativeHandle(
    ref,
    () => ({
      refresh: refreshTable
    }),
    [refreshTable]
  )

  // Fetch product types on component mount
  useEffect(() => {
    fetchProductTypesWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'product_type',
      label: 'Product Type',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'details',
      label: 'Description',
      minWidth: 120,
      format: (data: any) => renderDescription(data),
      sortable: false
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: productType => {
        addEditModal.onOpen(productType)
        dispatch(getProductTypeById(productType.product_type_id))
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async productType => {
        deleteModal.onOpen(productType)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteProductType(row.product_type_id))
        .unwrap()
        .then(() => {
          fetchProductTypesWithParams(getState())
        })
    } catch (error) {
      console.error('Delete product type error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const productTypeData = productTypeList?.data || []
  const totalCount = productTypeList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={productTypeData}
        loading={loading}
        actions={actions}
        emptyMessage='No product types found'
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
})

export default ProductTypeTable
