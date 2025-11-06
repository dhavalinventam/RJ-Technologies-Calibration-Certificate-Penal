import { Icon } from '@iconify/react'
import { Col, Row } from 'react-bootstrap'
import { Avatar, Box } from '@mui/material'
import { addContactToLead, deleteContactFromLead, getLeadById } from '@/redux/slices/leadSlice'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import DeleteModal from '@/components/modal/delete_modal'
import ContactFormOnModule from '@/view/contact/ContactFormOnModule'
import { NormalButton } from '@/components'
import { Add, Delete } from '@mui/icons-material'

const ContactListTab = () => {
  const dispatch = useAppDispatch()
  const { leadId } = useParams()
  const { lead } = useAppSelector(({ lead }) => lead)
  const [isView, setIsView] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<any>(null)

  const handleRemoveContact = (contact: any) => {
    setContactToDelete(contact)
    setIsDeleteModalOpen(true)
  }

  const submitContact = (data: any) => {
    const payload = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      position: data?.position,
      email: data?.email,
      phone_number: data?.phone_number
    }
    dispatch(addContactToLead({ id: lead?.lead_id, payload }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          reloadLeadData()
          setIsView(false)
        }
      })
  }

  const reloadLeadData = () => {
    if (leadId) {
      dispatch(getLeadById(leadId))
    }
  }

  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      try {
        await dispatch(
          deleteContactFromLead({
            id: leadId || '',
            contact_id: contactToDelete?.contact_id || '',
            leadContactCompanyId: contactToDelete?.lead_contact_company_id || ''
          })
        ).unwrap()
        setIsDeleteModalOpen(false)
        setContactToDelete(null)
        reloadLeadData()
      } catch (error) {
        console.error('Error deleting contact:', error)
      }
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setContactToDelete(null)
  }

  return (
    <>
      <Box>
        <Box className='tab-content-header'>
          {!isView && <NormalButton icon={<Add />} onClick={() => setIsView(true)} title={'Add Contact'} />}
        </Box>
        {isView ? (
          <ContactFormOnModule reloadTable={reloadLeadData} onSave={submitContact} onClose={() => setIsView(false)} />
        ) : (
          <></>
        )}
        {lead?.contacts?.length > 0 ? (
          <Row className='mt-3 profile-row'>
            {lead?.contacts?.map((contact: any) => (
              <Col className='profile-card' md={6} key={contact.contact_id}>
                <ContactDetail
                  contact={{
                    first_name: contact?.first_name,
                    last_name: contact?.last_name,
                    phone: contact?.phone?.phone_number,
                    email: contact?.email?.email,
                    contact_id: contact?.contact_id,
                    lead_contact_company_id: contact?.lead_contact_company_id,
                    is_primary_in_lead: contact?.is_primary_in_lead
                  }}
                  onDelete={handleRemoveContact}
                  showDeleteButton
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No contacts found.</p>
        )}
      </Box>
      <DeleteModal show={isDeleteModalOpen} onDelete={handleConfirmDelete} onHide={handleCancelDelete} />
    </>
  )
}

export default ContactListTab

export const ContactDetail = ({
  contact,
  onDelete,
  showDeleteButton = false
}: {
  contact: {
    first_name: string
    last_name: string
    phone: string
    email: string
    contact_id?: string
    lead_contact_company_id?: string
    is_primary_in_lead?: boolean
  }
  onDelete?: (contact: any) => void
  showDeleteButton?: boolean
}) => {
  return (
    <Box className='lead-detail-header-new p-3 mb-3'>
      <Box className='d-flex gap-3 card-main align-items-center flex-sm-nowrap flex-wrap'>
        <Box className='contact-info-header'>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {`${(contact.first_name?.[0] || '').toUpperCase()}${(contact.last_name?.[0] || '').toUpperCase()}` || ''}
          </Avatar>
        </Box>
        <Box className='d-flex gap-3 align-items-center flex-grow-1 justify-content-between'>
          <Box>
            <p className='name'>
              {contact?.first_name} {contact?.last_name}
            </p>

            <Box className='contact-info'>
              {contact?.phone && (
                <span>
                  <Icon icon='mdi:phone' width={16} /> {contact.phone}
                </span>
              )}
              {contact?.email && (
                <span>
                  <Icon icon='mdi:email' width={16} /> {contact.email}
                </span>
              )}
            </Box>
          </Box>
          {showDeleteButton && !contact?.is_primary_in_lead && (
            <NormalButton
              icon={<Delete />}
              iconOnly
              onClick={() => onDelete && onDelete(contact)}
              variant='outlined'
              color='error'
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
