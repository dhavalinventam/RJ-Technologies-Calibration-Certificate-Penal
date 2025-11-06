import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { getDiscountList } from '@/redux/slices/discountSlice'
import { useAppDispatch } from '@/redux/redux-hooks'
import useProposalCalculation from '@/hooks/useCalculation'
import './OrderSummary.scss'
import ControlledSearchAutoComplete from '@/components/search-autocomplete'
import DiscountOption from '../item-service/DiscountOption'
import { CommonInput } from '@/components/form'
interface OrderSummaryProps {
  title?: string
  prefix?: string
}

const OrderSummary = ({ title, prefix = 'order_details' }: OrderSummaryProps) => {
  const dispatch = useAppDispatch()
  const { control } = useFormContext()

  // Use the calculation hook
  const { handleGlobalDiscountChange, handleAddLessTotalAmountChange, orderSummary } = useProposalCalculation({
    prefix
  })

  const grossTotalAmount = orderSummary.gross_total_amount
  const netTotalAmount = orderSummary.net_total_amount
  const discountValue = orderSummary.discount_total_value
  const beforeTaxAdjustment = orderSummary.before_tax_adjustment
  const addLessTotalAmount = orderSummary.add_less_total_amount

  const fetchDiscountList = useCallback(async ({ search, page }: { search: string; page: number }) => {
    const response = await dispatch(getDiscountList({ search, page, limit: 10 })).unwrap()
    const formattedDiscountList =
      response?.data?.data?.map((item: any) => ({
        label: `${item?.offer_code || ''}`.trim(),
        value: item?.discount_offer_id,
        data: {
          discount_offer_id: item?.discount_offer_id || '',
          discount_type: item?.discount_type || '',
          discount_amount: item?.discount_value || '',
          offer_code: item?.offer_code || '',
          offer_value: item?.offer_value || '',
          is_active: item?.is_active,
          start_date: item?.start_date,
          end_date: item?.end_date
        }
      })) || []
    return {
      data: formattedDiscountList,
      total_records: response?.data?.total_records
    }
  }, [])
  return (
    <div className='order-summary-section mb-4'>
      <div className='order-summary-container'>
        <div className='order-summary-header'>
          <h5 className='order-summary-title'>{title || 'Order Summary'}</h5>
        </div>

        <div className='order-summary-content'>
          {/* Gross Total Section */}
          <div className='summary-row mb-2'>
            <div className='summary-label'>Subtotal</div>
            <p className='mb-0'>₹{grossTotalAmount.toFixed(2)}</p>
          </div>

          {/* Discount Section */}
          <div className='summary-section'>
            <div className='summary-row mb-2'>
              <div className='summary-label'>Discount Coupon</div>
              <ControlledSearchAutoComplete
                name={`discount_id`}
                control={control}
                options={[]}
                label={`Discount`}
                fetchData={fetchDiscountList}
                width={160}
                onChange={value => handleGlobalDiscountChange(value)}
                renderOption={(props, option) => (
                  <li {...props} className='discount-option p-2'>
                    <DiscountOption option={option} />
                  </li>
                )}
              />
            </div>

            <div className='summary-row mb-2'>
              <div className='summary-label'>Discount Value</div>
              {discountValue && <p>₹{discountValue?.toFixed(2)}</p>}
            </div>
          </div>

          {/* Add/Less Total Amount */}
          <div className='summary-row mb-2'>
            <div className='summary-label'>Add/Less Total Amount</div>
            <div className='summary-input'>
              <CommonInput
                name='add_less_total_amount'
                label='0.00'
                type='number'
                style={{ width: '160px', marginBottom: '0' }}
                onChange={(e: any) => handleAddLessTotalAmountChange(e.target?.value)}
              />
            </div>
          </div>

          {/* Amount After Add/Less */}
          <div className='summary-row'>
            <div className='summary-label'>Amount After Add/Less</div>
            <p className='mb-0'>
              ₹{(grossTotalAmount + beforeTaxAdjustment - discountValue + addLessTotalAmount).toFixed(2)}
            </p>
          </div>

          {/* Net Total Amount - Highlighted */}
        </div>
        <div className='summary-row net-total-row'>
          <div className='summary-label net-total-label'>Net Total Amount</div>
          <div className='summary-value net-total-value'>₹{netTotalAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
