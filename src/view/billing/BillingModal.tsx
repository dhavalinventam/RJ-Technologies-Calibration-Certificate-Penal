import { Col, Row } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'
import { CheckboxControl, CommonInput, SingleAutoCompleteControl } from '@/components/form'
import { Icon } from '@iconify/react'
import { useAddressNestedOptions } from '@/hooks/use-address-nested'

interface IProps {
  watch: any
  setValue: any
}

const AddEditBillingModal = ({ watch, setValue }: IProps) => {
  const isSameAddress = watch('is_same_address')

  const handleFieldReset = (value: boolean) => {
    setValue('is_same_address', value)

    if (value) {
      const billingAddress = watch('billing_address')

      setValue('shipping_address', {
        address_line_1: billingAddress.address_line_1,
        address_line_2: billingAddress.address_line_2,
        city_id: billingAddress.city_id,
        state_id: billingAddress.state_id,
        country_id: billingAddress.country_id,
        pincode: billingAddress.pincode,
        address_type: 'Shipping'
      })
    } else {
      setValue('shipping_address', {
        address_line_1: '',
        address_line_2: '',
        city_id: '',
        state_id: '',
        country_id: '',
        pincode: '',
        address_type: 'Shipping'
      })
    }
  }

  return (
    <Row className='align-items-baseline'>
      <Col md={6}>
        <div
          className='d-flex justify-content-between align-items-center mb-3 flex-1 flex-wrap flex-md-nowrap'
          style={{
            // paddingBottom: '10px',
            borderRadius: '4px',
            borderBottom: '2px solid rgba(var(--color-sf-primary))'
          }}
        >
          <div className='d-flex align-items-center gap-1'>
            <Icon icon='eva:question-mark-circle-outline' width='16' height='16' />
            <h6 className='m-0'> Billing Address</h6>
          </div>
          <CheckboxControl
            name='is_same_address'
            label='Same shipping address?'
            onChange={(e: any) => {
              const value = e.target.checked
              handleFieldReset(value)
            }}
          />
        </div>
        <AddressComponent fieldPrefix='billing_address' />
      </Col>

      {!isSameAddress && (
        <Col md={6}>
          <div
            className='d-flex justify-content-between align-items-center mb-3 flex-1 flex-wrap flex-md-nowrap'
            style={{
              paddingBottom: '10px',
              borderRadius: '4px',
              borderBottom: '2px solid rgba(var(--color-sf-primary))'
            }}
          >
            <div className='d-flex align-items-center gap-1'>
              <Icon icon='eva:question-mark-circle-outline' width='16' height='16' />
              <h6 className='m-0'> Shipping Address</h6>
            </div>
          </div>
          <AddressComponent fieldPrefix='shipping_address' />
        </Col>
      )}
    </Row>
  )
}

const AddressComponent: React.FC<{ fieldPrefix: string }> = ({ fieldPrefix }) => {
  const methods = useFormContext()

  // Use the useAddressOptions hook with the fieldPrefix
  const { countryOptions, stateOptions, cityOptions, handleCountryChange, handleStateChange, handleCityChange } =
    useAddressNestedOptions(methods, fieldPrefix)

  const NewAddressLine1 = `${fieldPrefix}.address_line_1`
  const NewAddressLine2 = `${fieldPrefix}.address_line_2`
  const NewCountryId = `${fieldPrefix}.country_id`
  const NewStateId = `${fieldPrefix}.state_id`
  const NewCityId = `${fieldPrefix}.city_id`
  const NewPinCode = `${fieldPrefix}.pincode`

  return (
    <Row>
      <Col lg={6}>
        <CommonInput name={NewAddressLine1} label='House No / Flat / Building Name' />
      </Col>

      <Col lg={6}>
        <CommonInput name={NewAddressLine2} label='Area / Sector/ Locality' />
      </Col>
      <Col lg={6}>
        <SingleAutoCompleteControl
          name={NewCountryId}
          label='Country'
          options={countryOptions}
          onChange={(name: string, value: any) => handleCountryChange(name, value)}
        />
      </Col>

      <Col lg={6}>
        <SingleAutoCompleteControl
          name={NewStateId}
          label='State'
          options={stateOptions}
          disabled={!methods.watch(NewCountryId)}
          onChange={(name: string, value: any) => handleStateChange(name, value)}
        />
      </Col>

      <Col lg={6}>
        <SingleAutoCompleteControl
          name={NewCityId}
          label='City'
          options={cityOptions}
          disabled={!methods.watch(NewStateId)}
          onChange={(name: string, value: any) => handleCityChange(name, value)}
        />
      </Col>
      <Col lg={6}>
        <CommonInput name={NewPinCode} label='Pincode' />
      </Col>
    </Row>
  )
}

export default AddEditBillingModal
