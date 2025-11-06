import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { contactsValidationSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row } from 'react-bootstrap'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { fetchContactsWithoutGroupBy } from '@/redux/slices/contactSlice'
import { Icon } from '@iconify/react'
import { CommonInput } from '@/components/form'
import { NormalButton } from '@/components'
import StandaloneSearchAutoComplete from '@/components/search-autocomplete/standalone'

interface FormValues {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  position?: string
  contact_id?: string
}
interface AddCompanyContactFormProps {
  onClose?: () => void
  reloadTable?: any
  onSave?: any
  setDataInform?: boolean
}

const ContactFormOnModule = ({
  //   reloadTable,
  onClose,
  onSave,
  setDataInform
}: AddCompanyContactFormProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { crudLoading } = useAppSelector(({ contact }) => contact)
  const [contactSelected, setContactSelected] = useState<any>(null)

  const methods = useForm<FormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(contactsValidationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      position: ''
    }
  })

  const {
    handleSubmit,
    reset
    // watch,
    // control,
    // formState: { errors },
  } = methods

  const onSubmit = (data: any) => {
    if (data) {
      onSave(data)
        .then(() => {
          onClose?.()
          reset()
        })
        .catch((err: any) => {
          console.log('err', err)
        })
    }
  }

  const handleSelectContact = (data: any) => {
    if (setDataInform) {
      setContactSelected(data)
      reset({
        first_name: data?.contact?.first_name,
        last_name: data?.contact?.last_name,
        email: data?.contact?.email,
        phone_number: data?.contact?.phone,
        position: data?.contact?.job_title,
        contact_id: data?.contact?.contact_id
      })
      return
    } else {
      onSave(data?.contact)
      reset()
    }
  }

  const fetchContactData = useCallback(
    async ({ search, page }: { search: string; page: number }) => {
      const response = await dispatch(
        fetchContactsWithoutGroupBy({
          search,
          page,
          limit: 10
        })
      ).unwrap()
      const formattedContacts =
        response?.data?.map((item: any) => ({
          label: `${item?.first_name || ''} ${item?.last_name || ''}`.trim(),
          value: item?.contact_id,
          contact: {
            first_name: item?.first_name || '',
            last_name: item?.last_name || '',
            email: item?.email || '',
            phone: item?.phone || '',
            company: item?.company || '',
            job_title: item?.job_title || '',
            contact_id: item?.contact_id
          }
        })) || []
      return {
        data: formattedContacts,
        total_records: response?.total_records
      }
    },
    [dispatch]
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={12}>
            <StandaloneSearchAutoComplete
              options={[]}
              onChange={handleSelectContact}
              label={t('contactform.searchContact')}
              value={contactSelected}
              fetchData={fetchContactData}
              renderOption={(props, option) => (
                <li {...props}>
                  <div className='search_details_div w-100'>
                    <div className='search_details_title_text'>{option.label}</div>
                    <div className='search_details_info_text'>
                      {option.contact?.email && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Icon icon='mdi:email-outline' width='16' height='16' />
                          <span>{option.contact.email}</span>
                        </div>
                      )}
                      {option.contact?.phone && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Icon icon='mdi:phone-outline' width='16' height='16' />
                          <span>{option.contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )}
            />
          </Col>
          <Col md={6}>
            <CommonInput
              name='first_name'
              placeholder={`${t('contactform.firstName')} *`}
              disabled={!!contactSelected?.contact?.first_name}
            />
          </Col>
          <Col md={6}>
            <CommonInput
              name='last_name'
              placeholder={`${t('contactform.lastName')} *`}
              disabled={!!contactSelected?.contact?.last_name}
            />
          </Col>

          <Col md={12}>
            <CommonInput
              name='phone_number'
              placeholder={`${t('contactform.phoneNumber')} *`}
              disabled={!!contactSelected?.contact?.phone}
            />
          </Col>
          <Col md={12}>
            <CommonInput
              name='email'
              placeholder={`${t('contactform.email')} *`}
              disabled={!!contactSelected?.contact?.email}
            />
          </Col>
          <Col md={12}>
            <CommonInput
              name='position'
              placeholder={t('contactform.position')}
              disabled={!!contactSelected?.contact?.job_title}
            />
          </Col>
          <Col md={12}>
            <div className='multi_action_btn_div'>
              <NormalButton
                title={t('common.cancel')}
                type='button'
                variant='outlined'
                onClick={() => {
                  onClose?.()
                  reset()
                }}
              />
              <NormalButton title={t('common.submit')} type='submit' loading={crudLoading} disabled={crudLoading} />
            </div>
          </Col>
        </Row>
      </form>
    </FormProvider>
  )
}

export default ContactFormOnModule
