import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Delete, Visibility } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchCompany, deleteCompany } from '@/redux/slices/companySlice'
import { renderWebsite, renderLocation, renderData } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

interface IProps {
  organizationId?: string
}

const CompanyTable: React.FC<IProps> = ({ organizationId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { companyList, loading } = useAppSelector(({ company }) => company)

  // Function to fetch companies with current parameters
  const fetchCompaniesWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(organizationId && { organization_id: organizationId }),
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchCompany(payload))
    },
    [dispatch, organizationId]
  )

  // Use the table state hook
  const {
    handleSortChange,
    handlePageChange,
    handleSearchDebounced: handleSearchChange,
    getState
  } = useTableState({
    onStateChange: state => {
      fetchCompaniesWithParams(state)
    }
  })

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompaniesWithParams(getState())
  }, [organizationId])

  const columns: Column<any>[] = [
    {
      id: 'company_name',
      label: 'Company Name',
      minWidth: 200,
      format: (data: any) => renderData(data),
      sortable: true
    },
    {
      id: 'gst_number',
      label: 'GST Number',
      minWidth: 150,
      format: (data: any) => renderData(data),
      sortable: false
    },
    {
      id: 'website',
      label: 'Website',
      minWidth: 200,
      format: (data: any) => renderWebsite(data),
      sortable: false
    },
    {
      id: 'address',
      label: 'Location',
      minWidth: 200,
      format: (data: any) => renderLocation(data),
      sortable: false
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'View',
      icon: <Visibility fontSize='small' />,
      onClick: company => {
        console.log('Clicked company:', company)
        navigate(`/company/details/${company?.company_id}`)
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async company => {
        deleteModal.onOpen(company)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected companies:', selected)
  }

  const handleRowClick = (company: any) => {
    console.log('Clicked company:', company)
  }

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteCompany(row.company_id)).unwrap()
      fetchCompaniesWithParams(getState())
    } catch (error) {
      console.error('Delete company error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const companyData = companyList?.data || []
  const totalCount = companyList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={companyData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No companies found'
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

export default CompanyTable
