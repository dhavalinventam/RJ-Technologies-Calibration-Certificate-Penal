import { useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { Edit, Delete, Visibility } from '@mui/icons-material'
import ReusableTable, { type Column, type TableAction } from '@/components/common-table'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchContacts, deleteContact } from '@/redux/slices/contactSlice'
import { renderName, renderEmail, renderPhone, renderLocation, renderDescription } from '@/utils/dataGridCommonFunc'
import { useNavigate } from 'react-router-dom'
import useModal from '@/hooks/use-modal'
import DeleteModal from '@/components/modal/delete_modal'
import useTableState, { type TableState } from '@/hooks/use-table-state'

interface IProps {
  companyId?: string
}

const ContactTable: React.FC<IProps> = ({ companyId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const deleteModal = useModal()
  const { contactList, loading } = useAppSelector(({ contact }) => contact)

  // Function to fetch contacts with current parameters
  const fetchContactsWithParams = useCallback(
    (state: TableState) => {
      const payload = {
        page: state.currentPage,
        limit: state.rowsPerPage,
        ...(companyId && { company_id: companyId }),
        ...(state.sortBy && { sortBy: state.sortBy }),
        ...(state.sortOrder && state.sortBy && { sortOrder: state.sortOrder }),
        ...(state.searchTerm && { search: state.searchTerm })
      }
      dispatch(fetchContacts(payload))
    },
    [dispatch, companyId]
  )

  // Use the table state hook
  const {
    handleSortChange,
    handlePageChange,
    handleSearchDebounced: handleSearchChange,
    getState
  } = useTableState({
    onStateChange: state => {
      fetchContactsWithParams(state)
    }
  })

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContactsWithParams(getState())
  }, [companyId])

  const columns: Column<any>[] = [
    {
      id: 'first_name',
      label: 'Name',
      minWidth: 200,
      format: (_, row: any) => renderName(row?.contact?.first_name, row?.contact?.last_name),
      sortable: true
    },
    {
      id: 'phones',
      label: 'Phone',
      minWidth: 150,
      format: (data: any) => renderPhone(data?.[0]?.phone_number),
      sortable: false
    },
    {
      id: 'emails',
      label: 'Email',
      minWidth: 200,
      format: (data: any) => renderEmail(data?.[0]?.email),
      sortable: false
    },
    {
      id: 'addresses',
      label: 'Location',
      minWidth: 200,
      format: (data: any) => renderLocation(data?.[0]),
      sortable: false
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      format: (_, row: any) => renderDescription(row?.contact?.description),
      sortable: false
    }
  ]

  const actions: TableAction<any>[] = [
    {
      label: 'View',
      icon: <Visibility fontSize='small' />,
      onClick: contact => {
        console.log('Clicked contact:', contact)
        navigate(`/contacts/details/${contact?.contact?.contact_id}`)
      },
      color: 'primary'
    },
    {
      label: 'Edit',
      icon: <Edit fontSize='small' />,
      onClick: contact => {
        navigate(`/contacts/edit/${contact?.contact?.contact_id}`)
      },
      color: 'primary'
    },
    {
      label: 'Delete',
      icon: <Delete fontSize='small' />,
      onClick: async contact => {
        deleteModal.onOpen(contact)
      },
      color: 'error'
    }
  ]

  const handleSelectionChange = (selected: any[]) => {
    console.log('Selected contacts:', selected)
  }

  const handleRowClick = (contact: any) => {
    console.log('Clicked contact:', contact)
  }

  const handleDelete = async () => {
    const row = deleteModal.selectedRow
    try {
      await dispatch(deleteContact(row.contact?.contact_id)).unwrap()
      fetchContactsWithParams(getState())
    } catch (error) {
      console.error('Delete contact error:', error)
    } finally {
      deleteModal.onClose()
    }
  }

  const contactData = contactList?.data || []
  const totalCount = contactList?.total_records || 0

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={contactData}
        loading={loading}
        actions={actions}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        emptyMessage='No contacts found'
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

export default ContactTable
