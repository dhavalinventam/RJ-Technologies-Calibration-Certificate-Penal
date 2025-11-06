import { frequencyOptions, reminderModeOptions } from '@/utils/constant'
import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormProvider, useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { convertDateToTimestamp, convertTimestampToDate } from '@/utils/dateFormat'
import { createLeadReminder, leadActions, updateLeadReminder } from '@/redux/slices/leadSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import { leadReminderValidationSchema } from '@/utils/validation'
import { useTranslation } from 'react-i18next'
import { CommonCard, NormalButton } from '@/components'
import {
  AssignUserAutocomplete,
  CommonDatePicker,
  CommonInput,
  EditorControl,
  MultiAutoCompleteControl,
  SingleAutoCompleteControl,
  SwitchControl,
  TimePickerControl
} from '@/components/form'

interface FormValues {
  reminder_title: string
  reminder_description: string
  reminder_mode: string[]
  start_date: string | null
  end_date: string | null
  is_recurring: boolean
  frequency: string
  send_reminder: boolean
  assigned_to: string[]
  time: string | null
}

interface IProps {
  reloadTable: () => void
}

const ReminderForm = ({ reloadTable }: IProps) => {
  const dispatch = useAppDispatch()
  const { leadReminder, lead } = useAppSelector(({ lead }) => lead)
  const [formKey, setFormKey] = useState<number>(0)
  const { t } = useTranslation()

  const defaultValues: FormValues = {
    reminder_title: '',
    reminder_description: '',
    frequency: '',
    start_date: '',
    end_date: '',
    is_recurring: false,
    send_reminder: false,
    reminder_mode: [],
    assigned_to: [],
    time: null
  }

  const methods = useForm<FormValues>({
    mode: 'onBlur',
    resolver: yupResolver(leadReminderValidationSchema as any),
    defaultValues
  })

  const { handleSubmit, watch, reset } = methods

  useEffect(() => {
    setFormKey(prev => prev + 1)
    if (leadReminder?.reminder_id) {
      const resetValues = {
        reminder_title: leadReminder.reminder_title || '',
        reminder_description: leadReminder.reminder_description || '',
        frequency: leadReminder.frequency || '',
        is_recurring: leadReminder.is_recurring || false,
        send_reminder: leadReminder.status || false,
        reminder_mode: leadReminder.reminder_mode || [],
        assigned_to:
          leadReminder.assigned_to?.map((user: any) => ({
            label: user.first_name + ' ' + user.last_name,
            value: user.user_id
          })) || [],
        start_date: leadReminder.start_date ? convertTimestampToDate(leadReminder.start_date) : null,
        end_date: leadReminder.end_date ? convertTimestampToDate(leadReminder.end_date) : null,
        time: leadReminder.time || null
      }
      reset(resetValues)
    } else {
      reset(defaultValues)
    }
  }, [leadReminder])

  const handle = {
    onSubmit: (data: FormValues) => {
      const formData: any = {
        reminder_title: data.reminder_title,
        reminder_description: data.reminder_description,
        reminder_mode: data.reminder_mode,
        start_date: data.start_date ? convertDateToTimestamp(data.start_date) : undefined,
        frequency: data.frequency || '',
        template: '',
        person_data: {},
        status: data.send_reminder,
        is_recurring: data.is_recurring,
        assigned_to: data.assigned_to.map((user: any) => user.value),
        time: data.time
      }

      // Only add end_date if it has a value
      if (data.end_date) {
        formData.end_date = convertDateToTimestamp(data.end_date)
      }

      if (leadReminder?.reminder_id) {
        dispatch(
          updateLeadReminder({
            id: String(lead?.lead_id),
            reminderId: leadReminder?.reminder_id,
            payload: formData
          })
        )
          .unwrap()
          .then(() => reloadTable())
      } else {
        dispatch(createLeadReminder({ id: String(lead?.lead_id), payload: formData }))
          .unwrap()
          .then(() => reloadTable())
      }
      handle.handleCancel()
    },
    handleCancel: () => {
      reset(defaultValues)
      setFormKey(prev => prev + 1)
      dispatch(leadActions.resetLeadReminder())
    }
  }

  return (
    <FormProvider {...methods}>
      <form key={formKey} onSubmit={handleSubmit(handle.onSubmit)}>
        <CommonCard>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={6}>
                  <CommonInput name='reminder_title' label={t('reminderForm.reminderTitle')} />
                  <div className='filed_space_div'>
                    <EditorControl name='reminder_description' />
                  </div>
                  <div className='filed_space_div'>
                    <MultiAutoCompleteControl
                      name='reminder_mode'
                      label={t('reminderForm.reminderMode')}
                      options={reminderModeOptions}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <div className='filed_space_div'>
                        <SwitchControl label={t('reminderForm.sendReminder')} name='send_reminder' />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className='filed_space_div'>
                        <SwitchControl label={t('reminderForm.recurringReminders')} name='is_recurring' />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <CommonDatePicker name='start_date' label={t('reminderForm.startDate')} disablePast />
                    </Col>
                    <Col md={6}>
                      <TimePickerControl name='time' label={t('reminderForm.time')} />
                    </Col>
                  </Row>

                  {watch('is_recurring') && (
                    <Row>
                      <Col md={6}>
                        <CommonDatePicker
                          name='end_date'
                          label={t('reminderForm.endDate')}
                          minDate={watch('start_date') ?? undefined}
                        />
                      </Col>
                      <Col md={6}>
                        <div className='filed_space_div'>
                          <SingleAutoCompleteControl
                            name='frequency'
                            label={t('reminderForm.recurringFrequency')}
                            options={frequencyOptions}
                          />
                        </div>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col md={12}>
                      <div className='filed_space_div'>
                        <AssignUserAutocomplete name='assigned_to' label={t('reminderForm.assignedTo')} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className='multi_action_btn_div'>
                    <NormalButton title={t('common.cancel')} variant='outlined' onClick={handle.handleCancel} />
                    <NormalButton type='submit' title={leadReminder ? t('common.save') : t('common.submit')} />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </CommonCard>
      </form>
    </FormProvider>
  )
}
export default ReminderForm
