import React from 'react'
import { Icon } from '@iconify/react'

interface DiscountOptionData {
  discount_offer_id: string
  discount_type: string
  discount_amount: string | number
  offer_code: string
  offer_value?: string | number
  is_active?: boolean
  start_date?: string
  end_date?: string
}

interface DiscountOptionProps {
  option: {
    label: string
    value: string | number
    data?: DiscountOptionData
  }
}

const DiscountOption: React.FC<DiscountOptionProps> = ({ option }) => {
  const getDiscountIcon = (discountType?: string) => {
    switch (discountType?.toLowerCase()) {
      case 'percentage':
        return 'mdi:percent-circle-outline'
      case 'flat':
        return 'mdi:currency-usd-off'
      case 'buyxgety':
        return 'mdi:gift-outline'
      case 'tiered':
        return 'mdi:layers-outline'
      case 'bogo':
        return 'mdi:buy-n-large'
      case 'bundle':
        return 'mdi:package-variant'
      default:
        return 'mdi:percent-circle-outline'
    }
  }

  const formatDiscountValue = (value?: string | number, type?: string) => {
    if (!value) return ''
    if (type?.toLowerCase() === 'percentage') {
      return `${value}%`
    }
    return value
  }

  const getStatusColor = (isActive?: boolean) => {
    return isActive ? 'rgba(var(--color-sf-success))' : 'rgba(var(--color-sf-danger))'
  }

  const isExpired = (endDate?: string) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
  }

  return (
    <div className='search_details_div w-100'>
      <div className='search_details_title_text'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {option.label}
          {option.data && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Active/Inactive Status */}
              {typeof option.data.is_active !== 'undefined' && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(option.data.is_active),
                    flexShrink: 0
                  }}
                  title={option.data.is_active ? 'Active' : 'Inactive'}
                />
              )}

              {/* Expired Indicator */}
              {isExpired(option.data.end_date) && (
                <div title='Expired'>
                  <Icon
                    icon='mdi:clock-alert-outline'
                    width='14'
                    height='14'
                    style={{ color: 'rgba(var(--color-sf-warning))' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {option.data && (
        <div className='search_details_info_text'>
          <div className='discount-value-container'>
            <Icon icon={getDiscountIcon(option.data.discount_type)} width='16' height='16' className='discount-icon' />
            <span className='discount-value'>
              {formatDiscountValue(option.data.discount_amount, option.data.discount_type)}
            </span>
            <span className='discount-type-badge'>{option.data.discount_type}</span>
          </div>
          {option.data.offer_value && (
            <div className='offer-info'>
              <Icon icon='mdi:gift-outline' width='14' height='14' className='offer-icon' />
              <span>Offer: {option.data.offer_value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DiscountOption
