import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import { Box, Chip } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getDiscountList, deleteDiscount, getDiscountById } from '@/redux/slices/discountSlice'
import {
  renderBaseUnit,
  renderData,
  renderDate,
  renderDescription,
  renderStatusMaster
} from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { useTranslation } from 'react-i18next'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const DiscountTable = React.forwardRef<any, { addEditModal: any }>(({ addEditModal }, ref) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { discountList, loading } = useAppSelector(({ discount }) => discount)

  // Function to fetch discounts with current parameters
  const fetchDiscountsWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getDiscountList(payload))
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
      fetchDiscountsWithParams(state)
    }
  })

  const refreshTable = useCallback(() => {
    fetchDiscountsWithParams(getState())
  }, [fetchDiscountsWithParams, getState])

  useImperativeHandle(
    ref,
    () => ({
      refresh: refreshTable
    }),
    [refreshTable]
  )

  // Fetch discounts on component mount
  useEffect(() => {
    fetchDiscountsWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'offer_name',
      label: t('discountTable.offerName'),
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'offer_code',
      label: t('discountTable.offerCode'),
      minWidth: 120,
      format: (data: any) => <Chip label={data} color='primary' size='small' variant='outlined' />,
      sortable: true
    },
    {
      id: 'discount_type',
      label: t('discountTable.discountType'),
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'discount_value',
      label: t('discountTable.discountValue'),
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'currency_code',
      label: t('discountTable.currency'),
      minWidth: 100,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'start_date',
      label: t('discountTable.startDate'),
      minWidth: 120,
      format: (data: any) => renderDate(data),
      sortable: true
    },
    {
      id: 'end_date',
      label: t('discountTable.endDate'),
      minWidth: 120,
      format: (data: any) => renderDate(data),
      sortable: true
    },
    {
      id: 'auto_apply',
      label: t('discountTable.autoApply'),
      minWidth: 100,
      format: (data: any) => renderBaseUnit(data),
      sortable: true
    },
    {
      id: 'is_active',
      label: t('discountTable.status'),
      minWidth: 100,
      format: (data: any) => renderStatusMaster(data),
      sortable: true
    },
    {
      id: 'description',
      label: t('discountTable.description'),
      minWidth: 200,
      format: (data: any) => renderDescription(data),
      sortable: false
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: discount => {
        addEditModal.onOpen(discount)
        dispatch(getDiscountById(discount.discount_offer_id))
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async discount => {
        deleteModal.onOpen(discount)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteDiscount(row.discount_offer_id))
        .unwrap()
        .then(() => {
          fetchDiscountsWithParams(getState())
        })
    } catch (error) {
      console.error('Delete Discount error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const discountData = discountList?.data || []
  const totalCount = discountList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={discountData}
        loading={loading}
        actions={actions}
        emptyMessage='No discount offers found'
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

export default DiscountTable
