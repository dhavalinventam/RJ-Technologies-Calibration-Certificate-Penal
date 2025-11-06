import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams, useLocation } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import {
  createOrganization,
  getLogo,
  organizationActions,
  saveCompanyDetails,
  updateOrganization,
  verifyGST
} from '@/redux/slices/organizationSlice'
import { fetchOrganizationList } from '@/redux/slices/authSlice'
import { rememberMeTask } from '@/utils/common'
import { fetchCitiesByStateId, fetchCurrencies, fetchStatesByCountryId } from '@/redux/slices/masterDataSlice'
import { companyDetailsValidationSchema } from '@/utils/validation'
import data from '../../../data/dataSource.json'
import { CommonInput, SingleAutoCompleteControl } from '@/components/form'
import { NormalButton, SingleImageUpload } from '@/components'
import CommonCheckbox from '@/components/form/checkbox-control'
import { CircularProgress } from '@mui/material'

interface IProps {
  onNext: () => void
  onBack: () => void
}

export const CompanyDetails = ({ onNext, onBack }: IProps) => {
  const GST = data['GSTType']

  const GSTOptions = useMemo(() => {
    return GST.map((gst: any) => ({
      label: gst.Type,
      value: gst.Id
    }))
  }, [GST])

  const dispatch = useAppDispatch()
  const { companyDetails, organizationSetup, taxationDetails, loading, verifingGST, logo } = useAppSelector(
    ({ organization }) => organization
  )

  useEffect(() => {
    if (organizationSetup.country_id) {
      dispatch(fetchStatesByCountryId(organizationSetup.country_id))
    }
  }, [])

  const { currencies, states, cities } = useAppSelector(({ masterData }) => masterData)
  const DefaultCurrency = useMemo(() => {
    return currencies?.find(currency => currency.currency_code === 'INR')
  }, [currencies])
  console.log('DefaultCurrency', DefaultCurrency)

  useEffect(() => {
    setValue('currency', DefaultCurrency?.currency_id)
  }, [DefaultCurrency])
  const currencyOptions = useMemo(() => {
    return currencies?.map(currency => ({
      label: currency.currency_name + ' (' + currency.currency_code + ')',
      value: currency.currency_id
    }))
  }, [currencies])

  const stateOptions = useMemo(() => {
    return states?.map(state => ({
      label: state.state_name,
      value: state.state_id
    }))
  }, [states])

  const cityOptions = useMemo(() => {
    return cities?.map(city => ({
      label: city.city_name,
      value: city.city_id
    }))
  }, [cities])

  const { id } = useParams()
  const { pathname } = useLocation()

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(companyDetailsValidationSchema as any),
    defaultValues: {
      organizationName: '',
      alias: '',
      currency: '',
      contactPerson: '',
      phoneNumber: '',
      address_line_1: '',
      address_line_2: '',
      state: '',
      city: '',
      pincode: '',
      gstType: '',
      gstId: '',
      email: '',
      website: '',
      isGSTRegistered: false,
      logo: '',
      gst_verified: false
    }
  })

  useEffect(() => {
    if (companyDetails) {
      setValue('organizationName', companyDetails?.organization_name)
      setValue('alias', companyDetails?.alias)
      setValue('currency', companyDetails?.currency_code_id || DefaultCurrency?.currency_id || '')
      setValue('contactPerson', companyDetails?.contact_persons?.name)
      setValue('phoneNumber', companyDetails?.phone_number)
      setValue('address_line_1', companyDetails?.address_details?.addresses[0]?.address_line_1)
      setValue('address_line_2', companyDetails?.address_details?.addresses[0]?.address_line_2)
      setValue('state', companyDetails?.address_details?.addresses[0]?.state)
      setValue('city', companyDetails?.address_details?.addresses[0]?.city)
      setValue('pincode', companyDetails?.address_details?.addresses[0]?.pincode)
      setValue('gstType', companyDetails?.gst_registration_type)
      setValue('gstId', companyDetails?.gst_id)
      setValue('email', companyDetails?.email)
      setValue('website', companyDetails?.website)
      setValue('isGSTRegistered', companyDetails?.gst_verified)
      setValue('gst_verified', companyDetails?.gst_verified)
      setValue('logo', companyDetails?.logo)
    }
  }, [companyDetails, DefaultCurrency])

  const { handleSubmit, setValue, clearErrors, watch, setError, getValues } = methods

  const isGSTRegistered = watch('isGSTRegistered')

  useEffect(() => {
    setOpen(isGSTRegistered)
  }, [isGSTRegistered])

  useEffect(() => {
    if (id) {
      dispatch(getLogo(String(id)))
    }
  }, [])

  const [isOpen, setOpen] = useState(companyDetails?.gst_verified || false)

  useEffect(() => {
    dispatch(fetchCurrencies())
  }, [])

  const onSubmit = async (data: any) => {
    // Check if GST is registered but not verified
    if (data?.isGSTRegistered && !getValues('gst_verified')) {
      setError('gstId', {
        message: 'Please verify GST number before submitting the form'
      })
      return
    }

    try {
      const formData = {
        ...organizationSetup,
        organization_name: data?.organizationName,
        branch_name: data?.organizationName,
        phone_number: data?.phoneNumber,
        email: data?.email,
        address_details: {
          addresses: [
            {
              address_line_1: data?.address_line_1,
              address_line_2: data?.address_line_2,
              state: data?.state,
              city: data?.city,
              pincode: data?.pincode,
              country: organizationSetup?.country_id
            }
          ]
        },
        address_type: 'Shipping',
        pincode: data?.pincode,
        address_line_1: data?.address_line_1,
        address_line_2: data?.address_line_2,
        address_contact_person_name: data?.contactPerson,
        address_contact_person_number: data?.phoneNumber,
        state_id: data?.state,
        city_id: data?.city,
        gst_id: data?.isGSTRegistered ? data?.gstId : '',
        gst_registration_type: data?.isGSTRegistered ? data?.gstType : '',
        is_gst_registered: data?.isGSTRegistered,
        currency_code_id: data?.currency,
        contact_persons: { name: data?.contactPerson },
        website: data?.website,
        isGSTRegistered: data?.isGSTRegistered,
        logo: data?.logo || null,
        pan_number: '',
        msme_number: '',
        business_licenses: {},
        whatsapp: '',
        social_media: {},
        account_details: {},
        alias: data?.alias,
        gst_verified: getValues('gst_verified')
      }

      const newFormData = { ...formData }
      delete newFormData.isGSTRegistered
      let result: any

      if (companyDetails || id) {
        const apiData = {
          logo: data?.logo || null,
          language_id: organizationSetup?.language_id || '',
          industry_id: organizationSetup?.industry_id || '',
          organization_type_id: organizationSetup?.organization_type_id || '',
          alias: data?.alias,
          country_id: organizationSetup?.country_id || '',
          branch_name: data?.organizationName || '',
          organization_name: data?.organizationName || '',
          email: data?.email,
          phone_number: data?.phoneNumber || '',
          whatsapp: companyDetails?.whatsapp || '',
          website: data?.website,
          social_media: companyDetails?.social_media || {},
          contact_persons: { name: data?.contactPerson },
          address_details: {
            addresses: [
              {
                address_line_1: data?.address_line_1,
                address_line_2: data?.address_line_2,
                state: data?.state,
                city: data?.city,
                pincode: data?.pincode,
                country: organizationSetup?.country_id
              }
            ]
          },
          address_type: 'Shipping',
          pincode: data?.pincode,
          address_line_1: data?.address_line_1,
          address_line_2: data?.address_line_2,
          address_contact_person_name: data?.contactPerson,
          address_contact_person_number: data?.phoneNumber,
          state_id: data?.state,
          city_id: data?.city,
          currency_code_id: data?.currency || '',
          pan_number: id ? companyDetails?.pan_number : taxationDetails?.pan_number || '',
          gst_id: data?.isGSTRegistered ? data?.gstId : '',
          gst_registration_type: data?.isGSTRegistered ? data?.gstType : '',
          is_gst_registered: id ? companyDetails?.is_gst_registered : taxationDetails?.is_gst_registered || false,
          gst_verified: getValues('gst_verified'),
          msme_number: id ? companyDetails?.msme_number : taxationDetails?.msme_number || '',
          business_licenses: {
            corp_registration_number: id
              ? companyDetails?.business_licenses.corp_registration_number
              : taxationDetails?.corpRegisterNumber || '',
            tan_number: id ? companyDetails?.business_licenses.tan_number : taxationDetails?.tanNumber || '',
            iec_code: id ? companyDetails?.business_licenses.iec_code : taxationDetails?.iec_code || ''
          },
          account_details: companyDetails?.account_details || {},
          updated_by: companyDetails?.updated_by || ''
        }
        dispatch(
          saveCompanyDetails({
            ...apiData,
            organization_id: companyDetails?.organization_id,
            branch_id: companyDetails?.branch_id,
            organization_type_id: organizationSetup?.organization_type_id
          })
        )
        result = await dispatch(
          updateOrganization({
            id: companyDetails?.organization_id,
            branch_id: companyDetails?.branch_id,
            payload: apiData
          })
        ).unwrap()
        if (result) {
          const id = result?.data?.organization_id
          dispatch(getLogo(id))
        }
      } else {
        result = await dispatch(createOrganization(newFormData)).unwrap()
        if (result) {
          const id = result?.data?.organization_id
          dispatch(getLogo(id))

          if (!pathname.includes('organization/')) {
            rememberMeTask(result?.data?.xCurAdd)
          }
        }
        dispatch(
          saveCompanyDetails({
            ...formData,
            organization_id: result?.data?.organization_id,
            branch_id: result?.data?.branch_id
          })
        )
      }
      if (result) {
        if (pathname.includes('organization/')) {
          dispatch(fetchOrganizationList({ limit: 50, page: 1 }))
          onNext()
          dispatch(organizationActions.resetLogo())
        } else {
          dispatch(organizationActions.setOrganizations(result?.data))
          onNext()
          dispatch(organizationActions.resetLogo())
        }
      }
    } catch (error) {
      console.log('Error submitting form:', error)
    }
  }

  const onVerifyGST = () => {
    dispatch(verifyGST({ gst_number: getValues('gstId') }))
      .unwrap()
      .then(() => {
        setValue('gst_verified', true)
        clearErrors('gstId')
      })
      .catch(() => {
        setValue('gst_verified', false)
        setError('gstId', { message: 'Invalid GST number' })
      })
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <h6 className='common_card_title'> Company Details </h6>
            <Col md={12}>
              <CommonCheckbox name='isGSTRegistered' label='Is your business registered for GST?' />
            </Col>
          </Row>

          {isOpen && (
            <Row>
              <Col md={6}>
                <div className='d-flex gap-2'>
                  <CommonInput name='gstId' label='GST Number *' />
                  <div>
                    <NormalButton
                      title='Verify'
                      type='button'
                      onClick={onVerifyGST}
                      loading={verifingGST}
                      disabled={!getValues('gstId').trim() || getValues('gstId').trim().length !== 15}
                    />
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <SingleAutoCompleteControl name='gstType' label='GST Registration Type *' options={GSTOptions} />
              </Col>
            </Row>
          )}

          <Row>
            <Col md={6}>
              <CommonInput name='organizationName' label='Organization Name *' />
            </Col>
            <Col md={6}>
              <CommonInput name='alias' label='Alias' />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <SingleAutoCompleteControl name='currency' label='Currency *' options={currencyOptions || []} />
            </Col>
          </Row>
          <Row>
            <h6 className='common_card_title'>Upload Logo</h6>
            <SingleImageUpload
              name='logo'
              endpoint={id ? `/organization/${id}/create-presigned-post-url-for-logo` : null}
              imageUrl={logo}
              module='organization_logo'
            />
          </Row>
          <Row>
            <h6 className='common_card_title'> Address </h6>
            <Col md={6}>
              <CommonInput name='contactPerson' label='Contact Person *' />
            </Col>
            <Col md={6}>
              <CommonInput name='phoneNumber' label='Phone Number *' />
            </Col>
            <Col md={6}>
              <CommonInput name='address_line_1' label='House No / Flat / Building Name *' />
            </Col>
            <Col md={6}>
              <CommonInput name='address_line_2' label='Area / Sector / Locality *' />
            </Col>
            <Col md={6}>
              <SingleAutoCompleteControl
                name='state'
                label='State *'
                options={stateOptions || []}
                onChange={(name, value) => {
                  setValue('state', value || '')
                  if (value) {
                    dispatch(fetchCitiesByStateId(value || ''))
                  }
                  setValue('city', '')
                }}
              />
            </Col>
            <Col md={6}>
              <SingleAutoCompleteControl
                name='city'
                label='City *'
                options={cityOptions || []}
                disabled={!watch('state')}
              />
            </Col>

            <Col md={6}>
              <CommonInput name='pincode' label='Pincode *' />
            </Col>

            <Col md={6}>
              <CommonInput name='email' label='Email' />
            </Col>

            <Col md={6}>
              <CommonInput name='website' label='Website' />
            </Col>
          </Row>

          <div className='multi_action_btn_div'>
            <NormalButton title='Back' type='button' variant='outlined' onClick={onBack} />
            <NormalButton
              title={id ? 'Save And Continue' : 'Submit And Continue'}
              type='submit'
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
              disabled={loading}
            />
          </div>
        </form>
      </FormProvider>
    </>
  )
}
