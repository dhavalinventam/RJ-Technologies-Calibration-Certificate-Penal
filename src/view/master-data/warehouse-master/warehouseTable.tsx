import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete, LocationOn } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getWarehouseList, deleteWarehouse, getWarehouseById } from '@/redux/slices/warehouseSlice'
import { renderData } from '@/utils/dataGridCommonFunc'
import { useTranslation } from 'react-i18next'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const WarehouseTable = React.forwardRef<any, { addEditModal: any }>(({ addEditModal }, ref) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { warehouseList, loading } = useAppSelector(({ warehouse }) => warehouse)

  // Function to fetch warehouses with current parameters
  const fetchWarehousesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getWarehouseList(payload))
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
      fetchWarehousesWithParams(state)
    }
  })

  const refreshTable = useCallback(() => {
    fetchWarehousesWithParams(getState())
  }, [fetchWarehousesWithParams, getState])

  useImperativeHandle(
    ref,
    () => ({
      refresh: refreshTable
    }),
    [refreshTable]
  )

  // Fetch warehouses on component mount
  useEffect(() => {
    fetchWarehousesWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'code',
      label: t('warehouseMaster.columns.code'),
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'name',
      label: t('warehouseMaster.columns.name'),
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'parent_warehouse_name',
      label: t('warehouseMaster.columns.parentWarehouse'),
      minWidth: 180,
      format: (data: any) => renderData(data || '--'),
      sortable: true
    },
    {
      id: 'city',
      label: t('warehouseMaster.columns.location'),
      minWidth: 200,
      format: (_, row: any) => {
        const location = `${row.city}, ${row.state}`
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            {renderData(location)}
          </Box>
        )
      },
      sortable: false
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: warehouse => {
        addEditModal.onOpen(warehouse)
        dispatch(getWarehouseById(warehouse.warehouse_id))
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async warehouse => {
        deleteModal.onOpen(warehouse)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteWarehouse(row.warehouse_id))
        .unwrap()
        .then(() => {
          fetchWarehousesWithParams(getState())
        })
    } catch (error) {
      console.error('Delete Warehouse error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const warehouseData = warehouseList?.data || []
  const totalCount = warehouseList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={warehouseData}
        loading={loading}
        actions={actions}
        emptyMessage='No warehouses found'
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

export default WarehouseTable
