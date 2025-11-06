import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'

import { renderData, renderDate, renderStatus } from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { deletePrice, getPriceById, getPriceList } from '@/redux/slices/priceSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const PriceTable = React.forwardRef<any, { addEditModal: any }>(({ addEditModal }, ref) => {
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { priceTypeList, loading } = useAppSelector(({ price }) => price)

  // Function to fetch prices with current parameters
  const fetchPricesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getPriceList(payload))
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
      fetchPricesWithParams(state)
    }
  })

  const refreshTable = useCallback(() => {
    fetchPricesWithParams(getState())
  }, [fetchPricesWithParams, getState])

  useImperativeHandle(
    ref,
    () => ({
      refresh: refreshTable
    }),
    [refreshTable]
  )

  // Fetch prices on component mount
  useEffect(() => {
    fetchPricesWithParams(getState())
  }, [])

  const columns: Column<any>[] = [
    {
      id: 'variant',
      label: 'Product/Service',
      minWidth: 200,
      format: (data: any) => renderData(`${data?.variant_name} (${data?.variant_sku})`),
      sortable: true
    },
    {
      id: 'price_type',
      label: 'Type',
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'rate',
      label: 'Rate',
      minWidth: 100,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'currency',
      label: 'Currency',
      minWidth: 100,
      format: (data: any) => renderData(data?.currency_code),
      sortable: true
    },
    {
      id: 'effective_from',
      label: 'Effective From',
      minWidth: 150,
      format: (data: any) => renderDate(data),
      sortable: true
    },
    {
      id: 'effective_to',
      label: 'Effective To',
      minWidth: 150,
      format: (data: any) => (data ? renderDate(data) : '--'),
      sortable: true
    },
    {
      id: 'is_active',
      label: 'Status',
      minWidth: 100,
      format: (data: any) => renderStatus({ name: data ? 'Active' : 'Inactive', color: data ? '#4caf50' : '#f44336' }),
      sortable: true
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: price => {
        addEditModal.onOpen(price)
        dispatch(getPriceById(price.price_id))
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async price => {
        deleteModal.onOpen(price)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deletePrice(row.price_id))
        .unwrap()
        .then(() => {
          fetchPricesWithParams(getState())
        })
    } catch (error) {
      console.error('Delete Price error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const priceData = priceTypeList?.data || []
  const totalCount = priceTypeList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={priceData}
        loading={loading}
        actions={actions}
        emptyMessage='No prices found'
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
export default PriceTable
