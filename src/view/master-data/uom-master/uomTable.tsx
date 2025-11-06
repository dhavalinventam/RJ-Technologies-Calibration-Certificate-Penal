import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getUomListWithProductVariant, deleteUom, getUomById } from '@/redux/slices/uomSlice'
import { renderBaseUnit, renderData } from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const UomTable = React.forwardRef<any, { addEditModal: any }>(({ addEditModal }, ref) => {
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { uomList, loading } = useAppSelector(({ uom }) => uom)

  // Function to fetch UOMs with current parameters
  const fetchUomsWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getUomListWithProductVariant(payload))
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
      fetchUomsWithParams(state)
    }
  })

  const refreshTable = useCallback(() => {
    fetchUomsWithParams(getState())
  }, [fetchUomsWithParams, getState])

  useImperativeHandle(
    ref,
    () => ({
      refresh: refreshTable
    }),
    [refreshTable]
  )

  // Fetch UOMs on component mount
  useEffect(() => {
    fetchUomsWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'abbreviation',
      label: 'Abbreviation',
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'uom_family',
      label: 'Family',
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'is_base',
      label: 'Base Unit',
      minWidth: 100,
      format: (data: any) => renderBaseUnit(data),
      sortable: true
    },
    {
      id: 'standard_unit_name',
      label: 'Standard UOM',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'conversion_factor',
      label: 'Conversion',
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: uom => {
        addEditModal.onOpen(uom)
        dispatch(getUomById(uom.uom_id))
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async uom => {
        deleteModal.onOpen(uom)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteUom(row.uom_id))
        .unwrap()
        .then(() => {
          fetchUomsWithParams(getState())
        })
    } catch (error) {
      console.error('Delete UOM error:', error)
    } finally {
      deleteModal.onClose()
    }
  }
  const uomData = uomList?.data || []
  const totalCount = uomList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={uomData}
        loading={loading}
        actions={actions}
        emptyMessage='No UOMs found'
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

export default UomTable
