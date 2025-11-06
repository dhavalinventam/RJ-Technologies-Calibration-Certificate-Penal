import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { useParams } from 'react-router-dom'
import { NormalButton } from '@/components'
import useModal from '@/hooks/use-modal'
import CommonModal from '@/components/modal'
import { createContact, updateContact } from '@/redux/slices/contactSlice'
import { useTranslation } from 'react-i18next'
import ContactTable from '@/view/contact/ContactTable'
import ContactFormOnModule from '../contact/ContactFormOnModule'
import { AddCircle } from '@mui/icons-material'

const ViewCompanyContactTable = () => {
  const { t } = useTranslation()
  const { company } = useAppSelector(({ company }) => company)
  const { id: company_id } = useParams()
  const dispatch = useAppDispatch()
  const contactModal = useModal()

  const submitContact = (data: any) => {
    const payload = {
      contact_id: data?.contact_id,
      first_name: data?.first_name,
      last_name: data?.last_name,
      position: data?.position,
      email: [
        {
          email: data?.email,
          is_primary_email: true,
          email_label: 'personal'
        }
      ],
      phone_number: [
        {
          phone_number: data?.phone_number,
          is_primary_phone: true,
          phone_label: 'mobile'
        }
      ],
      company_name: company?.company_name || '',
      company_id: company?.company_id || ''
    }
    if (data?.contact_id) {
      dispatch(
        updateContact({
          id: data?.contact_id,
          payload: payload
        })
      )
        .unwrap()
        .then(() => contactModal.onClose())
    } else {
      dispatch(createContact(payload))
        .unwrap()
        .then(() => contactModal.onClose())
    }
  }

  return (
    <>
      <div className='d-flex align-items-center justify-content-between my-4 gap-2'>
        <h6 className='title_text mb-0'>{t('breadcrumb.contact')}</h6>
        <NormalButton
          title={t('contactform.addTitle')}
          icon={<AddCircle />}
          iconOnly
          onClick={() => contactModal.onOpen({})}
        />
      </div>

      <ContactTable companyId={company_id} />

      {contactModal.isOpen && (
        <CommonModal
          open={contactModal.isOpen}
          onClose={contactModal.onClose}
          title={t('contactform.addTitle')}
          size='lg'
        >
          <ContactFormOnModule onSave={submitContact} onClose={contactModal.onClose} setDataInform />
        </CommonModal>
      )}
    </>
  )
}

export default React.memo(ViewCompanyContactTable)
