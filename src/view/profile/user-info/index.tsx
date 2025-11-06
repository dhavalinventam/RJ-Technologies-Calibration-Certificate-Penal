import { Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { renderDate } from '@/utils/dataGridCommonFunc'

const UserInfo = ({ user }: { user: any }) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col lg={6} md={6}>
        <div className='filed_space_div user_details_row'>
          <p className='title_left'>{t('Email')}</p>
          <p className='user_details'>{user?.email}</p>
        </div>
      </Col>
      <Col lg={6} md={6}>
        <div className='filed_space_div user_details_row'>
          <p className='title_left'>{t('Gender')}</p>
          <p className='user_details'>{user?.gender || '-'}</p>
        </div>
      </Col>
      <Col lg={6} md={6}>
        <div className='filed_space_div user_details_row'>
          <p className='title_left'>{t('PhoneNumber')}</p>
          <p className='user_details'>{user?.contact_no}</p>
        </div>
      </Col>
      <Col lg={6} md={6}>
        <div className='filed_space_div user_details_row'>
          <p className='title_left'>{t('DateOfBirth')}</p>
          <div className='user_details'>{renderDate(user?.date_of_birth)}</div>
        </div>
      </Col>
      <Col lg={6} md={6}>
        <div className='filed_space_div user_details_row'>
          <p className='title_left'>{t('Address')}</p>
          <p className='user_details'>
            {!user?.address?.address_line_1 && !user?.address?.address_line_2
              ? '-'
              : user?.address?.address_line_1 + ',' + user?.address?.address_line_2}
          </p>
        </div>
      </Col>
      <Col lg={6} md={6}>
        <div className='filed_space_div user_details_row'>
          <p className='title_left'>{t('LanguagePreference')}</p>
          <p className='user_details'>{user?.language?.language_name || '-'}</p>
        </div>
      </Col>
    </Row>
  )
}

export default UserInfo
