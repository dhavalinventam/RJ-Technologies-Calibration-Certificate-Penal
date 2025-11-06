import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { renderAssignedUsers, renderCurrency, renderHTML } from '@/utils/dataGridCommonFunc'
import { convertTimestampToDate } from '@/utils/dateFormat'
import { Col, Row } from 'react-bootstrap'
import { getLeadById } from '@/redux/slices/leadSlice'
import { TagGroup } from '@/components/tag'
import { useTranslation } from 'react-i18next'
import { capitalizeWords } from '@/utils/common'
import { NormalButton } from '@/components'
import { Edit } from '@mui/icons-material'
import LeadFormView from '@/pages/protected/leads/form'

const LeadDetailTab = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [isView, setIsView] = useState(false)
  const { lead } = useAppSelector(({ lead }) => lead)

  const updateLead = () => {
    if (lead?.lead_id) {
      dispatch(getLeadById(lead?.lead_id))
    }
    setIsView(false)
  }

  return (
    <div className='lead-detail-tab'>
      <div className='tab-content-header'>
        {!isView && (
          <NormalButton
            icon={<Edit />}
            onClick={() => {
              setIsView(true)
            }}
            iconOnly
          />
        )}
      </div>
      {isView ? (
        <LeadFormView onUpdate={updateLead} onClose={() => setIsView(false)} />
      ) : (
        <Row className='list'>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.leadNumber')}</span>
            <div className='value'>{lead?.sr_number || '--'}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.budget')}</span>
            <div className='value'>{renderCurrency(lead?.budget)}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.receiveDate')}</span>
            <div className='value'>{convertTimestampToDate(lead?.lead_receive_date, 'DD/MM/YYYY') || '--'}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.lastContact')}</span>
            <div className='value'>{convertTimestampToDate(lead?.last_contact_date, 'DD/MM/YYYY') || '--'}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.source')}</span>
            <div className='value'>{lead?.source_platforms?.name || '--'}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.status')}</span>
            <div className='value'>{lead?.status?.name || '--'}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.priority')}</span>
            <div className='value'>{capitalizeWords(lead?.priority) || '--'}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.assignedTo')}</span>
            <div className='value assigned_user_main'>{renderAssignedUsers(lead?.assigned_to)}</div>
          </Col>
          <Col sm={6} md={4} className='detail-item'>
            <span className='label'>{t('lead.tags')}</span>
            <div className='value'>
              {lead?.tags?.length > 0 ? <TagGroup tags={lead?.tags || []} size='medium' /> : '--'}
            </div>
          </Col>
          <Col sm={12} md={12} className='detail-item'>
            <span className='label'>{t('lead.description')}</span>
            <div className='value description'>{renderHTML(lead?.details) || '--'}</div>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default LeadDetailTab
