import React, { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getAllEstimates, deleteEstimate } from '@/redux/slices/estimateSlice'
import { renderData, renderDate, renderCurrency, renderStatus } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { orderStatus } from '@/utils/constant'
import { deleteLeadEstimate, getLeadEstimates } from '@/redux/slices/leadSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

interface IProps {
  leadId?: string
}

const EstimatesTable: React.FC<IProps> = ({ leadId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { estimateList, loading: estimateLoading } = useAppSelector(({ estimate }) => estimate)
  const { leadEstimateList, loading: leadEstimateLoading } = useAppSelector(({ lead }) => lead)

  // Function to fetch estimates with current parameters
  const fetchEstimatesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        is_with_respect_branch: 1,
        orderType: 'estimate', // Required parameter for the API
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(leadId && { SourceId: leadId }),
        ...(leadId && { SourceType: 'lead' }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      if (leadId) {
        dispatch(getLeadEstimates(payload))
      } else {
        dispatch(getAllEstimates(payload))
      }
    },
    [dispatch, leadId]
  )

  // Use the table state hook
  const {
    handleSortChange,
    handlePageChange,
    handleSearchDebounced: handleSearchChange,
    getState
  } = useTableState({
    onStateChange: state => {
      fetchEstimatesWithParams(state)
    }
  })

  // Fetch estimates on component mount
  useEffect(() => {
    fetchEstimatesWithParams(getState())
  }, [leadId])

  const columns: Column[] = [
    {
      id: 'order_number',
      label: '#',
      minWidth: 80,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'contact_name',
      label: 'Contact',
      minWidth: 150,
      format: (_, row: any) => renderData(row?.contact?.contact_name),
      sortable: true
    },
    {
      id: 'order_date',
      label: 'Order Date',
      minWidth: 150,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'valid_until',
      label: 'Valid Until',
      minWidth: 150,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'source_type',
      label: 'Source Type',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'gross_total_amount',
      label: 'Gross Total Amount',
      minWidth: 215,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'add_less_total_amount',
      label: 'Add/Less Total Amount',
      minWidth: 215,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'discount_amount',
      label: 'Discount Total Value',
      minWidth: 200,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'net_total_amount',
      label: 'Net Total Amount',
      minWidth: 180,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      format: (data: any) => {
        const status = orderStatus?.find((item: any) => item.key === data)
        return renderStatus({
          name: status?.value,
          color: status?.color || '#000000',
          icon: status?.icon || ''
        })
      },
      sortable: false
    }
  ]

  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: estimate => {
        if (leadId) {
          navigate(`/lead/details/${leadId}/estimates/edit/${estimate?.order_id}`)
        } else {
          navigate(`/estimates-proposals/edit/${estimate?.order_id}`)
        }
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async estimate => {
        deleteModal.onOpen(estimate)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      if (leadId) {
        await dispatch(deleteLeadEstimate({ id: leadId, estimate_id: row.order_id })).unwrap()
      } else {
        await dispatch(deleteEstimate(row.order_id)).unwrap()
      }
      fetchEstimatesWithParams(getState())
    } catch (error) {
      console.error('Delete estimate error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const estimateData = leadId ? leadEstimateList?.data : estimateList?.data || []
  const totalCount = leadId ? leadEstimateList?.total_records : estimateList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={estimateData || []}
        loading={leadId ? leadEstimateLoading : estimateLoading}
        actions={actions}
        onSelectionChange={() => {}}
        onRowClick={() => {}}
        emptyMessage='No estimates found'
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

export default EstimatesTable
