import { useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

interface ProductItem {
  quantity: number
  rate: number
  gross_amount: number
  discount_id: string
  discount_rate: number
  discount_amount: number
  net_amount: number
  [key: string]: any
}

interface OrderSummary {
  gross_total_amount: number
  before_tax_adjustment: number
  discount_total_value: number
  add_less_total_amount: number
  net_total_amount: number
}

export const useProposalCalculation = ({ prefix = 'order_details' }: { prefix?: string }) => {
  const { watch, setValue, getValues } = useFormContext()

  // Watch form values
  const orderDetailsValue = watch(prefix) || []
  const orderDetails = orderDetailsValue?.filter((item: any) => !item.is_delete) || []
  const globalDiscountId = watch('discount_id')
  const globalDiscountRate = watch('discount_rate') || 0
  const globalDiscountValue = watch('discount_amount') || 0
  const beforeTaxAdjustment = watch('before_tax_adjustment') || 0
  const addLessTotalAmount = watch('add_less_total_amount') || 0

  // Calculate individual product amounts
  const calculateProductAmounts = useCallback(
    (product: ProductItem, index: number) => {
      const quantity = Number(product.quantity) || 0
      const rate = Number(product.rate) || 0

      const grossAmount = quantity * rate

      // Initially set net_amount equal to gross_amount when no discount is applied
      let netAmount = grossAmount
      let productDiscountValue = 0

      // Only apply discount if discount_id is selected
      if (product.discount_id && product.discount_rate) {
        productDiscountValue = (grossAmount * Number(product.discount_rate)) / 100
        netAmount = grossAmount - productDiscountValue
      }

      // Update form values
      setValue(`${prefix}.${index}.gross_amount`, grossAmount)
      setValue(`${prefix}.${index}.discount_amount`, productDiscountValue)
      setValue(`${prefix}.${index}.net_amount`, Math.round(netAmount))

      return {
        grossAmount,
        productDiscountValue,
        netAmount
      }
    },
    [setValue]
  )

  // Calculate order summary
  const calculateOrderSummary = useCallback(() => {
    const products = getValues(prefix)?.filter((item: any) => !item.is_delete) || []

    // Calculate subtotal from all products' net amounts (which are initially equal to gross amounts)
    const grossTotalAmount = products.reduce((total: number, product: ProductItem) => {
      return total + (Number(product.net_amount) || 0)
    }, 0)

    // Apply before tax adjustment
    const beforeAdjustment = Number(beforeTaxAdjustment) || 0
    const amountAfterBeforeAdjustment = grossTotalAmount + beforeAdjustment

    // Apply global discount only if discount_id is selected
    let globalDiscountTotal = 0
    if (globalDiscountId && globalDiscountRate > 0) {
      globalDiscountTotal = (amountAfterBeforeAdjustment * globalDiscountRate) / 100
    }

    // Apply add/less total amount
    const addLessAmount = Number(addLessTotalAmount) || 0
    const amountAfterDiscount = amountAfterBeforeAdjustment - globalDiscountTotal

    // Calculate final net total
    const netTotalAmount = amountAfterDiscount + addLessAmount

    // Update form values
    setValue('gross_total_amount', grossTotalAmount)
    setValue('discount_amount', globalDiscountTotal)
    setValue('net_total_amount', Math.round(netTotalAmount))

    return {
      gross_total_amount: grossTotalAmount,
      before_tax_adjustment: beforeAdjustment,
      discount_total_value: globalDiscountTotal,
      add_less_total_amount: addLessAmount,
      net_total_amount: netTotalAmount
    }
  }, [getValues, setValue, globalDiscountId, globalDiscountRate, beforeTaxAdjustment, addLessTotalAmount])

  // Handle product field changes
  const handleProductChange = useCallback(
    (index: number, field: string, value: any) => {
      const product = getValues(`${prefix}.${index}`)

      if (product) {
        // Update the specific field
        setValue(`${prefix}.${index}.${field}`, value)

        // Immediately recalculate product amounts if quantity or rate changed
        if (field === 'quantity' || field === 'rate') {
          // Create updated product object with new value
          // const updatedProduct = {
          //   ...product,
          //   [field]: value,
          // };

          // Immediately calculate and update amounts
          const quantity = Number(field === 'quantity' ? value : product.quantity) || 0
          const rate = Number(field === 'rate' ? value : product.rate) || 0
          const grossAmount = quantity * rate

          // Set gross amount immediately
          setValue(`${prefix}.${index}.gross_amount`, grossAmount)

          // Calculate net amount (initially same as gross amount if no discount)
          let netAmount = grossAmount
          if (product.discount_id && product.discount_rate) {
            const productDiscountValue = (grossAmount * Number(product.discount_rate)) / 100
            setValue(`${prefix}.${index}.discount_amount`, productDiscountValue)
            netAmount = grossAmount - productDiscountValue
          } else {
            setValue(`${prefix}.${index}.discount_amount`, 0)
          }

          // Set net amount immediately
          setValue(`${prefix}.${index}.net_amount`, Math.round(netAmount))

          // Recalculate order summary
          setTimeout(() => {
            calculateOrderSummary()
          }, 50)
        }
      }
    },
    [getValues, setValue, calculateOrderSummary]
  )

  // Handle discount selection for individual products
  const handleProductDiscountChange = useCallback(
    (index: number, discountData: any) => {
      const product = getValues(`${prefix}.${index}`)

      let updatedProduct = { ...product }

      if (discountData) {
        // Discount added or changed
        setValue(`${prefix}.${index}.discount_id`, discountData)
        setValue(`${prefix}.${index}.discount_rate`, Number(discountData.data?.discount_amount) || 0)

        updatedProduct = {
          ...updatedProduct,
          discount_id: discountData.value,
          discount_rate: Number(discountData.data?.discount_amount) || 0
        }
      } else {
        // Discount removed
        setValue(`${prefix}.${index}.discount_id`, null)
        setValue(`${prefix}.${index}.discount_rate`, 0)

        updatedProduct = {
          ...updatedProduct,
          discount_id: null,
          discount_rate: 0
        }
      }

      // Recalculate product amounts
      calculateProductAmounts(updatedProduct, index)

      // Recalculate order summary after small delay
      setTimeout(() => {
        calculateOrderSummary()
      }, 50)
    },
    [getValues, setValue, calculateProductAmounts, calculateOrderSummary]
  )

  // Handle global discount change
  const handleGlobalDiscountChange = useCallback(
    (discountData: any) => {
      if (discountData) {
        setValue('discount_id', discountData)
        setValue('discount_rate', Number(discountData.data?.discount_amount) || 0)

        // Immediately recalculate order summary with new discount
        setTimeout(() => {
          calculateOrderSummary()
        }, 50)
      }
    },
    [setValue, calculateOrderSummary]
  )

  // Handle add/less total amount change
  const handleAddLessTotalAmountChange = useCallback(
    (value: any) => {
      setValue('add_less_total_amount', Number(value) || 0)

      // Immediately recalculate order summary
      setTimeout(() => {
        calculateOrderSummary()
      }, 50)
    },
    [setValue, calculateOrderSummary]
  )

  // Recalculate all when order details change
  useEffect(() => {
    if (orderDetails.length > 0) {
      // Recalculate all products
      orderDetails
        .filter((item: any) => !item.is_delete)
        .forEach((product: ProductItem, index: number) => {
          const quantity = Number(product.quantity) || 0
          const rate = Number(product.rate) || 0
          const grossAmount = quantity * rate

          // Set gross amount
          setValue(`${prefix}.${index}.gross_amount`, grossAmount)

          // Calculate net amount
          let netAmount = grossAmount
          if (product.discount_id && product.discount_rate) {
            const productDiscountValue = (grossAmount * Number(product.discount_rate)) / 100

            setValue(`${prefix}.${index}.discount_amount`, productDiscountValue)
            netAmount = grossAmount - productDiscountValue
          } else {
            setValue(`${prefix}.${index}.discount_amount`, 0)
          }

          // Set net amount
          setValue(`${prefix}.${index}.net_amount`, Math.round(netAmount))
        })

      // Recalculate order summary
      setTimeout(() => {
        calculateOrderSummary()
      }, 100)
    }
  }, [orderDetails.length, setValue, calculateOrderSummary])

  // Get current order summary
  const getOrderSummary = useCallback((): OrderSummary => {
    const products = getValues(`${prefix}`)?.filter((item: any) => !item.is_delete) || []

    const grossTotalAmount = products.reduce((total: number, product: ProductItem) => {
      return total + (Number(product.net_amount) || 0)
    }, 0)

    const beforeAdjustment = Number(beforeTaxAdjustment) || 0
    const amountAfterBeforeAdjustment = grossTotalAmount + beforeAdjustment
    const globalDiscountTotal = globalDiscountValue || 0
    const addLessAmount = Number(addLessTotalAmount) || 0
    const amountAfterDiscount = amountAfterBeforeAdjustment - globalDiscountTotal
    const netTotalAmount = amountAfterDiscount + addLessAmount

    return {
      gross_total_amount: grossTotalAmount,
      before_tax_adjustment: beforeAdjustment,
      discount_total_value: globalDiscountTotal,
      add_less_total_amount: addLessAmount,
      net_total_amount: Math.round(netTotalAmount)
    }
  }, [getValues, globalDiscountValue, beforeTaxAdjustment, addLessTotalAmount])

  // Clear global discount
  const clearGlobalDiscount = useCallback(() => {
    setValue('discount_id', '')
    setValue('discount_rate', 0)
    setValue('discount_amount', 0)

    // Recalculate order summary
    setTimeout(() => {
      calculateOrderSummary()
    }, 50)
  }, [setValue, calculateOrderSummary])

  return {
    calculateProductAmounts,
    calculateOrderSummary,
    handleProductChange,
    handleProductDiscountChange,
    handleGlobalDiscountChange,
    handleAddLessTotalAmountChange,
    clearGlobalDiscount,
    getOrderSummary,
    orderDetails,
    orderSummary: getOrderSummary()
  }
}

export default useProposalCalculation
