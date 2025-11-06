import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchContacts } from '@/redux/slices/contactSlice'
import { showToastError } from '@/utils/helper'
import { useTranslation } from 'react-i18next'
import { NormalButton } from '@/components'
import { AddCircle, Delete } from '@mui/icons-material'
import { CommonInput, MultiAutoCompleteControl } from '@/components/form'

interface Contact {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  position: string
  contact_id?: string
}

const AddCompanyContactTable = () => {
  const { t } = useTranslation()
  const { setValue, getValues, watch } = useFormContext()
  const dispatch = useAppDispatch()
  const [contacts, setContacts] = useState<Contact[]>([])
  const { companyContacts } = useAppSelector(({ company }) => company)
  const { contactList } = useAppSelector(({ contact }) => contact)
  const [contactCount, setContactCount] = useState(1)

  const formContacts = watch('contacts') || []

  useEffect(() => {
    if (formContacts.length === 0) {
      const initialContact: Contact = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        position: ''
      }
      setContacts([initialContact])
      setValue('contacts', [initialContact])
    } else {
      setContacts(formContacts)
    }
  }, [])

  useEffect(() => {
    if (formContacts.length > 0) {
      setContacts(formContacts)
    }
  }, [formContacts])

  useEffect(() => {
    dispatch(fetchContacts({ search: '', limit: 10000, page: 1 }))
  }, [])

  const handleAddRow = () => {
    const currentContacts = getValues('contacts') || []
    const lastContact = currentContacts[currentContacts?.length - 1]
    if (
      lastContact?.first_name === '' ||
      lastContact?.last_name === '' ||
      lastContact?.email === '' ||
      lastContact?.phone_number === ''
    ) {
      showToastError('Please fill in all the fields before adding a new contact.')
      return
    }
    const newContactCount = contactCount + 1

    setValue('contacts', [
      ...currentContacts,
      {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        position: ''
      }
    ])
    setContactCount(newContactCount)
  }

  const processedContacts =
    (contactList &&
      contactList?.data?.map((item: any) => ({
        ...item,
        contact: {
          ...item.contact,
          full_name: `${item.contact.first_name} ${item.contact.last_name}`
        }
      }))) ||
    []

  useEffect(() => {
    if (companyContacts && companyContacts?.data?.length > 0) {
      const defaultSelectedIds = companyContacts?.data?.map((c: any) => c?.contact?.contact_id)
      setValue('selected_contacts', defaultSelectedIds, {
        shouldValidate: true
      })
    }
  }, [companyContacts, setValue])

  const handleDeleteRow = (index: number) => {
    if (contacts.length > 1) {
      const deletedContactId = contacts[index]?.contact_id
      const updatedContacts = contacts.filter((_, i) => i !== index)

      setContacts(updatedContacts)
      setValue('contacts', updatedContacts, { shouldValidate: true })

      if (deletedContactId) {
        const currentSelectedContacts = getValues('selected_contacts') || []
        const updatedSelectedContacts = currentSelectedContacts.filter((id: string) => id !== deletedContactId)
        setValue('selected_contacts', updatedSelectedContacts, {
          shouldValidate: true
        })
      }
    }
  }

  const handleMultiSelectChange = (selectedValues: string[]) => {
    setValue('selected_contacts', selectedValues, {
      shouldValidate: true
    })

    if (selectedValues.length === 0) {
      const initialContact: Contact = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        position: ''
      }
      setContacts([initialContact])
      setValue('contacts', [initialContact])
      return
    }

    let updatedContacts = [...contacts]

    selectedValues.forEach((contactId: string) => {
      const existing = updatedContacts.find(contact => contact.contact_id === contactId)

      if (!existing) {
        const selectedContact = processedContacts.find((c: any) => c.contact.contact_id === contactId)

        if (selectedContact) {
          const blankRowIndex = updatedContacts.findIndex(
            contact => !contact.contact_id && !contact.first_name && !contact.email
          )

          const newContactData: Contact = {
            first_name: selectedContact.contact?.first_name || '',
            last_name: selectedContact.contact?.last_name || '',
            email: selectedContact.emails[0]?.email || '',
            phone_number: selectedContact.phones[0]?.phone_number || '',
            position: selectedContact?.companies[0]?.position || '',
            contact_id: contactId
          }

          if (blankRowIndex !== -1) {
            const isBlankRowEmpty =
              !updatedContacts[blankRowIndex].first_name &&
              !updatedContacts[blankRowIndex].last_name &&
              !updatedContacts[blankRowIndex].email &&
              !updatedContacts[blankRowIndex].phone_number &&
              !updatedContacts[blankRowIndex].position

            if (isBlankRowEmpty) {
              updatedContacts[blankRowIndex] = newContactData
            } else {
              updatedContacts.push(newContactData)
            }
          } else {
            updatedContacts.push(newContactData)
          }
        }
      }
    })

    updatedContacts = updatedContacts.filter(contact => {
      if (contact.contact_id) {
        return selectedValues.includes(contact.contact_id)
      }
      return true
    })

    if (updatedContacts.length === 0) {
      updatedContacts = [
        {
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          position: ''
        }
      ]
    }

    setContacts(updatedContacts)
    setValue('contacts', updatedContacts, { shouldValidate: true })
  }

  return (
    <>
      <div className='company_select_dropdown_div'>
        <MultiAutoCompleteControl
          name='selected_contacts'
          options={processedContacts.map((contact: any) => ({
            label: `${contact.contact.first_name} ${contact.contact.last_name}`,
            value: contact.contact.contact_id
          }))}
          sx={{
            '& .MuiFormLabel-root': {
              fontSize: '14px'
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '14px',
              '&:hover fieldset': {
                borderColor: '#cbd5e1'
              },
              '& .MuiInputBase-input': {
                fontSize: '14px'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(19,62,135)'
              },
              '&.Mui-error fieldset': {
                borderColor: '#ef4444'
              }
            },
            '& .MuiInputBase-root': {
              minHeight: '40px'
            }
          }}
          label={t('companyForm.selectContacts')}
          onChange={(name: string, value: any) => {
            handleMultiSelectChange(value || [])
          }}
        />
        <div className='add_product_or_service_table_main_div'>
          <Table responsive>
            <thead className='invite_user_table_header'>
              <tr>
                <th colSpan={6}>
                  <h6 className='common_card_title'>{t('companyContactTable.contactDetails')}</h6>
                </th>
                <th>
                  <NormalButton
                    title=''
                    icon={<AddCircle />}
                    iconOnly
                    type='button'
                    onClick={handleAddRow}
                    tooltip='Add Contact'
                    tooltipArrow
                  />
                </th>
              </tr>
            </thead>
            <tbody className='invite_user_table_body'>
              {contacts?.map((contact: Contact, index: number) => (
                <tr key={`contact-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <CommonInput name={`contacts.${index}.first_name`} label={t('companyContactTable.firstName')} />
                  </td>
                  <td>
                    <CommonInput name={`contacts.${index}.last_name`} label={t('companyContactTable.lastName')} />
                  </td>
                  <td>
                    <CommonInput name={`contacts.${index}.email`} label={t('companyContactTable.email')} />
                  </td>
                  <td>
                    <CommonInput name={`contacts.${index}.phone_number`} label={t('companyContactTable.phoneNumber')} />
                  </td>
                  <td>
                    <CommonInput name={`contacts.${index}.position`} label={t('companyContactTable.position')} />
                  </td>
                  <td>
                    {contacts.length > 1 && (
                      <NormalButton
                        icon={<Delete />}
                        iconOnly
                        type='button'
                        onClick={() => handleDeleteRow(index)}
                        tooltip='Delete Contact'
                        tooltipArrow
                        color='error'
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  )
}

export default AddCompanyContactTable
