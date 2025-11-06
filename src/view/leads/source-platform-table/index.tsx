import React, { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { renderData } from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import { useTranslation } from 'react-i18next'
import { AllSourcePlatforms, deleteSourcePlatform } from '@/redux/slices/sourcePlatformSlice'
import SourcePlatformModal from '@/view/modal/source-platform-modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const SourcePlatformTable: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { sourcePlatformList, loading } = useAppSelector(({ sourcePlatform }) => sourcePlatform)

  const sourcePlatformModal = useModal()

  // Function to fetch source platforms with current parameters
  const fetchSourcePlatformWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(AllSourcePlatforms(payload))
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
      fetchSourcePlatformWithParams(state)
    }
  })

  // Fetch source platforms on component mount
  useEffect(() => {
    fetchSourcePlatformWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'name',
      label: t('sourcePlatformTable.name'),
      minWidth: 100,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'icon',
      label: t('sourcePlatformTable.icon'),
      minWidth: 100,
      format: (data: any) => renderData(data),
      sortable: false
    }
  ]

  const actions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: sourcePlatform => {
        sourcePlatformModal.onOpen(sourcePlatform)
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async sourcePlatform => {
        deleteModal.onOpen(sourcePlatform)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = useCallback((selected: any) => {
    console.log('Selected Source Platform:', selected)
  }, [])

  const handleRowClick = useCallback(() => {}, [])

  const handleDelete = useCallback(async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteSourcePlatform(row?.source_platform_id))
        .unwrap()
        .then(() => {
          fetchSourcePlatformWithParams(getState())
        })
    } finally {
      deleteModal.onClose()
    }
  }, [dispatch, deleteModal.selectedRow, deleteModal.onClose, fetchSourcePlatformWithParams, getState])

  const sourcePlatformData = sourcePlatformList?.data || []
  const totalCount = sourcePlatformList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={sourcePlatformData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No Source Platform found'
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        totalCount={totalCount}
        sortBy={getState().sortBy}
        sortOrder={getState().sortOrder}
      />
      {sourcePlatformModal.isOpen && (
        <SourcePlatformModal
          isOpen={sourcePlatformModal.isOpen}
          onCancel={sourcePlatformModal.onClose}
          data={sourcePlatformModal.selectedRow}
        />
      )}
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

export default SourcePlatformTable
