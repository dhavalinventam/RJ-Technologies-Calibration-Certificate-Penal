import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NormalButton from '@/components/button/normal-button'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { convertTimestampToDate } from '@/utils/dateFormat'
import { priorityLabelTemplate, priorityTemplate, renderAssignedUsers } from '@/utils/dataGridCommonFunc'
import { priorityColors } from '@/utils/constant'
import { getLeadById, leadActions, updateLeadPriority, updateLeadStatus } from '@/redux/slices/leadSlice'
import { TagGroup } from '@/components/tag'
import { DropdownButton } from '@/components'
import { Box, Typography } from '@mui/material'
import './index.scss'

const LeadHeader = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { lead, leadStatusList } = useAppSelector(({ lead }) => lead)
  const [selectedValues, setSelectedValues] = useState<{
    status: string | null
    priority: string | null
  }>({ status: null, priority: null })

  const handleOnChange = ({ label, value, type }: { label: string; value: string; type: string }) => {
    setSelectedValues(prev => ({
      ...prev,
      [type]: label
    }))
    if (type === 'priority') {
      dispatch(
        updateLeadPriority({
          id: lead?.lead_id,
          data: { priority: value }
        })
      )
        .unwrap()
        .then(() => {
          if (lead?.lead_id) {
            dispatch(getLeadById(lead?.lead_id))
          }
        })
    }
    if (type === 'status') {
      dispatch(
        updateLeadStatus({
          id: lead?.lead_id,
          data: { status_id: value }
        })
      )
        .unwrap()
        .then(() => {
          if (lead?.lead_id) {
            dispatch(getLeadById(lead?.lead_id))
          }
        })
    }
  }

  const handleConvertToCustomer = () => {
    if (!lead) return

    const primaryContact = lead.contacts?.find((contact: any) => contact.is_primary_in_lead)

    const customerData = {
      leadId: lead.lead_id,
      contactId: primaryContact?.contact_id,
      first_name: primaryContact?.first_name || '',
      last_name: primaryContact?.last_name || '',
      email: primaryContact?.email?.email
        ? [
            {
              email: primaryContact?.email?.email,
              email_label: 'Work',
              is_primary_email: true
            }
          ]
        : [],
      phone_number: primaryContact?.phone?.phone_number
        ? [
            {
              phone_number: primaryContact?.phone?.phone_number,
              phone_label: 'Work',
              is_primary_phone: true
            }
          ]
        : [],
      address_line_1: primaryContact?.address?.address_line_1 || '',
      address_line_2: primaryContact?.address?.address_line_2 || '',
      city_id: primaryContact?.address?.city?.city_id || null,
      state_id: primaryContact?.address?.state?.state_id || null,
      country_id: primaryContact?.address?.country?.country_id || null,
      pincode: primaryContact?.address?.pincode || '',
      description: lead?.details || ''
    }

    // Navigate to customer form with lead data
    navigate(`/leads/details/${lead?.lead_id}/convert-to-customer`, {
      state: { leadData: customerData }
    })
  }

  useEffect(() => {
    if (lead?.status?.name) {
      setSelectedValues(prev => ({
        ...prev,
        status: lead?.status?.status_id ? `${lead?.status?.icon} ${lead?.status?.name}` : 'Status'
      }))
    }
    if (lead?.priority) {
      setSelectedValues(prev => ({
        ...prev,
        priority: lead?.priority
      }))
    }
  }, [lead])

  useEffect(() => {
    return () => {
      dispatch(leadActions.resetLead())
    }
  }, [])

  return (
    <Box className='lead-detail-header-new'>
      <Box className='header-top-row flex-wrap gap-3'>
        <Box className='header-top-left'>
          <Box className='lead-info'>
            <Box className='dropdown-spacing gap-2 mb-2'>
              <Typography variant='h6' className='title_text'>
                {lead?.sr_number}
              </Typography>
              <TagGroup tags={lead?.tags || []} size='medium' />
            </Box>

            <Typography variant='body2'>{convertTimestampToDate(lead?.lead_receive_date)}</Typography>
          </Box>
        </Box>
        <Box className='header-top-right'>
          {!lead?.is_converted && <NormalButton title='CONVERT TO CUSTOMER' onClick={handleConvertToCustomer} />}
        </Box>
      </Box>

      <Box className='header-middle-row'>
        <Box className='assignee-info flex-wrap justify-space-between gap-3'>
          {lead?.assigned_to?.length > 0 && (
            <Box className='d-flex align-items-s gap-2 align-items-center'>
              <Typography variant='body2'>Members:</Typography>
              {renderAssignedUsers(lead?.assigned_to)}
            </Box>
          )}
        </Box>
        <Box className='dropdown-spacing'>
          {leadStatusList?.length > 0 && (
            <DropdownButton
              className='custom-dropddown'
              items={leadStatusList?.map(
                ({ status_id, name, icon }: { status_id: string; name: string; icon?: string }) => ({
                  text: `${icon ? icon : ''} ${name ? name : 'Status'}`,
                  value: status_id ?? ''
                })
              )}
              select={(data: { item: any }) =>
                handleOnChange({
                  label: data.item.text,
                  value: data.item.value,
                  type: 'status'
                })
              }
            >
              {selectedValues.status}
            </DropdownButton>
          )}

          <DropdownButton
            className='custom-dropddown'
            items={priorityColors.map(({ label, value, color, icon }) => ({
              text: label,
              value: value,
              color: color,
              icon: icon
            }))}
            select={(data: { item: any }) =>
              handleOnChange({
                label: data.item.value,
                value: data.item.value,
                type: 'priority'
              })
            }
            itemTemplate={(item: any) =>
              priorityTemplate({
                icon: item.icon,
                color: item.color,
                label: item.text,
                properties: { text: item.text }
              })
            }
          >
            {priorityLabelTemplate(selectedValues.priority)}
          </DropdownButton>
        </Box>
      </Box>
    </Box>
  )
}

export default LeadHeader
