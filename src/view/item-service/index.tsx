import { memo, useCallback, useState } from 'react'
import { Table } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'
import { showToastError } from '@/utils/helper'
import { useAppDispatch } from '@/redux/redux-hooks'
import { getProductServiceList, getProductVariantListByProductId } from '@/redux/slices/productSlice'
import { getUomList } from '@/redux/slices/uomSlice'
import { getDiscountList } from '@/redux/slices/discountSlice'
import { orderDetailsDefaults } from '@/utils/initialFormValues'
import useProposalCalculation from '@/hooks/useCalculation'
import { generateUUID } from '@/utils/common'
import { NormalButton } from '@/components'
import { CommonInput } from '@/components/form'
import ControlledSearchAutoComplete from '@/components/search-autocomplete'
import DiscountOption from './DiscountOption'
import { AddCircle, Delete } from '@mui/icons-material'
import './index.scss'

const ItemServiceTable = () => {
  const dispatch = useAppDispatch()
  const {
    setValue,
    getValues,
    watch,
    control,
    formState: { errors }
  } = useFormContext()

  const orderServices = watch('order_details') || []
  let visibleIndex = 0

  const filterOrderServices = orderServices.filter((item: any) => !item.is_delete)

  const orderDetailsErrors = errors?.order_details as any
  const [lastChangeProductId, setLastChangeProductId] = useState<number | null>(null)
  // Use the calculation hook
  const { handleProductChange, handleProductDiscountChange } = useProposalCalculation({ prefix: 'order_details' })

  const handleAddRow = () => {
    const currentItemServices = getValues('order_details')?.filter((item: any) => !item.is_delete) || []

    // Validate last item has all required fields filled
    const lastItem = currentItemServices[currentItemServices.length - 1]
    if (!lastItem?.product_service_id || !lastItem?.variant_id || !lastItem?.uom_id) {
      showToastError('Please fill in all the fields before adding a new row.')
      return
    }

    setValue('order_details', [
      ...getValues('order_details'),
      {
        ...orderDetailsDefaults,
        order_details_uuid: generateUUID()
      }
    ])
  }

  const handleDeleteRow = (values: any) => {
    const allItems = getValues('order_details') || []
    const updatedItems = allItems.map((item: any) =>
      item.order_details_uuid === values.order_details_uuid ? { ...item, is_delete: true } : item
    )
    setValue('order_details', updatedItems)
  }

  const fetchProductVariants = useCallback(
    async ({ search, page }: { search: string; page: number }) => {
      if (lastChangeProductId !== lastChangeProductId) {
        return { data: [], total_records: 0 }
      }
      const product_service_id = watch(`order_details.${lastChangeProductId}.product_service_id`)?.value
      try {
        const response = await dispatch(
          getProductVariantListByProductId({
            product_service_id: product_service_id,
            search: search,
            page: page,
            limit: 10
          })
        ).unwrap()
        const formattedProductVariants =
          response?.data?.product_variant?.map((item: any) => ({
            label: item?.variant_name?.trim(),
            value: item?.variant_id
          })) || []

        return {
          data: formattedProductVariants,
          total_records: response?.data?.total_records || 0
        }
      } catch (err) {
        console.error('Failed to fetch variants:', err)
        setLastChangeProductId(null)
        return { data: [], total_records: 0 }
      }
    },
    [lastChangeProductId, watch(`order_details.${lastChangeProductId}.product_service_id`)]
  )

  const fetchProducts = useCallback(async ({ search, page }: { search: string; page: number }) => {
    const response = await dispatch(getProductServiceList({ search, page, limit: 10, type: '' })).unwrap()
    const formattedProducts =
      response?.data?.data?.map((item: any) => ({
        label: `${item?.name || ''}`.trim(),
        value: item?.product_service_id
      })) || []
    return {
      data: formattedProducts,
      total_records: response?.data?.total_records
    }
  }, [])

  const fetchUomList = useCallback(async ({ search, page }: { search: string; page: number }) => {
    const response = await dispatch(getUomList({ search, page, limit: 10 })).unwrap()
    const formattedUomList =
      response?.data?.data?.map((item: any) => ({
        label: `${item?.abbreviation || ''}`.trim(),
        value: item?.uom_id
      })) || []
    return {
      data: formattedUomList,
      total_records: response?.data?.total_records
    }
  }, [])

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
    <>
      <div className='add_product_or_service_table_main_div table_main_row' style={{ position: 'relative', zIndex: 0 }}>
        <Table responsive>
          <thead className='invite_user_table_header'>
            <tr className='d-flex'>
              <th className='table_header_text_title w-100 d-flex'>
                <span className='common_card_title d-flex align-items-center mb-0'>Add Order Details</span>
              </th>
              <th className='sticky_btn'>
                <div className='d-flex justify-content-between align-items-center '>
                  <NormalButton
                    iconOnly
                    type='button'
                    onClick={handleAddRow}
                    tooltip='Add Order Detail'
                    tooltipArrow
                    icon={<AddCircle />}
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className='invite_user_table_body'>
            {orderServices.map((item: any, index: number) => {
              if (item.is_delete) {
                return
              }
              visibleIndex++
              return (
                <tr key={`invite-user-${item.order_details_uuid}`}>
                  <td>
                    <span className='d-flex align-items-center h-100'>{visibleIndex}</span>
                  </td>
                  <td style={{ display: 'none' }}>
                    <CommonInput name={`order_details.${index}.index`} />
                  </td>
                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <ControlledSearchAutoComplete
                        name={`order_details.${index}.product_service_id`}
                        control={control}
                        options={[]}
                        label={`Products *`}
                        fetchData={fetchProducts}
                        itemsPerPage={10}
                        error={Boolean(orderDetailsErrors?.[index]?.product_service_id)}
                        onChange={value => {
                          setValue(`order_details.${index}.product_service_id`, value)
                          setValue(`order_details.${index}.variant_id`, null)
                          setLastChangeProductId(index)
                        }}
                        helperText={orderDetailsErrors?.[index]?.product_service_id?.message ?? ''}
                      />
                    </div>
                  </td>
                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <ControlledSearchAutoComplete
                        name={`order_details.${index}.variant_id`}
                        control={control}
                        options={[]}
                        label={`Product Variant *`}
                        fetchData={fetchProductVariants}
                        itemsPerPage={10}
                        error={Boolean(orderDetailsErrors?.[index]?.variant_id)}
                        helperText={orderDetailsErrors?.[index]?.variant_id?.message ?? ''}
                      />
                    </div>
                  </td>
                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <CommonInput name={`order_details.${index}.description`} label='Description *' />
                    </div>
                  </td>
                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <ControlledSearchAutoComplete
                        name={`order_details.${index}.uom_id`}
                        control={control}
                        options={[]}
                        label={`UOM *`}
                        fetchData={fetchUomList}
                        itemsPerPage={10}
                        onChange={value => console.log(value)}
                        error={Boolean(orderDetailsErrors?.[index]?.uom_id)}
                        helperText={orderDetailsErrors?.[index]?.uom_id?.message ?? ''}
                      />
                    </div>
                  </td>

                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <CommonInput
                        name={`order_details.${index}.quantity`}
                        label='QTY'
                        type='number'
                        onChange={() => {
                          const rate = Number(getValues(`order_details.${index}.rate`)) || 0
                          handleProductChange(index, 'rate', rate)
                        }}
                      />
                    </div>
                  </td>

                  <td>
                    <div className='d-flex gap-2 text_filed text_filed_dropdown'>
                      <CommonInput
                        name={`order_details.${index}.rate`}
                        label='Rate'
                        type='number'
                        onChange={() => {
                          const quantity = Number(getValues(`order_details.${index}.quantity`)) || 0
                          handleProductChange(index, 'quantity', quantity)
                        }}
                      />
                    </div>
                  </td>

                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <CommonInput
                        name={`order_details.${index}.gross_amount`}
                        label='Amount (Auto)'
                        type='number'
                        readonly
                      />
                    </div>
                  </td>
                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <ControlledSearchAutoComplete
                        name={`order_details.${index}.discount_id`}
                        control={control}
                        options={[]}
                        label={`Discount`}
                        fetchData={fetchDiscountList}
                        onChange={value => {
                          handleProductDiscountChange(index, value)
                        }}
                        renderOption={(props, option) => (
                          <li {...props} className='discount-option p-2'>
                            <DiscountOption option={option} />
                          </li>
                        )}
                      />
                    </div>
                  </td>
                  <td>
                    <div className='text_filed text_filed_dropdown'>
                      <CommonInput
                        name={`order_details.${index}.net_amount`}
                        label='Net Amount (Auto)'
                        type='number'
                        readonly
                      />
                    </div>
                  </td>
                  <td className='sticky_btn'>
                    {filterOrderServices.length > 1 && (
                      <NormalButton
                        type='button'
                        iconOnly
                        onClick={() => handleDeleteRow(item)}
                        tooltip='Delete Order Detail'
                        tooltipArrow
                        tooltipPlacement='bottom'
                        icon={<Delete />}
                        color='error'
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default memo(ItemServiceTable)
