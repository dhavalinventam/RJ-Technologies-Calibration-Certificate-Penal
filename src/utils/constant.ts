export const TOKEN = 'token'
export const CUR_ADDRESS = 'cur_address'
export const REFRESH_TOKEN = 'refresh_token'
export const CONTACT_VERIFY_TOKEN = 'contact_no_verification_token'
export const EMAIL_VERIFY_TOKEN = 'email_verification_token'
export const USER = 'user'
export const CONTACT_VERIFIED = 'contact_no_verified'
export const ORGANIZATIONS = 'organizations'
export const FIRST_ORGANIZATION = 'first_organisation'
export const ITEMS_PER_PAGE = 10

export const ORGANIZATION_PAGE_TITLE = {
  ORGANIZATION: 'Organizations',
  ADD: 'Add Organization',
  ORGANIZATION_BRANCH: 'Organization Branch',
  ORGANIZATION_PROFILE: 'Organization Profile'
}

export const LEAD_TITLE = {
  LEAD: 'Lead',
  LEAD_PROFILE: 'Lead Profile',
  LEAD_STATUS: 'Lead Status',
  LEAD_KANBAN: 'Lead Kanban',
  LEAD_TASK: 'Lead Task',
  LEAD_ESTIMATE: 'Lead Estimate',
  LEAD_FOLLOW_UP: 'Lead Follow Up',
  LEAD_ATTACHMENT: 'Lead Attachment',
  LEAD_ACTIVITY: 'Lead Activity',
  LEAD_ADD: 'Add Lead',
  LEAD_EDIT: 'Edit Lead'
}

export const SOURCE_TYPE = {
  LEAD: 'lead',
  CONTACT: 'contact',
  TASK: 'task'
}

export const LEAD_REMINDER = {
  LEAD_SOURCE_TYPE: 'lead',
  LEAD_MODULE: 'Lead'
}

export const ReminderMode = {
  EMAIL: 'email',
  SMS: 'sms',
  CALL: 'call',
  TASK: 'task'
}

export const Frequency = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
}

export const frequencyOptions = [
  { value: Frequency.DAY, label: 'Day' },
  { value: Frequency.WEEK, label: 'Week' },
  { value: Frequency.MONTH, label: 'Month' }
]

export const reminderModeOptions = [
  { value: ReminderMode.EMAIL, label: 'Email' },
  { value: ReminderMode.SMS, label: 'SMS' },
  { value: ReminderMode.CALL, label: 'Call' },
  { value: ReminderMode.TASK, label: 'TASK' }
]

export const leadSources = [
  { label: 'Facebook', value: 'Facebook' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Twitter', value: 'Twitter' },
  { label: 'LinkedIn', value: 'LinkedIn' },
  { label: 'YouTube', value: 'YouTube' }
]

export const priorityOptions: any = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]

export const departmentOptions = [
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Development', value: 'Development' },
  { label: 'Customer Support', value: 'Customer Support' }
]

export const categoryOptions = [
  { label: 'Feature', value: 'feature' },
  { label: 'Bug', value: 'bug' },
  { label: 'Improvement', value: 'improvement' },
  { label: 'Research', value: 'research' },
  { label: 'Testing', value: 'testing' }
]

export const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Cancelled', value: 'cancelled' }
]

export const sourceTypeOptions = [
  { label: 'Lead', value: 'lead' },
  { label: 'Project', value: 'project' }
]

export const sourceTypeOptionsForSale = [
  { label: 'Lead', value: 'lead' },
  { label: 'Product', value: 'product' }
]

export const ORDER_BY: any = {
  descending: 'DESC',
  ascending: 'ASC'
}

export const designationOptions = [
  { label: 'Manager', value: 'Manager' },
  { label: 'Team Lead', value: 'Team Lead' },
  {
    label: 'Software Engineer',
    value: 'Software Engineer'
  },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'Product Owner', value: 'Product Owner' }
]

export const TagModule = {
  LEAD: 'LEAD',
  PROJECT: 'PROJECT',
  ESTIMATE: 'ESTIMATE',
  PROPOSAL: 'PROPOSAL'
}

export const statusModule = {
  LEAD: 'lead',
  PROJECT: 'project',
  TASK: 'task'
}

export const ENUMS = {
  BILLING: 'Billing'
}

export const cookiesOptions = {
  path: '/',
  secure: false, // Only send over HTTPS
  sameSite: 'Strict',
  expires: 1 // 1 day expiry
}

// export const cookiesOptions = {
//   path: "/",
//   secure: window.location.protocol === "https:", // Secure only on HTTPS
//   sameSite: "None", // Allow cross-origin cookies
//   expires: 1, // 1-day expiry
// };

export const squarePaletteColors = {
  custom1: [
    '#b80000',
    '#db3e00',
    '#fccb00',
    '#008b02',
    '#006b76',
    '#1273de',
    '#004dcf',
    '#5300eb',
    '#eb9694',
    '#fad0c3',
    '#fef3bd',
    '#c1e1c5',
    '#bedadc',
    '#c4def6',
    '#bed3f3',
    '#d4c4fb'
  ]
}

export const priorityColors = [
  {
    label: 'High',
    value: 'high',
    color: '#E63946',
    icon: 'material-symbols:keyboard-double-arrow-up'
  }, // Red Up Arrow
  {
    label: 'Medium',
    value: 'medium',
    color: '#FF9F1C',
    icon: 'material-symbols:keyboard-double-arrow-down'
  }, // Yellow Equal Bars
  {
    label: 'Low',
    value: 'low',
    color: '#0B3D91',
    icon: 'material-symbols:keyboard-double-arrow-down'
  } // Blue Down Arrow
]

export const commands = [
  {
    type: 'Edit',
    buttonOption: { cssClass: 'e-info', iconCss: 'e-icons e-edit' }
  },
  {
    type: 'Delete',
    buttonOption: { cssClass: 'e-danger', iconCss: 'e-icons e-delete' }
  }
]

export const publicRoutes = ['/signin', '/', '/forgotpassword', '/otpverify']

export const orderStatus = [
  {
    key: 'draft',
    value: 'Draft',
    color: '#457B9D',
    icon: '⭕'
  },
  {
    key: 'pending',
    value: 'Pending',
    color: '#457B9D',
    icon: '⭕'
  },
  {
    key: 'in_progress',
    value: 'In Progress',
    color: '#457B9D',
    icon: '⭕'
  },
  {
    key: 'completed',
    value: 'Completed',
    color: '#457B9D',
    icon: '⭕'
  },
  {
    key: 'cancelled',
    value: 'Cancelled',
    color: '#457B9D',
    icon: '⭕'
  }
]
export const productTypeList = [
  { id: 'product', name: 'Product' },
  { id: 'service', name: 'Service' }
]

export const UomFamily = [
  { label: 'Weight', value: 'weight' },
  { label: 'Length', value: 'length' },
  { label: 'Volume', value: 'volume' },
  { label: 'Quantity', value: 'quantity' },
  { label: 'Time', value: 'time' }
]

export const applicableOnOptions = [
  { label: 'All', value: 'all' },
  { label: 'Product', value: 'product' },
  { label: 'Product Variant', value: 'product_variant' },
  { label: 'Category', value: 'category' }
]

export const discountTypeOptions = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Buy X Get Y', value: 'buyxgety' },
  { label: 'Flat', value: 'flat' },
  { label: 'Tiered', value: 'tiered' },
  { label: 'BOGO', value: 'bogo' },
  { label: 'Bundle', value: 'bundle' }
]
