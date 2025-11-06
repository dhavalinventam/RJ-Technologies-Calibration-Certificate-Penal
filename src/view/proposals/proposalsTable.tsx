import React, { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { getAllProposals, deleteProposal } from '@/redux/slices/proposalSlice'
import { renderData, renderDate, renderCurrency, renderStatus } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { orderStatus } from '@/utils/constant'
import { deleteLeadProposal, getLeadProposals } from '@/redux/slices/leadSlice'
import useTableState, { type TableState } from '@/hooks/use-table-state'

interface IProps {
  leadId?: string
}

const ProposalsTable: React.FC<IProps> = ({ leadId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { proposalList, loading } = useAppSelector(({ proposal }) => proposal)
  const { leadProposalList } = useAppSelector(({ lead }) => lead)

  // Function to fetch proposals with current parameters
  const fetchProposalsWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        is_with_respect_branch: 1,
        orderType: 'proposal', // Required parameter for the API
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(leadId && { SourceId: leadId }),
        ...(leadId && { SourceType: 'lead' }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      if (leadId) {
        dispatch(getLeadProposals(payload))
      } else {
        dispatch(getAllProposals(payload))
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
      fetchProposalsWithParams(state)
    }
  })

  // Fetch proposals on component mount
  useEffect(() => {
    fetchProposalsWithParams(getState())
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
      id: 'contact_id',
      label: 'Contact',
      minWidth: 150,
      format: (_, row?: any) => renderData(row?.contact?.contact_name),
      sortable: true
    },
    {
      id: 'order_date',
      label: 'Order Date',
      minWidth: 120,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'valid_until',
      label: 'Valid Until',
      minWidth: 120,
      format: (data: any) => renderDate(data),
      type: 'date',
      sortable: true
    },
    {
      id: 'source_type',
      label: 'Source Type',
      minWidth: 120,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'gross_total_amount',
      label: 'Gross Total Amount',
      minWidth: 140,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'add_less_total_amount',
      label: 'Add/Less Total Amount',
      minWidth: 160,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'discount_amount',
      label: 'Discount Total Value',
      minWidth: 150,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'net_total_amount',
      label: 'Net Total Amount',
      minWidth: 140,
      format: (data: any) => renderCurrency(data),
      sortable: true
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (data: any) => {
        const status = orderStatus?.find((item: any) => item.key === data)
        return renderStatus({
          name: status?.value,
          color: status?.color || '#000000',
          icon: status?.icon || ''
        })
      },
      sortable: true
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: proposal => {
        if (leadId) {
          navigate(`/lead/details/${leadId}/proposals/edit/${proposal?.order_id}`)
        } else {
          navigate(`/sales/proposals/edit/${proposal?.order_id}`)
        }
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async proposal => {
        deleteModal.onOpen(proposal)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(leadId ? deleteLeadProposal(row.order_id) : deleteProposal(row.order_id))
        .unwrap()
        .finally(() => {
          fetchProposalsWithParams(getState())
        })
    } catch (error) {
      console.error('Delete proposal error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const proposalData = leadId ? leadProposalList?.data : proposalList?.data || []
  const totalCount = leadId ? leadProposalList?.total_records : proposalList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={proposalData || []}
        loading={loading}
        actions={actions}
        emptyMessage='No proposals found'
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

export default ProposalsTable
