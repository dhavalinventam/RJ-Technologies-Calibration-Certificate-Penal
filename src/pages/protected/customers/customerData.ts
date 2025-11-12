export interface Customer {
  id: string
  name: string
  company: string
  location: string
  contactPerson: string
  mobile: string
  email: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

export const CUSTOMER_STORAGE_KEY = 'customers'

const composeLocation = (city?: string, state?: string, country?: string) => {
  const segments = [city, state, country].filter(part => Boolean(part && part.trim().length > 0)) as string[]
  return segments.join(', ')
}

const parseLocation = (location?: string, fallbackCountry = 'India') => {
  if (!location || typeof location !== 'string') {
    return { city: '', state: '', country: fallbackCountry }
  }

  const segments = location
    .split(',')
    .map(segment => segment.trim())
    .filter(Boolean)

  return {
    city: segments[0] || '',
    state: segments[1] || '',
    country: segments[2] || fallbackCountry
  }
}

const createDefaultCustomer = ({
  id,
  name,
  company,
  address = '',
  city = '',
  state = '',
  zip = '',
  country = 'India',
  contactPerson = '—',
  mobile = '—',
  email = '—'
}: {
  id: string
  name: string
  company: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  contactPerson?: string
  mobile?: string
  email?: string
}): Customer => ({
  id,
  name,
  company,
  location: composeLocation(city, state, country),
  contactPerson,
  mobile,
  email,
  address,
  city,
  state,
  zip,
  country
})

export const DEFAULT_CUSTOMERS: Customer[] = [
  createDefaultCustomer({
    id: '1',
    name: 'Amnel',
    company: 'Amnel Pharmaceutical Pvt Ltd',
    address: 'Phase 2, Plot 45, Naroda Industrial Estate',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zip: '382330',
    country: 'India',
    contactPerson: 'Bhavesh Parmar',
    mobile: '9823456789',
    email: 'support@amnelpharma.com'
  }),
  createDefaultCustomer({
    id: '2',
    name: 'Globex Labs',
    company: 'Globex Laboratory Solutions',
    address: '705 Skyline Tech Park, Old Padra Road',
    city: 'Vadodara',
    state: 'Gujarat',
    zip: '390012',
    country: 'India',
    contactPerson: 'Shreyas Trivedi',
    mobile: '9099932211',
    email: 'info@globexlabs.in'
  }),
  createDefaultCustomer({
    id: '3',
    name: 'Vertex Pharma',
    company: 'Vertex Pharmaceuticals LLP',
    address: 'Unit 12, Seaview Corporate Park, MIDC',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400093',
    country: 'India',
    contactPerson: 'Aparna Kulkarni',
    mobile: '9820198765',
    email: 'care@vertexpharma.com'
  }),
  createDefaultCustomer({
    id: '4',
    name: 'Everest Biotech',
    company: 'Everest Biotech Pvt Ltd',
    address: 'Block A-4, Biotech Park, Piplod',
    city: 'Surat',
    state: 'Gujarat',
    zip: '395009',
    country: 'India',
    contactPerson: 'Mitali Vyas',
    mobile: '9375123456',
    email: 'hello@everestbio.com'
  }),
  createDefaultCustomer({
    id: '5',
    name: 'Zenith Industries',
    company: 'Zenith Industrial Solutions',
    address: 'Tower 6, Cluster B, Hinjewadi IT Park',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411057',
    country: 'India',
    contactPerson: 'Gautam Patwardhan',
    mobile: '9970884455',
    email: 'contact@zenithind.in'
  })
]

export const normalizeCustomer = (customer: Customer): Customer => {
  if (!customer) {
    return customer
  }

  const legacyZip = (customer as any).pincode || (customer as any).postalCode || (customer as any).zipCode || ''
  const legacyAddress = (customer as any).addressLine || customer.address || ''
  const derivedFromLocation = parseLocation(customer.location, customer.country || 'India')

  const city = customer.city || derivedFromLocation.city
  const state = customer.state || derivedFromLocation.state
  const country = customer.country || derivedFromLocation.country || 'India'
  const location =
    customer.location && customer.location.trim().length > 0 ? customer.location : composeLocation(city, state, country)

  return {
    ...customer,
    address: legacyAddress,
    city,
    state,
    zip: customer.zip || legacyZip,
    country,
    location
  }
}

export const loadCustomers = (): Customer[] => {
  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (stored) {
      const parsed: Customer[] = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeCustomer)
      }
    }
  } catch (error) {
    console.error('Failed to load customers from storage', error)
  }
  return DEFAULT_CUSTOMERS.map(normalizeCustomer)
}

export const saveCustomers = (customers: Customer[]) => {
  try {
    const normalized = customers.map(normalizeCustomer)
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(normalized))
  } catch (error) {
    console.error('Failed to save customers to storage', error)
  }
}
