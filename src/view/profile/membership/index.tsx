import { CommonCard } from '@/components'
import { NormalButton } from '@/components'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Membership = () => {
  const { t } = useTranslation()
  return (
    <CommonCard>
      <h6 className='common_card_title'>{t('Membership')}</h6>
      <Row>
        <Col md={12}>
          <div className='user_details_row'>
            <p className='title_left'>{t('CurrentPlan')}</p>
            <p className='user_details'>Essentials Monthly Plan</p>
          </div>
        </Col>
        <Col md={12}>
          <div className='user_details_row'>
            <p className='title_left'>{t('Status')}</p>
            <p className='user_details'>
              <span className='common_outline_btn e-control e-btn e-outline e-primary e-success rounded-5 py-0 px-2 e-lower-case'>
                active
              </span>
            </p>
          </div>
        </Col>
        <Col md={12}>
          <div className='user_details_row'>
            <p className='title_left'>{t('StartDate')}</p>
            <p className='user_details'>7th April 2025</p>
          </div>
        </Col>
        <Col md={12}>
          <div className='user_details_row'>
            <p className='title_left'> {t('RenewalDate')}</p>
            <p className='user_details'>7th May 2025</p>
          </div>
        </Col>
      </Row>
      <div className='mt-auto'>
        <NormalButton title={t('Upgrade')} onClick={() => {}} />
      </div>
    </CommonCard>
  )
}

export default Membership
