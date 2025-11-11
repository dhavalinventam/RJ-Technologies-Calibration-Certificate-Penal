export interface Customer {
  id: string
  name: string
  company: string
  location: string
  contactPerson: string
  mobile: string
  email: string
}

export const CUSTOMER_STORAGE_KEY = 'customers'

export const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Amnel',
    company: 'Amnel Pharmaceutical Pvt Ltd',
    location: 'Ahmedabad, Gujarat',
    contactPerson: 'Urmil Patel',
    mobile: '9876543210',
    email: 'urmil.patel@amnel.com'
  },
  {
    id: '2',
    name: 'Globex Labs',
    company: 'Globex Laboratory Solutions',
    location: 'Vadodara, Gujarat',
    contactPerson: 'Rekha Sharma',
    mobile: '9825034567',
    email: 'rekha.sharma@globexlabs.in'
  },
  {
    id: '3',
    name: 'Vertex Pharma',
    company: 'Vertex Pharmaceuticals LLP',
    location: 'Mumbai, Maharashtra',
    contactPerson: 'Rohan Desai',
    mobile: '9898076543',
    email: 'rohan.desai@vertexpharma.com'
  },
  {
    id: '4',
    name: 'Everest Biotech',
    company: 'Everest Biotech Pvt Ltd',
    location: 'Surat, Gujarat',
    contactPerson: 'Nisha Shah',
    mobile: '9012304567',
    email: 'nisha.shah@everestbio.com'
  },
  {
    id: '5',
    name: 'Zenith Industries',
    company: 'Zenith Industrial Solutions',
    location: 'Pune, Maharashtra',
    contactPerson: 'Ajay Kulkarni',
    mobile: '9123456780',
    email: 'ajay.kulkarni@zenithind.in'
  }
]

export const loadCustomers = (): Customer[] => {
  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (stored) {
      const parsed: Customer[] = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load customers from storage', error)
  }
  return DEFAULT_CUSTOMERS
}

export const saveCustomers = (customers: Customer[]) => {
  try {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers))
  } catch (error) {
    console.error('Failed to save customers to storage', error)
  }
}
