import { CommonCard } from '@/components'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const BillingDetails = () => {
  const { t } = useTranslation()
  return (
    <CommonCard>
      <h6 className='common_card_title'>{t('BillingDetails')}</h6>
      <Row>
        <Col md={6} sm={12} className='filed_space_div user_details_row'>
          <p className='title_left'>{t('BillingAddress')}</p>
          <p className='user_details'>123 Tech Street, Surat, Gujrat</p>
        </Col>

        {/* Transaction History */}
        <Col md={6} sm={12} className='filed_space_div user_details_row'>
          <p className='title_left'>{t('TransactionHistory')}</p>
          <p className='user_details'>All Payments Successful</p>
        </Col>

        {/* Payment Method */}
        <Col md={6} sm={12} className='filed_space_div user_details_row'>
          <p className='title_left'>{t('PaymentMethod')}</p>
          <p className='user_details'>UPI (Smith@okhdfcbank)</p>
        </Col>

        {/* GST Number */}
        <Col md={6} sm={12} className='filed_space_div user_details_row'>
          <p className='title_left'>{t('GSTNumber')}</p>
          <p className='user_details'>24AABCP1234F1Z8</p>
        </Col>

        {/* Billing Email */}
        <Col md={6} sm={12} className='filed_space_div user_details_row'>
          <p className='title_left'>{t('BillingEmail')}</p>
          <p className='user_details'>smith@example.com</p>
        </Col>

        {/* Auto-Renewal */}
        <Col md={6} sm={12} className='filed_space_div user_details_row'>
          <p className='title_left'>{t('AutoRenewal')}</p>
          <p className='user_details'>Enabled</p>
        </Col>

        {/* Invoices */}
        <Col md={6} sm={12} className='filed_space_div user_details_row'>
          <p className='title_left'>{t('Invoices')}</p>
          <p className='user_details'>Last Invoice: March 2, 2025</p>
        </Col>
      </Row>
    </CommonCard>
  )
}

export default BillingDetails
