import { Col, Row } from 'react-bootstrap'
import { FormProvider, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { customerActions } from '@/redux/slices/customerSlice'
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from '@/redux/slices/masterDataSlice'
import { useEffect, useMemo, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerBillingShippingSchema } from '@/utils/validation'
import CommonCheckbox from '@/components/form/checkbox-control'
import { NormalButton } from '@/components'
import { CommonInput, SingleAutoCompleteControl } from '@/components/form'

interface IProps {
  onNext: () => void
  onBack: () => void
}

interface FormValues {
  billingAddressLine1: string
  billingAddressLine2: string
  billingCountry: any
  billingState: any
  billingCity: any
  billingPincode: string
  shippingAddressLine1: string
  shippingAddressLine2: string
  shippingCountry: any
  shippingState: any
  shippingCity: any
  shippingPincode: string
  sameAsCustomerInfo?: boolean
  copyBillingAddress?: boolean
}

const BillingShippingDetails = ({ onNext, onBack }: IProps) => {
  const dispatch = useAppDispatch()
  const { customer, customerDetails, billingShippingDetails } = useAppSelector(({ customer }) => customer)

  const { countries } = useAppSelector(({ masterData }) => masterData)

  const countryOptions = useMemo(() => {
    return countries.map((item: any) => ({ label: item.country_name, value: item.country_id }))
  }, [countries])

  const [billingStateList, setBillingStateList] = useState([])
  const [billingCityList, setBillingCityList] = useState([])

  const [shippingStateList, setShippingStateList] = useState([])
  const [shippingCityList, setShippingCityList] = useState([])

  const defaultValues = {
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCountry: '',
    billingState: '',
    billingCity: '',
    billingPincode: '',
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCountry: '',
    shippingState: '',
    shippingCity: '',
    shippingPincode: '',
    sameAsCustomerInfo: false,
    copyBillingAddress: false
  }

  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(customerBillingShippingSchema)
  })
  const { setValue, watch, handleSubmit, reset } = methods

  useEffect(() => {
    if (customer) {
      reset({
        billingAddressLine1: customer?.addresses?.[0]?.address_line_1 || '',
        billingAddressLine2: customer?.addresses?.[0]?.address_line_2 || '',
        billingCountry: customer?.addresses?.[0]?.country?.country_id || null,
        billingState: customer?.addresses?.[0]?.state?.state_id || null,
        billingCity: customer?.addresses?.[0]?.city?.city_id || null,
        billingPincode: customer?.addresses?.[0]?.pincode || '',
        shippingAddressLine1: customer?.addresses?.[1]?.address_line_1 || '',
        shippingAddressLine2: customer?.addresses?.[1]?.address_line_2 || '',
        shippingCountry: customer?.addresses?.[1]?.country?.country_id || null,
        shippingState: customer?.addresses?.[1]?.state?.state_id,
        shippingCity: customer?.addresses?.[1]?.city?.city_id || null,
        shippingPincode: customer?.addresses?.[1]?.pincode || '',
        sameAsCustomerInfo: billingShippingDetails?.sameAsCustomerInfo || false,
        copyBillingAddress: billingShippingDetails?.copyBillingAddress || false
      })
    }
  }, [customer])

  useEffect(() => {
    if (billingShippingDetails) {
      reset({ ...billingShippingDetails })
    }
  }, [billingShippingDetails])

  const handleCopyCustomerInfo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setValue('billingAddressLine1', customerDetails?.address_line_1 || '', {
        shouldValidate: true
      })
      setValue('billingAddressLine2', customerDetails?.address_line_2 || '', {
        shouldValidate: true
      })
      setValue('billingPincode', customerDetails?.pincode || '', {
        shouldValidate: true
      })

      const country = customerDetails?.country_id
      const state = customerDetails?.state_id
      const city = customerDetails?.city_id

      if (country) {
        setValue('billingCountry', country, { shouldValidate: true })
        setValue('billingState', state, { shouldValidate: true })

        if (state) {
          setValue('billingCity', city, { shouldValidate: true })
        }
      }
    } else {
      setValue('billingAddressLine1', '', { shouldValidate: true })
      setValue('billingAddressLine2', '', { shouldValidate: true })
      setValue('billingPincode', '', { shouldValidate: true })

      setValue('billingCountry', null, { shouldValidate: true })
      setValue('billingState', null, { shouldValidate: true })
      setValue('billingCity', null, { shouldValidate: true })
      setBillingStateList([])
      setBillingCityList([])
    }
  }

  const handleCopyBillingAddress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    if (isChecked) {
      const country = watch('billingCountry')
      const state = watch('billingState')
      const city = watch('billingCity')

      // Copy billing to shipping fields
      setValue('shippingAddressLine1', watch('billingAddressLine1') || '', {
        shouldValidate: true
      })
      setValue('shippingAddressLine2', watch('billingAddressLine2') || '', {
        shouldValidate: true
      })
      setValue('shippingPincode', watch('billingPincode') || '', {
        shouldValidate: true
      })
      setValue('shippingCountry', country, { shouldValidate: true })

      if (country) {
        setValue('shippingState', state || null, { shouldValidate: true })

        if (state) {
          setValue('shippingCity', city || null, { shouldValidate: true })
        }
      }
    } else {
      // Clear shipping fields
      setValue('shippingAddressLine1', '', { shouldValidate: true })
      setValue('shippingAddressLine2', '', { shouldValidate: true })
      setValue('shippingPincode', '', { shouldValidate: true })
      setValue('shippingCountry', null, { shouldValidate: true })
      setValue('shippingState', null, { shouldValidate: true })
      setValue('shippingCity', null, { shouldValidate: true })
      setShippingStateList([])
      setShippingCityList([])
    }
  }

  useEffect(() => {
    Promise.all([dispatch(fetchCountries())])
  }, [])

  // Watchers
  const billingCountry = watch('billingCountry')
  const billingState = watch('billingState')
  const shippingCountry = watch('shippingCountry')
  const shippingState = watch('shippingState')

  useEffect(() => {
    if (billingCountry) {
      dispatch(fetchStatesByCountryId(billingCountry))
        .unwrap()
        .then(res => {
          setBillingStateList(res.map((item: any) => ({ label: item.state_name, value: item.state_id })))
        })
    }
  }, [billingCountry])

  useEffect(() => {
    if (billingState) {
      dispatch(fetchCitiesByStateId(billingState))
        .unwrap()
        .then(res => {
          setBillingCityList(res.map((item: any) => ({ label: item.city_name, value: item.city_id })))
        })
    }
  }, [billingState])

  useEffect(() => {
    if (shippingCountry) {
      dispatch(fetchStatesByCountryId(shippingCountry))
        .unwrap()
        .then(res => {
          setShippingStateList(res.map((item: any) => ({ label: item.state_name, value: item.state_id })))
        })
    }
  }, [shippingCountry])

  useEffect(() => {
    if (shippingState) {
      dispatch(fetchCitiesByStateId(shippingState))
        .unwrap()
        .then(res => {
          setShippingCityList(res.map((item: any) => ({ label: item.city_name, value: item.city_id })))
        })
    }
  }, [shippingState])

  const handle = {
    onSubmit: (data: any) => {
      dispatch(customerActions.setBillingShippingDetails(data))
      onNext()
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handle.onSubmit)}>
        <Row>
          <Col md={6}>
            <div
              className='d-flex justify-content-between align-items-center mb-3'
              style={{
                paddingBottom: '10px',
                borderRadius: '4px',
                borderBottom: '2px solid rgb(var(--color-sf-primary))'
              }}
            >
              <h6 className='m-0'>Billing Address</h6>
              <CommonCheckbox
                name='sameAsCustomerInfo'
                label='Same as Customer Info'
                onChange={handleCopyCustomerInfo}
              />
            </div>
            <AddressSection
              prefix='billing'
              countries={countryOptions}
              stateList={billingStateList}
              cityList={billingCityList}
              setValue={setValue}
              watch={watch}
              disabled={false}
            />
          </Col>

          <Col md={6}>
            <div
              className='d-flex justify-content-between align-items-center mb-3'
              style={{
                paddingBottom: '10px',
                borderRadius: '4px',
                borderBottom: '2px solid rgb(var(--color-sf-primary))'
              }}
            >
              <h6 className='m-0'>Shipping Address</h6>
              <CommonCheckbox
                name='copyBillingAddress'
                label='Copy Billing Address'
                onChange={handleCopyBillingAddress}
              />
            </div>
            <AddressSection
              prefix='shipping'
              countries={countryOptions}
              stateList={shippingStateList}
              cityList={shippingCityList}
              setValue={setValue}
              watch={watch}
              disabled={false}
            />
          </Col>
        </Row>

        <div className='multi_action_btn_div'>
          <NormalButton title='Back' variant='outlined' type='button' onClick={onBack} />
          <NormalButton title='Save And Continue' type='submit' />
        </div>
      </form>
    </FormProvider>
  )
}

export default BillingShippingDetails

interface AddressSectionProps {
  prefix: 'billing' | 'shipping'
  countries: any[]
  stateList: any[]
  cityList: any[]
  setValue: any
  watch: any
  title?: string
  disabled?: boolean
}

const AddressSection = ({
  prefix,
  countries,
  stateList,
  cityList,
  setValue,
  watch,
  title,
  disabled = false
}: AddressSectionProps) => {
  const country = watch(`${prefix}Country`)
  const state = watch(`${prefix}State`)

  return (
    <>
      {title && <h6 className='mb-3'>{title}</h6>}
      <Col md={12}>
        <CommonInput name={`${prefix}AddressLine1`} label='House No / Flat / Building Name *' disabled={disabled} />
      </Col>
      <Col md={12}>
        <CommonInput name={`${prefix}AddressLine2`} label='Area / Sector / Locality *' disabled={disabled} />
      </Col>
      <Col md={12}>
        <SingleAutoCompleteControl
          name={`${prefix}Country`}
          label='Country *'
          options={countries}
          onChange={(e: any, value: any) => {
            setValue(`${prefix}Country`, value, { shouldValidate: true })
            setValue(`${prefix}State`, null)
            setValue(`${prefix}City`, null)
          }}
          disabled={disabled}
        />
      </Col>
      <Col md={12}>
        <SingleAutoCompleteControl
          name={`${prefix}State`}
          label='State *'
          options={stateList}
          onChange={(e: any, value: any) => {
            setValue(`${prefix}State`, value, { shouldValidate: true })
            setValue(`${prefix}City`, null)
          }}
          disabled={!country || disabled}
        />
      </Col>
      <Col md={12}>
        <SingleAutoCompleteControl
          name={`${prefix}City`}
          label='City *'
          options={cityList}
          onChange={(e: any, value: any) => setValue(`${prefix}City`, value, { shouldValidate: true })}
          disabled={!state || disabled}
        />
      </Col>
      <Col md={12}>
        <CommonInput name={`${prefix}Pincode`} label='Pincode *' disabled={disabled} />
      </Col>
    </>
  )
}
