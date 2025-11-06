import { useMemo } from 'react'
import LeadDetailTab from './LeadDetailTab'
import ContactListTab from './ContactListTab'
import CommonTabs from '@/components/tabs'
import './index.scss'

const ProfileTabSection = () => {
  const tabData = useMemo(
    () => [
      {
        label: 'Lead Details',
        content: <LeadDetailTab />
      },
      {
        label: 'Contacts & Communication',
        content: <ContactListTab />
      }
    ],
    []
  )

  return (
    <div className='profile-tab-section'>
      <CommonTabs tabs={tabData} variant='fullWidth' defaultTab={0} centered={false} />
    </div>
  )
}

export default ProfileTabSection
