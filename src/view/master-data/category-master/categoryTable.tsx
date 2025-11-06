import React, { useCallback, useEffect, useImperativeHandle } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { deleteCategory, getAllCategories, getCategoryById } from '@/redux/slices/categorySlice'
import { renderData, renderDescription } from '@/utils/dataGridCommonFunc'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

const CategoryTable = React.forwardRef<any, any>(({ addEditModal }, ref) => {
  const dispatch = useAppDispatch()
  const deleteModal = useModal()
  const { CategoryList, loading } = useAppSelector(({ category }) => category)

  // Function to fetch categories with current parameters
  const fetchCategoriesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(getAllCategories(payload))
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
      fetchCategoriesWithParams(state)
    }
  })

  const refreshTable = useCallback(() => {
    fetchCategoriesWithParams(getState())
  }, [fetchCategoriesWithParams, getState])

  useImperativeHandle(
    ref,
    () => ({
      refresh: refreshTable
    }),
    [refreshTable]
  )

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategoriesWithParams(getState())
  }, [])

  const columns: Column[] = [
    {
      id: 'category_name',
      label: 'Category Name',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'parent_category_name',
      label: 'Parent Category',
      minWidth: 200,
      format: (_, row: any) => {
        const parentName = row?.parent_category?.parent_category_name
        return renderData(parentName || '--')
      },
      sortable: true
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 300,
      format: (data: any) => renderDescription(data),
      sortable: false
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: category => {
        addEditModal.onOpen(category)
        dispatch(getCategoryById(category.category_id))
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async category => {
        deleteModal.onOpen(category)
      },
      color: 'error'
    }
  ]

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteCategory({ id: row.category_id }))
        .unwrap()
        .then(() => {
          fetchCategoriesWithParams(getState())
        })
    } catch (error) {
      console.error('Delete category error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const categoryData = CategoryList?.data || []
  const totalCount = CategoryList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={categoryData}
        loading={loading}
        actions={actions}
        emptyMessage='No categories found'
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

export default CategoryTable
