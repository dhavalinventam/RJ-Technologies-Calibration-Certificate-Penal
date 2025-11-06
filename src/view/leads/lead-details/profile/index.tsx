import { useState } from 'react'
import { useAppSelector } from '@/redux/redux-hooks'
import { convertTimestampToDate } from '@/utils/dateFormat'
import { renderCurrency } from '@/utils/dataGridCommonFunc'
import './index.scss'
import AccordionComponent from '@/components/accordion'
import { useTranslation } from 'react-i18next'
import { ContactDetail } from './tabs/ContactListTab'
import ProfileTabSection from './tabs'

const LeadProfile = () => {
  const { t } = useTranslation()
  const { lead } = useAppSelector(({ lead }) => lead)
  const [expanded, setExpanded] = useState<boolean>(false)

  const primaryContact = lead?.contacts?.find((contact: any) => contact?.is_primary_in_lead)

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded)
  }

  const accordionHeader = (
    <div className='lead-profile-accordion-header'>
      <div className='header-left'>
        {primaryContact && (
          <ContactDetail
            contact={{
              first_name: primaryContact?.first_name,
              last_name: primaryContact?.last_name,
              phone: primaryContact?.phone?.phone_number,
              email: primaryContact?.email?.email
            }}
          />
        )}
      </div>
      <div className='header-right'>
        <div>
          <span className='label'>{t('lead.budget')}</span>
          <div className='value'>{renderCurrency(lead?.budget)}</div>
        </div>
        <div>
          <span className='label'>{t('lead.receiveDate')}</span>
          <div className='value'>{convertTimestampToDate(lead?.lead_receive_date, 'DD/MM/YYYY') || '--'}</div>
        </div>
        <div>
          <span className='label'>{t('lead.lastContact')}</span>
          <div className='value'>{convertTimestampToDate(lead?.last_contact_date, 'DD/MM/YYYY') || '--'}</div>
        </div>
        <div>
          <span className='label'>{t('lead.source')}</span>
          <div className='value'>{lead?.source_platforms?.name || '--'}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='lead-profile-container'>
      <AccordionComponent summary={accordionHeader} expanded={expanded} onChange={handleChange}>
        <ProfileTabSection />
      </AccordionComponent>
    </div>
  )
}

export default LeadProfile
