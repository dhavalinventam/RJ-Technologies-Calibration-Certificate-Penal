import { generateId, generateUUID } from './common'
import { AddEstimateI, AddProposalI } from '@/types/api-paylod-types'

const proposalFormDefaults = {
  order_type: 'proposal',
  source_type: 'lead',
  order_number: generateId('PRO', 8) || '',
  is_same_address: false,
  source_id: '',
  contact_id: '',
  order_date: '',
  valid_until: '',
  remarks: '',
  status: 'draft',
  tag_ids: [],
  assigned_to: [],
  discount_id: '',
  discount_rate: 0,
  discount_amount: 0,
  tax_id: '8738a90f-242b-4b8e-a46c-cd4fb0e67d40', // dummy tax id because we have not implement yet, in future might came
  tax_rate: 0,
  tax_value: 0,
  before_tax_adjustment: 0,
  after_tax_adjustment: 0,
  gross_total_amount: 0,
  add_less_total_amount: 0,
  taxable_total_amount: 0,
  tax_total_amount: 0,
  roundof_total_amount: 0,
  net_total_amount: 0,
  order_details: [
    {
      order_details_uuid: generateUUID(),
      order_details_id: '',
      sequence: 1,
      index: 1,
      product_service_id: '',
      variant_id: '',
      description: '',
      quantity: 0,
      uom_id: '',
      rate: 0,
      gross_amount: 0,
      discount_id: '', // check
      discount_rate: 0, //check
      discount_amount: 0, //check
      tax_id: '8738a90f-242b-4b8e-a46c-cd4fb0e67d40', // dummy tax id because we have not implement yet, in future might came
      tax_rate: 0,
      tax_value: 0,
      add_less_amount: 0,
      taxable_amount: 0,
      tax_amount: 0,
      net_amount: 0,
      is_delete: false,
      is_update: false
    }
  ]
} as AddProposalI

const orderDetailsDefaults = {
  order_details_uuid: generateUUID(),
  index: 1,
  sequence: 1,
  product_service_id: '',
  variant_id: '',
  description: '',
  quantity: 0,
  uom_id: '',
  rate: 0,
  gross_amount: 0,
  discount_id: '',
  discount_rate: 0,
  discount_amount: 0,
  tax_id: '8738a90f-242b-4b8e-a46c-cd4fb0e67d40',
  tax_rate: 10,
  tax_value: 100,
  add_less_amount: 0,
  taxable_amount: 0,
  tax_amount: 0,
  net_amount: 0,
  is_delete: false,
  is_update: false
}

const estimateFormDefaults = {
  order_type: 'estimate',
  source_type: 'lead',
  order_number: generateId('EST', 8) || '',
  is_same_address: false,
  source_id: '',
  contact_id: '',
  order_date: '',
  valid_until: '',
  remarks: '',
  status: 'Draft',
  tag_ids: [],
  discount_id: '',
  discount_rate: 0,
  discount_amount: 0,
  tax_id: '8738a90f-242b-4b8e-a46c-cd4fb0e67d40', // dummy tax id because we have not implement yet, in future might came
  tax_rate: 0,
  tax_value: 0,
  before_tax_adjustment: 0,
  after_tax_adjustment: 0,
  gross_total_amount: 0,
  add_less_total_amount: 0,
  taxable_total_amount: 0,
  tax_total_amount: 0,
  roundof_total_amount: 0,
  net_total_amount: 0,
  order_details: [
    {
      order_details_uuid: generateUUID(),
      order_details_id: '',
      index: 1,
      sequence: 1,
      product_service_id: '',
      variant_id: '',
      description: '',
      quantity: 0,
      uom_id: '',
      rate: 0,
      gross_amount: 0,
      discount_id: '', // check
      discount_rate: 0, //check
      discount_amount: 0, //check
      tax_id: '8738a90f-242b-4b8e-a46c-cd4fb0e67d40', // dummy tax id because we have not implement yet, in future might came
      tax_rate: 0,
      tax_value: 0,
      add_less_amount: 0,
      taxable_amount: 0,
      tax_amount: 0,
      net_amount: 0,
      is_delete: false,
      is_update: false
    }
  ],
  billing_address: {
    address_line_1: '',
    address_line_2: '',
    city_id: '',
    state_id: '',
    country_id: '',
    pincode: '',
    landmark: '',
    address_type: 'Billing'
  },
  shipping_address: {
    address_line_1: '',
    address_line_2: '',
    city_id: '',
    state_id: '',
    country_id: '',
    pincode: '',
    landmark: '',
    address_type: 'Shipping'
  }
} as AddEstimateI

export { proposalFormDefaults, orderDetailsDefaults, estimateFormDefaults }
