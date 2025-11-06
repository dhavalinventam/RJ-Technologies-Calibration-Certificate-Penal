import { Col, Row } from 'react-bootstrap'
import { FormProvider, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { useEffect, useMemo } from 'react'
import { fetchCurrencies } from '@/redux/slices/masterDataSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerBankDetailsSchema } from '@/utils/validation'
import { customerActions, updateCustomer } from '@/redux/slices/customerSlice'
import { AddCustomerI } from '@/types/api-paylod-types'
import { addCustomer } from '@/redux/slices/customerSlice'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CommonInput, SingleAutoCompleteControl } from '@/components/form'
import { NormalButton } from '@/components'

interface IProps {
  onBack: () => void
}

interface FormValues {
  bank_name: string
  account_name: string
  account_number: string
  bank_branch_name?: string | null
  ifsc_code?: string | null
  swift_code?: string | null
  micr_code?: string | null
  currency_code_id: string | null
}

const CustomerBankDetails = ({ onBack }: IProps) => {
  const dispatch = useAppDispatch()
  const { customer, customerDetails, taxationDetails, billingShippingDetails } = useAppSelector(
    ({ customer }) => customer
  )
  const { currencies } = useAppSelector(({ masterData }) => masterData)
  const navigate = useNavigate()
  const { id } = useParams()

  const currencyOptions = useMemo(() => {
    return currencies?.map((item: any) => ({
      label: item.currency_name + ' (' + item.currency_code + ')',
      value: item.currency_id
    }))
  }, [currencies])

  const methods = useForm<FormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      bank_name: '',
      account_name: '',
      account_number: '',
      bank_branch_name: null,
      ifsc_code: null,
      swift_code: null,
      micr_code: null,
      currency_code_id: null
    },
    resolver: yupResolver(customerBankDetailsSchema)
  })

  const { handleSubmit, reset } = methods

  const location = useLocation()
  const leadData = location.state?.leadData

  useEffect(() => {
    Promise.all([dispatch(fetchCurrencies())])
  }, [])

  useEffect(() => {
    if (!customer) return
    reset({
      bank_name: customer?.bank_details?.[0]?.bank_name || null,
      account_name: customer?.bank_details?.[0]?.account_name || null,
      account_number: customer?.bank_details?.[0]?.account_number || null,
      bank_branch_name: customer?.bank_details?.[0]?.bank_branch_name || null,
      ifsc_code: customer?.bank_details?.[0]?.ifsc_code || null,
      swift_code: customer?.bank_details?.[0]?.swift_code || null,
      micr_code: customer?.bank_details?.[0]?.micr_code || null,
      currency_code_id: customer?.bank_details?.[0]?.currency_code_id || null
    })
  }, [customer])

  const handle = {
    onSubmit: (data: any) => {
      dispatch(customerActions.setBankDetails(data))

      const apiPayload: AddCustomerI = {
        sub_type_id: customerDetails?.sub_type_id || 'bfea64dc-227a-48d4-b436-a759d004ecf9',
        account_name: customerDetails?.account_name || null,
        first_name: customerDetails?.first_name || null,
        last_name: customerDetails?.last_name || null,
        email: customerDetails?.email || null,
        phone_number: customerDetails?.phone_number || null,
        address_line_1: customerDetails?.address_line_1 || null,
        address_line_2: customerDetails?.address_line_2 || null,
        country_id: customerDetails?.country_id || null,
        state_id: customerDetails?.state_id || null,
        city_id: customerDetails?.city_id || null,
        pincode: customerDetails?.pincode || null,
        account_group_id: customerDetails?.account_group_id || null,
        description: customerDetails?.description || null,
        gst_number: taxationDetails?.gst_number || null,
        gst_reg_type: taxationDetails?.gst_reg_type || null,
        pan_number: taxationDetails?.pan_number || null,
        tan_number: taxationDetails?.tan_number || null,
        organization_type_id: taxationDetails?.organization_type_id || null,

        shipping_address: {
          address_line_1: billingShippingDetails?.shippingAddressLine1 || null,
          address_line_2: billingShippingDetails?.shippingAddressLine2 || null,
          country_id: billingShippingDetails?.shippingCountry || null,
          state_id: billingShippingDetails?.shippingState || null,
          city_id: billingShippingDetails?.shippingCity || null,
          pincode: billingShippingDetails?.shippingPincode || null,
          address_type: 'Shipping'
        },

        bank_details: {
          bank_name: data?.bank_name || null,
          account_name: data?.account_name || null,
          account_number: data.account_number || null,
          bank_branch_name: data?.bank_branch_name || null,
          ifsc_code: data?.ifsc_code || null,
          swift_code: data?.swift_code || null,
          micr_code: data?.micr_code || null,
          ...(data?.currency_code_id ? { currency_code_id: data?.currency_code_id } : {})
        },
        is_customer: true,
        ...(leadData ? { lead_id: leadData?.leadId, contact_id: leadData?.contactId } : {}),
        ...(customerDetails?.contact_id ? { contact_id: customerDetails?.contact_id } : {})
      }

      if (id) {
        dispatch(updateCustomer({ id: id, payload: apiPayload }))
          .unwrap()
          .then(res => {
            console.log('🚀 ~ res:', res)
            navigate('/customers')
          })
      } else {
        dispatch(addCustomer(apiPayload))
          .unwrap()
          .then(res => {
            console.log('🚀 ~ res:', res)
            if (leadData) {
              navigate(`/lead/details/${leadData?.leadId}`)
            } else {
              navigate('/customers')
            }
          })
      }
    },
    onBack: () => {
      onBack()
    }
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handle.onSubmit)}>
        <Row>
          <Col md={12}>
            <CommonInput name='account_name' label='Account Holder Name *' />
          </Col>
          <Col md={6}>
            <CommonInput name='bank_name' label='Bank Name *' />
          </Col>
          <Col md={6}>
            <CommonInput name='bank_branch_name' label='Bank Branch Name' />
          </Col>
          <Col md={6}>
            <CommonInput name='account_number' label='Account Number *' />
          </Col>
          <Col md={6}>
            <CommonInput name='ifsc_code' label='IFSC Code' />
          </Col>
          <Col md={6}>
            <CommonInput name='swift_code' label='Swift Code' />
          </Col>
          <Col md={6}>
            <CommonInput name='micr_code' label='MICR Code' />
          </Col>
          <Col md={6}>
            <SingleAutoCompleteControl name='currency_code_id' label='Currency' options={currencyOptions} />
          </Col>
        </Row>

        <div className='multi_action_btn_div'>
          <NormalButton title='Back' variant='outlined' type='button' onClick={handle.onBack} />
          <NormalButton title='Submit' type='submit' />
        </div>
      </form>
    </FormProvider>
  )
}

export default CustomerBankDetails
