import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { saveTaxationDetails, updateOrganization } from '@/redux/slices/organizationSlice'
import { fetchOrganizationList } from '@/redux/slices/authSlice'
import { organizationActions } from '@/redux/slices/organizationSlice'
import { taxationValidationSchema } from '@/utils/validation'
import data from '../../../data/dataSource.json'
import { NormalButton } from '@/components'
import { CommonInput, SingleAutoCompleteControl } from '@/components/form'
import CommonCheckbox from '@/components/form/checkbox-control'

interface IProps {
  onNext: () => void
  onBack: () => void
}

export const TaxationDetails = ({ onNext, onBack }: IProps) => {
  const organizationTypeOptions = data['Organization']

  const dispatch = useAppDispatch()
  const { id } = useParams()
  const pathname = useLocation().pathname
  const { taxationDetails: formData, companyDetails, loading } = useAppSelector(({ organization }) => organization)

  const [isOpen, setOpen] = useState(formData?.is_gst_registered || false)

  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(taxationValidationSchema as any),
    defaultValues: {
      panNumber: companyDetails?.pan_number || formData?.pan_number || null,
      organizationType: companyDetails?.organization_type_id || formData?.organization_type_id || null,
      corpRegisterNumber:
        companyDetails?.business_licenses?.corp_registration_number ||
        formData?.business_licenses?.corp_registration_number ||
        null,
      tanNumber: companyDetails?.business_licenses?.tan_number || formData?.business_licenses?.tan_number || null,
      iec_code: companyDetails?.business_licenses?.iec_code || formData?.iec_code || '',
      is_gst_registered: companyDetails?.is_gst_registered || formData?.is_gst_registered,
      msmeNumber: formData?.msme_number || ''
    }
  })

  const { handleSubmit, setValue } = methods

  const onSubmit = async (data: any) => {
    try {
      const apiData = {
        logo: companyDetails?.logo || '',
        language_id: companyDetails?.language_id || '',
        country_id: companyDetails?.country_id || '',
        industry_id: companyDetails?.industry_id || '',
        organization_type_id: companyDetails?.organization_type_id || '',
        branch_name: companyDetails?.branch_name || '',
        organization_name: companyDetails?.organization_name || '',
        email: companyDetails?.email || '',
        phone_number: companyDetails?.phone_number || '',
        whatsapp: companyDetails?.whatsapp || '',
        website: companyDetails?.website || '',
        social_media: companyDetails?.social_media || {},
        contact_persons: companyDetails?.contact_persons || {},
        address_details: companyDetails?.address_details || {},
        address_type: 'Shipping',
        address_name: companyDetails?.address_details.addresses[0]?.address_name || '',
        pincode: companyDetails?.address_details.addresses[0]?.pincode || '',
        address_line_1: companyDetails?.address_details.addresses[0]?.address_line || '',
        address_line_2: companyDetails?.address_details.addresses[0]?.address_line || '',
        address_contact_person_name: companyDetails?.contact_persons?.name || '',
        address_contact_person_number: companyDetails?.phone_number || '',
        state_id: companyDetails?.address_details.addresses[0]?.state || '',
        city_id: companyDetails?.address_details.addresses[0]?.city || '',
        currency_code_id: companyDetails?.currency_code_id || '',
        pan_number: data.panNumber || '',
        gst_id: companyDetails?.gst_id || '',
        gst_registration_type: companyDetails?.gst_registration_type || '',
        msme_number: data.msmeNumber || '',
        is_gst_registered: data.is_gst_registered,
        business_licenses: {
          corp_registration_number: data.corpRegisterNumber || '',
          tan_number: data.tanNumber || '',
          iec_code: data.iec_code || ''
        },
        account_details: companyDetails?.account_details || {},
        updated_by: companyDetails?.updated_by || ''
      }

      dispatch(
        saveTaxationDetails({
          ...apiData,
          organization_type_id: data.organizationType,
          organization_id: companyDetails?.organization_id,
          branch_id: companyDetails?.branch_id
        })
      )

      const result = await dispatch(
        updateOrganization({
          id: companyDetails?.organization_id,
          branch_id: companyDetails?.branch_id,
          payload: apiData
        })
      ).unwrap()
      if (result) {
        if (pathname.includes('organization/')) {
          dispatch(fetchOrganizationList({ limit: 50, page: 1 }))
          onNext()
        } else {
          dispatch(organizationActions.setOrganizations(result))
          onNext()
        }
      }
    } catch (error) {
      console.log('Error submitting form:', error)
    }
  }

  const onSkip = async () => {
    dispatch(
      saveTaxationDetails({
        ...companyDetails,
        organization_id: companyDetails?.organization_id,
        branch_id: companyDetails?.branch_id
      })
    )
    onNext()
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h6 className='common_card_title'>Taxation details</h6>

          <Col md={6}>
            <CommonInput name='panNumber' label='PAN Number' />
          </Col>

          <Col md={6}>
            <SingleAutoCompleteControl
              name='organizationType'
              options={organizationTypeOptions}
              label='Organization Type'
            />
          </Col>

          <Col md={6}>
            <CommonInput name='corpRegisterNumber' label='CORP Register Number' />
          </Col>

          <Col md={6}>
            <CommonInput name='tanNumber' label='TAN Number' />
          </Col>

          <Col md={6}>
            <CommonInput name='iec_code' label='IEC Code' />
          </Col>

          <Col md={12}>
            <CommonCheckbox
              label='Is your business registered for GST?'
              name='is_gst_registered'
              onChange={(e: any) => {
                setOpen(!isOpen)
                setValue('is_gst_registered', e.target.checked)
              }}
            />
          </Col>

          {isOpen && (
            <Col md={12}>
              <CommonInput name='msmeNumber' label='MSME number' />
            </Col>
          )}
        </Row>

        <div className='multi_action_btn_div'>
          <NormalButton title='Skip' type='button' onClick={onSkip} variant='outlined' />
          <NormalButton title='Back' type='button' onClick={onBack} variant='outlined' />
          <NormalButton
            title={id ? 'Save And Continue' : 'Submit And Continue'}
            type='submit'
            loading={loading}
            disabled={loading}
            variant='contained'
          />
        </div>
      </form>
    </FormProvider>
  )
}
