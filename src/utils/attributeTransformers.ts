/**
 * Utility functions for transforming between attributeList and variant_attributes formats
 */

export interface AttributeValue {
  attribute_value_id: string
  attribute_name_id: string
  attribute_value: string
  description: string
  organization_public_id: string
  created_by?: string
  created_at?: string
  updated_by?: string | null
  deleted_by?: string | null
  deleted_at?: string | null
  is_deleted: boolean
  updated_at?: string
}

export interface AttributeName {
  attribute_name_id: string
  attribute_name: string
  description: string | null
  is_deleted: boolean
  organization_public_id: string
  organization_id?: string
  created_at?: string
  updated_at?: string
  values: AttributeValue[]
  valueCount: number
}

export interface VariantAttribute {
  attribute_name_id: string
  attribute_value_id: string
  product_attributes_name_master?: {
    attribute_name: string
    description: string | null
    is_deleted: boolean
    attribute_name_id: string
    organization_public_id: string
    organization_id?: string
    created_at?: string
    updated_at?: string
  }
  product_attributes_value_master?: {
    attribute_value: string
    description: string
    attribute_value_id: string
    organization_public_id: string
    created_by?: string
    created_at?: string
    updated_by?: string | null
    deleted_by?: string | null
    deleted_at?: string | null
    is_deleted: boolean
    updated_at?: string
  }
  organization_public_id?: string
}

/**
 * Transforms attributeList format to variant_attributes format for API submission
 * @param attributeList - Array of attributes with their values
 * @returns Array of variant attributes in API format
 */
export const transformAttributeListToVariantAttributes = (
  attributeList: AttributeName[]
): Array<{ attribute_name_id: string; attribute_value_id: string }> => {
  const variantAttributes: Array<{
    attribute_name_id: string
    attribute_value_id: string
  }> = []

  // Filter out deleted attributes
  const activeAttributes = attributeList.filter(attr => !attr.is_deleted)

  activeAttributes.forEach(attr => {
    if (attr.values && Array.isArray(attr.values)) {
      attr.values.forEach((value: AttributeValue) => {
        variantAttributes.push({
          attribute_name_id: attr.attribute_name_id,
          attribute_value_id: value.attribute_value_id
        })
      })
    }
  })

  return variantAttributes
}

/**
 * Transforms API response variant_attributes to attributeList format for form population
 * @param variants - Array of product variants from API response
 * @returns Array of attributes in form format
 */
export const transformVariantAttributesToAttributeList = (variants: any[]): AttributeName[] => {
  const attributeMap = new Map<string, AttributeName>()

  variants.forEach(variant => {
    if (variant.variant_attributes && Array.isArray(variant.variant_attributes)) {
      variant.variant_attributes.forEach((attr: VariantAttribute) => {
        const attributeNameId = attr.attribute_name_id
        const attributeValueId = attr.attribute_value_id

        if (!attributeMap.has(attributeNameId)) {
          attributeMap.set(attributeNameId, {
            attribute_name_id: attributeNameId,
            attribute_name: attr.product_attributes_name_master?.attribute_name || '',
            description: attr.product_attributes_name_master?.description || null,
            is_deleted: attr.product_attributes_name_master?.is_deleted || false,
            organization_public_id: attr.organization_public_id || '',
            organization_id: attr.product_attributes_name_master?.organization_id,
            created_at: attr.product_attributes_name_master?.created_at,
            updated_at: attr.product_attributes_name_master?.updated_at,
            values: [],
            valueCount: 0
          })
        }

        const attribute = attributeMap.get(attributeNameId)!
        const valueExists = attribute.values.some((val: AttributeValue) => val.attribute_value_id === attributeValueId)

        if (!valueExists && attr.product_attributes_value_master) {
          attribute.values.push({
            attribute_value_id: attributeValueId,
            attribute_name_id: attributeNameId,
            attribute_value: attr.product_attributes_value_master.attribute_value || '',
            description: attr.product_attributes_value_master.description || '',
            organization_public_id: attr.organization_public_id || '',
            created_by: attr.product_attributes_value_master.created_by,
            created_at: attr.product_attributes_value_master.created_at,
            updated_by: attr.product_attributes_value_master.updated_by,
            deleted_by: attr.product_attributes_value_master.deleted_by,
            deleted_at: attr.product_attributes_value_master.deleted_at,
            is_deleted: attr.product_attributes_value_master.is_deleted || false,
            updated_at: attr.product_attributes_value_master.updated_at
          })
          attribute.valueCount = attribute.values.length
        }
      })
    }
  })

  return Array.from(attributeMap.values())
}

/**
 * Creates a new variant with attributes from attributeList
 * @param attributeList - Array of attributes with their values
 * @param baseData - Base variant data
 * @returns New variant object with variant_attributes
 */
export const createVariantFromAttributes = (attributeList: AttributeName[], baseData: any = {}) => {
  const variantAttributes = transformAttributeListToVariantAttributes(attributeList)

  return {
    variant_id: '',
    variant_sku: '',
    variant_name: '',
    hsn_tax_id: 'd1c07f8a-c5e5-4b71-9a49-8cf94bfc1a3a',
    description: '',
    stock_management: false,
    allow_backorders: false,
    is_low_stock_notification: false,
    low_stock_threshold_quantity: 0,
    is_physical: true,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0
    },
    base_uom_id: baseData?.base_uom_id || '',
    prices: [],
    attachments: [],
    variant_attributes: variantAttributes,
    ...baseData
  }
}
