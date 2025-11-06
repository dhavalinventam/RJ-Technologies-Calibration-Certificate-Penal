import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { yupResolver } from '@hookform/resolvers/yup'
import { cookiesOptions, FIRST_ORGANIZATION } from '@/utils/constant'
import { fetchOrganizationList } from '@/redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import {
  saveCompanyDetails,
  saveOrganizationSetup,
  saveTaxationDetails,
  updateOrganization
} from '@/redux/slices/organizationSlice'
import { setCookieValue } from '@/utils/common'
import { organizationActions } from '@/redux/slices/organizationSlice'
import { bankDetailsSchema } from '@/utils/validation'
import { CommonInput } from '@/components/form'
import { NormalButton } from '@/components'

interface Props {
  onBack: () => void
}

const BankDetails = ({ onBack }: Props) => {
  const dispatch = useAppDispatch()
  const { taxationDetails, loading } = useAppSelector(({ organization }) => organization)
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(bankDetailsSchema),
    defaultValues: {
      accountName: taxationDetails?.account_details?.accountName || '',
      accountNumber: taxationDetails?.account_details?.accountNumber || '',
      bankName: taxationDetails?.account_details?.bankName || '',
      ifscCode: taxationDetails?.account_details?.ifscCode || '',
      swiftCode: taxationDetails?.account_details?.swiftCode || '',
      micrCode: taxationDetails?.account_details?.micrCode || '',
      branch: taxationDetails?.account_details?.branch || ''
    }
  })

  const { handleSubmit } = methods

  const onSubmit = async (data: any) => {
    try {
      const apiData = {
        ...taxationDetails,
        account_details: data,
        updated_by: taxationDetails?.updated_by || ''
      }

      const result = await dispatch(
        updateOrganization({
          id: taxationDetails?.organization_id,
          branch_id: taxationDetails?.branch_id,
          payload: apiData
        })
      ).unwrap()

      if (result) {
        setCookieValue(FIRST_ORGANIZATION, 'true', { ...cookiesOptions, sameSite: 'Strict' })
        dispatch(saveOrganizationSetup(null))
        dispatch(saveCompanyDetails(null))
        dispatch(saveTaxationDetails(null))
        dispatch(fetchOrganizationList({ limit: 50, page: 1 }))
        if (id || location.pathname.includes('organization/')) {
          navigate('/organization')
        } else {
          dispatch(organizationActions.setOrganizations(result))
          navigate('/pricingplan')
        }
      }
    } catch (error) {
      console.log('Error submitting form:', error)
    }
  }

  const onSkip = () => {
    if (id || location.pathname.includes('organization/')) {
      navigate('/organization')
    } else {
      navigate('/pricingplan')
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <h6 className='common_card_title'>Bank Details</h6>

          <Col md={6}>
            <CommonInput name='accountName' label='Account Name *' />
          </Col>
          <Col md={6}>
            <CommonInput name='accountNumber' label='Account Number *' />
          </Col>
          <Col md={6}>
            <CommonInput name='bankName' label='Bank Name *' />
          </Col>
          <Col md={6}>
            <CommonInput name='ifscCode' label='IFSC Code *' />
          </Col>
          <Col md={6}>
            <CommonInput name='swiftCode' label='Swift Code *' />
          </Col>
          <Col md={6}>
            <CommonInput name='micrCode' label='MICR Code *' />
          </Col>
          <Col md={12}>
            <CommonInput name='branch' label='Branch *' />
          </Col>
        </Row>

        <div className='TaxationDetails_tab_subdata'>
          <p className='note_data_text'>Note:</p>
          <ul className='TaxationDetails_ui'>
            <li className='TaxationDetails_li_data'>You can update some of these preferences from settings anytime.</li>
          </ul>
        </div>

        <div className='multi_action_btn_div'>
          <NormalButton title='Skip' type='button' onClick={onSkip} variant='outlined' />
          <NormalButton title='Back' type='button' onClick={onBack} variant='outlined' />
          <NormalButton
            title={id ? 'Save' : 'Submit'}
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

export default BankDetails
