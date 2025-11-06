import { Icon } from '@iconify/react'
import { Col, Row } from 'react-bootstrap'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerSchema } from '@/utils/validation'
import { customerActions } from '@/redux/slices/customerSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchAcountMasterGroups } from '@/redux/slices/acountMasterGroupSlice'
import { useAddressOptions } from '@/hooks/use-address'
import { CommonInput, EditorControl, SingleAutoCompleteControl } from '@/components/form'
import { NormalButton } from '@/components'
import { fetchContactsWithoutGroupBy } from '@/redux/slices/contactSlice'
import StandaloneSearchAutoComplete from '@/components/search-autocomplete/standalone'
import { Box } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'

interface IProps {
  onNext: () => void
}

interface FormValues {
  sub_type_id?: string | null
  account_name: string
  first_name: string
  last_name: string
  email?: { email: string; email_label: string; is_primary_email: boolean }[]
  phone_number?: {
    phone_number: string
    phone_label: string
    is_primary_phone: boolean
  }[]
  address_line_1?: string | null
  address_line_2?: string | null
  city_id?: string | null
  state_id?: string | null
  pincode?: string | null
  country_id?: string | null
  account_group_id?: string | null
  description?: string | null
  contact_id?: string | null
}

const CustomerDetails = ({ onNext }: IProps) => {
  const dispatch = useAppDispatch()
  const { customer, customerDetails } = useAppSelector(({ customer }) => customer)
  const { groupList } = useAppSelector(({ accountMasterGroup }) => accountMasterGroup)
  const [contactSelected, setContactSelected] = useState<any>(null)
  console.log('🚀 ~ CustomerDetails ~ contactSelected:', contactSelected)
  const navigate = useNavigate()
  const location = useLocation()

  const leadData = location.state?.leadData

  const groupOptions = useMemo(() => {
    return groupList.map((item: any) => ({
      label: item.tnt_account_master_group_name,
      value: item.tnt_account_master_group_account_group_id
    }))
  }, [groupList])

  const defaultValues: FormValues = {
    sub_type_id: 'bfea64dc-227a-48d4-b436-a759d004ecf9',
    account_name: '',
    first_name: '',
    last_name: '',
    email: [{ email: '', email_label: 'work', is_primary_email: true }],
    phone_number: [{ phone_number: '', phone_label: 'work', is_primary_phone: true }],
    address_line_1: '',
    address_line_2: '',
    city_id: '',
    state_id: '',
    pincode: '',
    country_id: '',
    account_group_id: null,
    description: '',
    contact_id: null
  }

  const methods = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(customerSchema as any),
    defaultValues
  })

  const { handleSubmit, reset, control } = methods

  const {
    countryOptions,
    stateOptions,
    cityOptions,
    country_id,
    state_id,
    handleCountryChange,
    handleStateChange,
    handleCityChange
  } = useAddressOptions(methods)

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone
  } = useFieldArray({ control, name: 'phone_number' })

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control, name: 'email' })

  useEffect(() => {
    if (customer) {
      const countryId = customer?.addresses?.[0]?.country?.country_id
      const stateId = customer?.addresses?.[0]?.state?.state_id
      const cityId = customer?.addresses?.[0]?.city?.city_id
      const addressLine1 = customer?.addresses?.[0]?.address_line_1
      const addressLine2 = customer?.addresses?.[0]?.address_line_2
      const pincode = customer?.addresses?.[0]?.pincode

      reset({
        account_name: customer?.account_name || null,
        first_name: customer?.contact?.first_name || null,
        last_name: customer?.contact?.last_name || null,
        email: customer?.emails?.map((e: any) => ({
          email: e.email,
          email_id: e.email_id,
          email_label: e.email_label,
          is_primary_email: e.is_primary
        })) || [{ email: '', email_label: 'work', is_primary_email: true }],
        phone_number: customer?.phones?.map((p: any) => ({
          phone_number: p.phone_number,
          phone_id: p.phone_id,
          phone_label: p.phone_label,
          is_primary_phone: p.is_primary
        })) || [{ phone_number: '', phone_label: 'work', is_primary_phone: true }],
        address_line_1: addressLine1 || null,
        address_line_2: addressLine2 || null,
        city_id: cityId || null,
        state_id: stateId || null,
        pincode: pincode || null,
        country_id: countryId || null,
        account_group_id: customer?.account_master_details?.account_group_id || null,
        description: customer?.description || null
      })
    } else if (leadData) {
      reset(leadData)
    }
  }, [customer, leadData])

  useEffect(() => {
    if (customerDetails) {
      reset({ ...customerDetails })
    }
  }, [customerDetails])

  useEffect(() => {
    Promise.all([dispatch(fetchAcountMasterGroups({}))])
  }, [])

  const handleSelectContact = (data: any) => {
    setContactSelected(data)
    reset({
      first_name: data?.contact?.first_name,
      last_name: data?.contact?.last_name,
      email: [
        {
          email: data?.contact?.email,
          email_label: 'work',
          is_primary_email: true
        }
      ],
      phone_number: [
        {
          phone_number: data?.contact?.phone,
          phone_label: 'work',
          is_primary_phone: true
        }
      ],
      address_line_1: data?.contact?.address_line_1,
      address_line_2: data?.contact?.address_line_2,
      city_id: data?.contact?.city_id,
      state_id: data?.contact?.state_id,
      pincode: data?.contact?.pincode,
      country_id: data?.contact?.country_id,
      account_name: data?.contact?.company,
      contact_id: data?.contact?.contact_id
    })
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
        response?.data
          // ?.filter((item: any) => item?.is_customer === false)
          ?.map((item: any) => {
            return {
              label: `${item?.first_name || ''} ${item?.last_name || ''}`.trim(),
              value: item?.contact_id,
              contact: {
                first_name: item?.first_name || '',
                last_name: item?.last_name || '',
                email: item?.email || '',
                phone: item?.phone || '',
                company: item?.company_name || '',
                job_title: item?.job_title || '',
                contact_id: item?.contact_id,
                address_line_1: item?.address_line_1 || '',
                address_line_2: item?.address_line_2 || '',
                city_id: item?.city_id || '',
                state_id: item?.state_id || '',
                pincode: item?.pincode || '',
                country_id: item?.country_id || ''
              }
            }
          }) || []

      return {
        data: formattedContacts,
        total_records: response?.total_records
      }
    },
    [dispatch]
  )

  const handle = {
    onCancel: () => {
      if (leadData) {
        navigate(`/lead/details/${leadData?.leadId}`)
      } else {
        navigate('/customers')
      }
    },
    onSubmit: (data: any) => {
      console.log('🚀 ~ CustomerDetails ~ data:', data)

      dispatch(customerActions.setCustomerDetails(data))
      onNext()
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handle.onSubmit)}>
        <Row>
          {!(leadData || customer) && (
            <Col sm={6} xl={6}>
              <StandaloneSearchAutoComplete
                options={[]}
                label={`Search Contact`}
                fetchData={fetchContactData}
                onChange={handleSelectContact}
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
          )}
          <Col sm={6} xl={6}>
            <CommonInput name='account_name' label='Company Name *' />
          </Col>
          <Col sm={6} xl={6}>
            <CommonInput name='first_name' label='First Name *' />
          </Col>
          <Col sm={6} xl={6}>
            <CommonInput name='last_name' label='Last Name *' />
          </Col>
          <Col sm={6} xl={6}>
            <Row>
              {phoneFields.map((field, index) => (
                <Col md={12} key={field.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CommonInput name={`phone_number.${index}.phone_number`} label='Phone Number' />
                    <Box sx={{ mb: '20px', ml: 2 }}>
                      {index === 0 ? (
                        <NormalButton
                          type='button'
                          tooltip='Add Phone Number'
                          tooltipArrow
                          onClick={() =>
                            appendPhone({
                              phone_number: '',
                              phone_label: 'work',
                              is_primary_phone: false
                            })
                          }
                          icon={<Add />}
                          iconOnly
                        />
                      ) : (
                        <NormalButton
                          type='button'
                          tooltip='Delete Phone Number'
                          tooltipArrow
                          color='error'
                          onClick={() => removePhone(index)}
                          icon={<Remove />}
                          iconOnly
                        />
                      )}
                    </Box>
                  </Box>
                </Col>
              ))}
            </Row>
          </Col>
          <Col sm={6} xl={6}>
            <Row>
              {emailFields.map((field, index) => (
                <Col md={12} key={field.id}>
                  <div className='d-flex align-items-center'>
                    <CommonInput name={`email.${index}.email`} label='Email' />
                    <Box sx={{ mb: '20px', ml: 2 }}>
                      {index === 0 ? (
                        <NormalButton
                          type='button'
                          tooltip='Add Email'
                          tooltipArrow
                          onClick={() =>
                            appendEmail({
                              email: '',
                              email_label: 'work',
                              is_primary_email: false
                            })
                          }
                          icon={<Add />}
                          iconOnly
                        />
                      ) : (
                        <NormalButton
                          tooltip='Delete Email'
                          tooltipArrow
                          type='button'
                          color='error'
                          onClick={() => removeEmail(index)}
                          icon={<Remove />}
                          iconOnly
                        />
                      )}
                    </Box>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          <Col sm={6} xl={6}>
            <CommonInput name='address_line_1' label='House No / Flat / Building Name' />
          </Col>
          <Col sm={6} xl={6}>
            <CommonInput name='address_line_2' label='Area / Sector / Locality' />
          </Col>

          <Col sm={6} xl={6}>
            <SingleAutoCompleteControl
              name='country_id'
              label='Country'
              options={countryOptions || []}
              onChange={handleCountryChange}
            />
          </Col>

          <Col sm={6} xl={6}>
            <SingleAutoCompleteControl
              name='state_id'
              label='State'
              options={stateOptions || []}
              onChange={handleStateChange}
              disabled={!country_id}
            />
          </Col>

          <Col sm={6} xl={6}>
            <SingleAutoCompleteControl
              name='city_id'
              label='City'
              options={cityOptions || []}
              onChange={handleCityChange}
              disabled={!state_id}
            />
          </Col>

          <Col sm={6} xl={6}>
            <CommonInput name='pincode' label='Pincode' />
          </Col>

          {/* <Col md={6}>
            <div className="filed_space_div">
              <DropdownControl
                name="agentReferenceName"
                placeholder="Select Agent/Reference Name"
                fields={{ text: "agent_name", value: "id" }}
                dataSource={[]}
              />
            </div>
          </Col>

          <Col md={6}>
            <div className="filed_space_div">
              <div className="d-flex align-items-center gap-2">
                <InputControl
                  name="commissionPercentage"
                  placeholder="Commission Percentage"
                />
                <Icon
                  icon="fluent-mdl2:calculator-percentage"
                  width="16"
                  height="16"
                />
              </div>
            </div>
          </Col> */}

          {/* <Col md={6}>
            <div className="filed_space_div">
              <div className="social_profile_box">
                <div className="social_profile_icon">
                  <Icon icon="logos:facebook" width="18" height="18" />
                </div>
                <InputControl name="facebook" placeholder="Facebook" />
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="filed_space_div">
              <div className="social_profile_box">
                <div className="social_profile_icon">
                  <Icon icon="devicon:linkedin" width="18" height="18" />
                </div>
                <InputControl name="linkedin" placeholder="Linkedin" />
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="filed_space_div">
              <div className="social_profile_box">
                <div className="social_profile_icon">
                  <Icon icon="skill-icons:instagram" width="18" height="18" />
                </div>
                <InputControl name="instagram" placeholder="Instagram" />
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="filed_space_div">
              <div className="social_profile_box">
                <div className="social_profile_icon">
                  <Icon
                    icon="fa6-brands:square-x-twitter"
                    width="18"
                    height="18"
                  />
                </div>
                <InputControl name="twitter" placeholder="Twitter" />
              </div>
            </div>
          </Col> */}

          <Col sm={6} xl={6}>
            <SingleAutoCompleteControl name='account_group_id' label='Group Name' options={groupOptions} />
          </Col>

          <Col md={12}>
            <div>
              <EditorControl name='description' isControl={true} />
            </div>
          </Col>
        </Row>

        <div className='multi_action_btn_div mt-2'>
          <NormalButton title='Cancel' variant='outlined' onClick={handle.onCancel} />
          <NormalButton title='Save And Continue' type='submit' />
        </div>
      </form>
    </FormProvider>
  )
}

export default CustomerDetails
