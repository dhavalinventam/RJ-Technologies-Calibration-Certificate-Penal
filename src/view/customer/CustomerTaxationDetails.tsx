import { Col, Row } from 'react-bootstrap'
import data from '@/data/dataSource.json'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { customerTaxationSchema } from '@/utils/validation'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { customerActions } from '@/redux/slices/customerSlice'
import { useEffect } from 'react'
import { CommonInput, SingleAutoCompleteControl } from '@/components/form'
import { NormalButton } from '@/components'

interface IProps {
  onNext: () => void
  onBack: () => void
}

interface FormValues {
  gst_number: string
  gst_reg_type: string
  pan_number: string
  tan_number: string
  organization_type_id: string
}

const CustomerTaxationDetails = ({ onNext, onBack }: IProps) => {
  const dispatch = useAppDispatch()
  const { customer, taxationDetails } = useAppSelector(({ customer }) => customer)
  const GSTTypeOptions = data['GSTType']
  const OrganizationTypeOptions = data['Organization']

  const defaultValues: FormValues = {
    gst_number: '',
    gst_reg_type: '',
    pan_number: '',
    tan_number: '',
    organization_type_id: ''
  }

  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(customerTaxationSchema as any)
  })

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (customer) {
      reset({
        gst_number: customer?.account_master_details?.gst_number || null,
        gst_reg_type: customer?.account_master_details?.gst_reg_type || null,
        pan_number: customer?.account_master_details?.pan_number || null,
        tan_number: customer?.account_master_details?.tan_number || null,
        organization_type_id: customer?.account_master_details?.organization_type_id || null
      })
    }
  }, [customer])

  useEffect(() => {
    if (taxationDetails) {
      reset({ ...taxationDetails })
    }
  }, [taxationDetails])

  const handle = {
    onSubmit: (data: FormValues) => {
      dispatch(customerActions.setTaxationDetails(data))
      onNext()
    }
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handle.onSubmit)}>
        <Row>
          <Col md={6}>
            <div className='d-flex gap-2'>
              <CommonInput name='gst_number' label='GST Number *' />
              <div>
                <NormalButton title='Verify' />
              </div>
            </div>
          </Col>
          <Col md={6}>
            <SingleAutoCompleteControl name='gst_reg_type' label='GST Registration Type *' options={GSTTypeOptions} />
          </Col>
          <Col md={6}>
            <CommonInput name='pan_number' label='PAN Number *' />
          </Col>
          <Col md={6}>
            <CommonInput name='tan_number' label='TAN Number *' />
          </Col>
          <Col md={6}>
            <SingleAutoCompleteControl
              name='organization_type_id'
              label='Organization Type *'
              options={OrganizationTypeOptions}
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

export default CustomerTaxationDetails
