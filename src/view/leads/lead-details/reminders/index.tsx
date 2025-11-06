import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '@/redux/redux-hooks'
import ReminderTable from './ReminderTable'
import ReminderForm from './ReminderForm'
import { leadActions } from '@/redux/slices/leadSlice'
import Pagenavbar from '@/components/page-navbar'
import { useAppSelector } from '@/redux/redux-hooks'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'

const Reminders = () => {
  const { t } = useTranslation()
  const { id: leadId } = useParams()
  const dispatch = useAppDispatch()
  const { leadReminder } = useAppSelector(({ lead }) => lead)
  const [tableReloadTrigger, setTableReloadTrigger] = useState(0)

  useEffect(() => {
    return () => {
      dispatch(leadActions.resetLeadReminder())
    }
  }, [])

  const handle = {
    reloadTable: useCallback(() => {
      setTableReloadTrigger(prev => prev + 1)
    }, [])
  }

  return (
    <>
      <Pagenavbar title={leadReminder ? t('reminders.editReminder') : t('reminders.addReminder')} showToggle={false} />
      <ReminderForm reloadTable={handle.reloadTable} />
      <Box sx={{ mt: 4 }} />
      <Pagenavbar title={t('reminders.title')} showToggle={false} />
      <ReminderTable key={tableReloadTrigger} leadId={String(leadId)} />
    </>
  )
}

export default Reminders
