export interface GetDataI {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: string
}

export interface SignInI {
  loginId: string
  password: string
  remember_me?: boolean
}

export interface SignUpI {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
  contact_no: number
}

export interface ResetPasswordI {
  password: string
  confirm_password: string
  token: string
}

export interface VerifyOtpI {
  loginId: string
  emailToken: string
  contactNumberToken: string
  tokenRequired: boolean
  email: boolean
  contactNumber: boolean
}

export interface ResendOtpI {
  loginId: string
}

export interface ChangePasswordI {
  current_password: string
  new_password: string
  confirm_password: string
  id: string
}

export interface DeleteUserI {
  id: string
  organization_id: string
  branch_id: string
}

export interface LogoutI {
  refresh_token?: string
}

export interface SelectOrganizationI {
  year: string
  organization_id: any
  branch_id: any
  role_id: any
  organization_public_id: any
}

export interface AttachmentI {
  filename: string
  key: string
  attachment_id: string
  content_type: string
  size: number
  visibility: string
}

export interface AddOrganizationI {
  tenant_id: string
  organization_type_id: string
  industry_id: string
  language_id?: string
  country_id: string
  address_type?: string
  pincode?: string
  address_line_1?: string
  address_line_2?: string
  landmark?: string
  address_contact_person_name?: string
  address_contact_person_number?: string
  state_id?: string
  city_id?: string
  alias?: string
  organization_name: string
  branch_name: string
  logo?: string
  contact_persons: Record<string, string>
  phone_number: string
  email: string
  website: string
  address_details: any
  gst_id: string
  is_gst_required: boolean
  gst_registration_type: string
  currency_code_id: string
  pan_number: string
  msme_number: string
  business_licenses: Record<string, string>
  whatsapp?: string
  social_media?: Record<string, string>
  account_details?: Record<string, string>
}

export interface UpdateOrganizationI {
  id: string
  branch_id: string
  payload: Partial<AddOrganizationI>
}

export interface AddBranchI {
  branch_name: string
  is_head_office: boolean
  status: string
  email: string
  phone_number: string
  whatsapp: string
  website: string
  social_media: Record<string, any>
  contact_persons: Record<string, any>
  address_details: Record<string, any>
  organization_id: string
  address_type: string
  pincode: string
  address_line_1: string
  address_line_2: string
  landmark: string
  address_contact_person_name: string
  address_contact_person_number: string
  country_id: string
  state_id: string
  city_id: string
  language_id: string
  currency_code_id: string
  pan_number: string
  gst_id: string
  is_gst_required: boolean
  msme_number: string
  gst_registration_type: string
  business_licenses: Record<string, any>
  account_details: Record<string, any>
}

export interface AddOrganizationBranchI {
  organization_id: string
  payload: AddBranchI
}

export interface UpdateOrganizationBranchI {
  id: string | number
  payload: Partial<AddBranchI>
}

export interface GetTagsI extends GetDataI {
  module: string
}

export interface AddTagI {
  name: string
  color: string
  module: string
}

export interface UpdateTagI {
  id: string
  payload: Partial<AddTagI>
}

export interface AddProjectI {
  name: string
  sr_number: string
  description: string
  estimated_time: string
  total_rate: number
  start_date: number
  end_date: number
  customer_id: string
  attachments: AttachmentI[]
  priority: string
  status_id: string
  contract_start_date: number
  contract_end_date: number
  sequence: number
  referral_person_name: string
  referral_type: string
  referral_amount: number
  tag_ids: string[]
  assigned_to: string[]
}

export interface UpdateProjectI {
  id: string
  payload: Partial<AddProjectI>
}

export interface UpdateProjectStatusI {
  id: string
  payload: any
}

export interface AddStatusI {
  name: string
  color?: string
  icon?: string
  sequence?: number
  module: string
  organization_id?: string
  organization_public_id?: string
}

export interface UpdateStatusI {
  id: string
  payload: AddStatusI
}

export interface DeleteStatusI {
  id: string
  payload: {
    module: string
    organizationId: string
  }
}

export interface UpdateTaskStatusI {
  id: string
  payload: {
    status_id: string
    sequence?: number
  }
}

export interface DeleteTaskI {
  id: string
  payload: {
    SourceId?: string
    SourceType?: string
  }
}

export interface GetLeadTasksI extends GetDataI {
  SourceId: string
  SourceType: string
}

export interface GetTaskByIdI {
  id: string
  payload?: {
    SourceId: string
    SourceType: string
  }
}

export interface GetTasksListI extends GetDataI {
  is_with_respect_branch: number
}

export interface AddTaskI {
  task_public_id: string
  source_id?: string | null
  source_type?: string | null
  department?: string
  priority?: string
  category?: string
  task_title: string
  task_description?: string
  status_id?: string
  assigned_to?: string[]
  is_completed?: boolean
  start_date?: number // Unix timestamp
  due_date?: number // Unix timestamp
  reminder_date?: number // Unix timestamp
  tag_ids?: string[]
  comment?: string
}

export interface UpdateTaskI {
  id: string
  payload: Partial<AddTaskI>
}

export interface GetCommentI {
  id: string
  taskId: string
  payload: GetDataI
}

export interface AddCommnetI {
  id: string
  taskId: string
  payload: {
    comment: string
  }
}

export interface GetLeadTaskHistoryI {
  id: string
  taskId: string
  payload: GetDataI
}

export interface GetStatusListByModuleI extends GetDataI {
  module: string
}

export interface UpdateUserI {
  first_name: string
  last_name: string
  email: string
  contact_no: number
  gender: 'Male' | 'Female' | 'Other'
  date_of_birth?: any
  language_id: string
  time_zone_id: string
  address_id: string
  address_type: 'Billing' | 'Shipping'
  pincode: string
  address_line_1: string
  address_line_2?: string
  state_id: string
  city_id: string
  country_id: string
}

export interface AddLeadFollowupI {
  id: string
  payload: {
    note_title: string
    note_description: string
  }
}

export interface GetLeadFollowupsI {
  id: string
  payload: GetDataI
}

export interface GetLeadActivityLogsI {
  id: string
  payload: GetDataI
}

export interface GetLeadRemindersI {
  id: string
  payload: GetDataI
}

export interface GetLeadReminderByIdI {
  id: string
  reminderId: string
}

export interface AddLeadReminderI {
  id: string
  payload: {
    reminder_title: string
    reminder_description?: string
    reminder_mode: string[]
    start_date?: number
    end_date?: number
    is_recurring: boolean
    frequency?: string
    time?: string
    template?: string
    person_data?: any
    status?: boolean
    assigned_to?: string[]
  }
}

export interface UpdateLeadReminderI {
  id: string
  reminderId: string
  payload: {
    reminder_title: string
    reminder_description?: string
    reminder_mode: string[]
    start_date?: number
    end_date?: number
    is_recurring: boolean
    frequency?: string
    time?: string
    template?: string
    person_data?: any
    status?: boolean
    assigned_to?: string[]
  }
}

export interface AddSourcePlatformI {
  name: string
  icon?: string
  organization_id?: string
  organization_public_id?: string
}

export interface UpdateSourcePlatformI {
  id: string
  payload: Partial<AddSourcePlatformI>
}

export interface CreateContactPayload {
  first_name: string
  last_name: string
  dob?: string
  position?: string
  description?: string
  visibility?: string
  source?: string
  image?: string
  email: Array<{
    email: string
    email_label: string
    is_primary_email: boolean
    email_id?: string
  }>
  phone_number: Array<{
    phone_number: string
    phone_label: string
    is_primary_phone: boolean
    phone_id?: string
  }>
  company_id?: string
  company_name?: string
  gst_number?: string
  social_media?: {
    skype?: string
    twitter?: string
    facebook?: string
    linkedin?: string
    whatsapp?: string
    instagram?: string
  }
  address_id?: string
  address_type?: string
  address_line_1?: string
  landmark?: string
  state_id?: string
  city_id?: string
  country_id?: string
  pincode?: string
  tag_ids?: string[]
  assigned_to?: string[]
}

export interface UpdateContactI {
  id: string
  payload: Partial<CreateContactPayload>
}

export interface AddContactToLeadI {
  id: string
  payload: {
    first_name: string
    last_name: string
    position: string
    email: string
    phone_number: string
  }
}

export interface DeleteContactFromLeadI {
  id: string
  contact_id: string
  leadContactCompanyId: string
}

export interface OrderDetailsI {
  order_details_uuid: string
  order_details_id: string
  index: number
  sequence: number
  product_service_id: string
  variant_id: string
  description: string
  quantity: number
  uom_id: string
  rate: number
  gross_amount: number
  discount_id: string // check
  discount_rate: number //check
  discount_amount: number //check
  tax_id: string //check
  tax_rate: number //check
  tax_value: number //chec
  add_less_amount: number
  taxable_amount: number
  tax_amount: number
  net_amount: number
  is_delete: boolean
  is_update: boolean
}
export interface AddProposalI {
  order_type: string
  source_type: string
  order_number: string
  is_same_address: boolean
  source_id: string
  contact_id: string
  order_date: string
  valid_until: string
  remarks: string
  status: string
  tag_ids: string[]
  discount_id: string
  discount_rate: number
  discount_amount: number
  tax_id: string
  tax_rate: number
  tax_value: number
  before_tax_adjustment: number
  after_tax_adjustment: number
  gross_total_amount: number
  add_less_total_amount: number
  taxable_total_amount: number
  tax_total_amount: number
  roundof_total_amount: number
  net_total_amount: number
  order_details: OrderDetailsI[]
}

export interface UpdateProposalI {
  id: string
  payload: Partial<AddProposalI>
}

export interface AddEstimateI {
  order_type: string
  source_type: string
  order_number: string
  source_id: string
  contact_id: string
  order_date: string
  valid_until: string
  remarks: string
  status: string
  tag_ids: string[]
  discount_id: string
  discount_rate: number
  discount_amount: number
  tax_id: string
  tax_rate: number
  tax_value: number
  before_tax_adjustment: number
  after_tax_adjustment: number
  gross_total_amount: number
  add_less_total_amount: number
  taxable_total_amount: number
  tax_total_amount: number
  roundof_total_amount: number
  net_total_amount: number
  order_details: OrderDetailsI[]
  is_same_address: boolean
  billing_address: {
    address_line_1: string
    address_line_2: string
    city_id: string
    state_id: string
    country_id: string
    pincode: string
    landmark: string
    address_type: string
  }
  shipping_address: {
    address_line_1: string
    address_line_2: string
    city_id: string
    state_id: string
    country_id: string
    pincode: string
    landmark: string
    address_type: string
  }
}

export interface UpdateEstimateI {
  id: string
  payload: Partial<AddEstimateI>
}
// Master Data

// Category Master
export interface AddCategoryI {
  category_name: string
  parent_id: string
}

export interface DeleteCategoryI {
  id: string
}

export interface UpdateCategoryI {
  id: string
  category_name: string
  parent_id: string
}

// Product Type Master

export interface GetProductTypeI extends GetDataI {
  type?: 'product' | 'service'
}

export interface AddProductTypeI {
  type: 'product' | 'service'
  name: string
}

export interface UpdateProductTypeI {
  id: string
  payload: Partial<AddProductTypeI>
}

// Product Service Master

// Uom Master

export interface AddUomI {
  name: string
  description: string
  base_unit: boolean
  standard_unit_id: string
  conversion_factor: number
  abbreviation: string
  uom_family: string
  parent_conversion_id: string
  conversion_to_base: number
  is_active: boolean
  variant_id: string
  is_base: boolean
}

export interface GetUomListI extends GetDataI {
  uomFamily?: string
}

export interface UpdateUomI {
  id: string
  payload: Partial<AddUomI>
}

export interface UomState {
  loading: boolean
  error: string | null
  uomDetails: any
  productTypeList: any
  uomList: any
  standardUomList: any
}

// Pricing Master
export interface AddPriceI {
  currency_code: string
  rate: number
  effective_from: any
  effective_to?: any
  variant_id: string
  price_type: string
  customer_supplier_id?: string | null
  remarks?: string | null
  is_active: boolean
}

export interface UpdatePriceI {
  id: string
  payload: Partial<AddPriceI>
}

// Warehouse Master

export interface AddWarehouseI {
  warehouse_code: string
  warehouse_name: string
  parent_warehouse: string
  address_line_1: string
  landmark: string
  country_id: string
  state_id: string
}

export interface UpdateWarehouseI {
  id: string
  payload: Partial<AddWarehouseI>
}

// Discount Master

export interface AddDiscountI {
  offer_name: string
  offer_code: string
  description: string
  discount_type: string
  discount_value: number
  buy_quantity: number
  get_quantity: number
  applicable_on: string
  applicable_entity_ids: string[]
  min_order_amount: number
  max_discount_amount: number
  currency_id: string
  start_date: number
  end_date: number
  usage_limit_per_customer: number
  total_usage_limit: number
  auto_apply: boolean
  is_active: boolean
  is_stackable: boolean
}

export interface UpdateDiscountI {
  id: string
  payload: Partial<AddDiscountI>
}

//Product Attributes Value Master

export interface AddAttributeI {
  attribute_name_id: string
  attribute_value: string
  description?: string
}

export interface UpdateAttributeI {
  id: string
  payload: Partial<AddAttributeI>
}

export interface DeleteAttributeI {
  id: string
}

// Page state
export interface CategoryState {
  loading: boolean
  error: string | null
  CategoryList: any
  categoryDetails: any | null
  parentCategoryList: any
}

export interface ProductTypeState {
  loading: boolean
  productTypeList: any
  error: string | null
  productTypeDetails: any | null
}

export interface WarehouseState {
  loading: boolean
  error: string | null
  warehouseDetails: any
}

export interface ProductVariantState {
  productVariantList: any
  productVariantDetails: any
  productVariantData: any
  attachments: any
  loading: boolean
  error: string | null
}

export interface PriceState {
  priceTypeList: any
  loading: boolean
  error: string | null
  priceDetails: any | null
  priceTypeEnum: any
}

export interface DiscountState {
  loading: boolean
  error: string | null
  discountDetails: any
}

export interface ProductState {
  loading: boolean
  error: string | null
  productServiceDetails: any | null
  attributeList: any
  productServiceAttachment: any[]
  productList: any
  productVariantList: []
}

export interface GetProductVariantListByProductIdI extends GetDataI {
  product_service_id: string
}

export interface GetDashboardDataI {
  is_with_respect_user?: number
  is_with_respect_branch?: number
}

export interface GetDashboardTableDataI extends GetDataI {
  is_with_respect_user?: number
  is_with_respect_branch?: number
  startDatetime?: number
  endDatetime?: number
}

export interface AttributesState {
  loading: boolean
  error: string | null
  productAttributesNameList: any
  attributeValuesList: any
}
export interface GetCustomerListI extends GetDataI {
  company_id?: string
}

export interface AddCustomerI {
  sub_type_id: string
  account_name: string
  customer_access_user_id?: any
  is_transport?: boolean
  description?: string
  agent_id?: string
  sales_man_id?: string
  website?: string
  account_group_id: string
  credit_days?: number
  credit_limit?: number
  pan_number: string
  tan_number: string
  gst_reg_type: string
  organization_type_id: string
  bank_details: {
    bank_name: string
    account_name: string
    account_number: string
    bank_branch_name: string
    ifsc_code?: string
    swift_code?: string
    micr_code?: string
    currency_code_id?: string
  }
  first_name: string
  last_name: string
  dob?: number
  position?: string
  role?: string
  visibility?: 'public' | 'private'
  source?: string
  image?: string
  currency?: string
  email?: {
    email: string
    email_label: string
    is_primary_email: boolean
  }[]
  phone_number?: {
    phone_number: string
    phone_label: string
    is_primary_phone: boolean
  }[]
  company_name?: string
  gst_number?: string
  industry?: string
  address_type?: 'Billing' | 'Shipping'
  address_line_1?: string
  address_line_2?: string
  landmark?: string
  state_id?: string
  city_id?: string
  pincode?: string
  country_id?: string
  shipping_address?: {
    address_line_1?: string
    address_line_2?: string
    landmark?: string
    state_id?: string
    city_id?: string
    pincode?: string
    country_id?: string
    address_type?: 'Billing' | 'Shipping'
  }
  company_id?: string
  address_id?: string
  lead_id?: string
  tag_ids?: string[]
  is_customer?: boolean
}

export interface UpdateCustomerI {
  id: string
  payload: Partial<AddCustomerI>
}

export interface AddProductServiceI {
  product_type_id?: string
  name: string
  product_sku?: string
  product_hsn_tax_id?: string
  code?: string
  description?: string
  is_active: boolean
  is_purchasable: boolean
  type?: string
  category_id?: string
  attachments: AttachmentI[]
  variants: {
    base_uom_id?: string
    description?: string
    variant_sku: string
    variant_name?: string
    hsn_tax_id?: string
    stock_management?: boolean
    allow_backorders?: boolean
    is_low_stock_notification?: boolean
    low_stock_threshold_quantity?: number
    is_physical?: boolean
    is_default?: boolean
    media_uri?: string
    dimensions?: any
    expiry_date?: number
    warranty_months?: number
    warranty_notes?: string
    default_warranty_id?: string
    variant_attributes: {
      attribute_name_id: string
      attribute_value_id: string
    }[]
    prices?: {
      currency_code?: string
      rate?: number
      effective_from?: number
      effective_to?: number
      price_type?: string
      remarks?: string
      is_active?: boolean
      customer_id?: string
      supplier_id?: string
    }[]
    variant_uom_conversions: {
      uom_id: string
      conversion_to_base: number
      parent_conversion_id?: string
      tare_weight_per_unit?: number
      is_active?: boolean
    }[]
    attachments?: AttachmentI[]
  }[]
}

export interface UpdateProductServiceI {
  id: string
  payload: Partial<AddProductServiceI>
}
