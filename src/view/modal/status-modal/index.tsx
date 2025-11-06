import { useMemo, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { addStatus, updateStatus } from '@/redux/slices/statusSlice'
import { statusSchema } from '@/utils/validation'
import { AddStatusI } from '@/types/api-paylod-types'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'
import CommonModal from '@/components/modal'
import { InputColorPicker, CommonInput, InputEmojiControl } from '@/components/form'
import { NormalButton } from '@/components'

interface FormData {
  name: string
  color?: string
  icon?: string
  sequence: string
}

interface AddEditStatusFormProps {
  onCancel: () => void
  isOpen: boolean
  editData?: any
  module: string
  reloadTable: () => void
}

const StatusForm = ({ onCancel, isOpen, editData, module, reloadTable }: AddEditStatusFormProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { organization } = useAppSelector(({ organization }) => organization)

  const methods = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(statusSchema)
  })

  // Reset form when editData changes
  useEffect(() => {
    const defaultValues: FormData = {
      name: editData?.name || '',
      color: editData?.color || '#b80000',
      icon: editData?.icon || '',
      sequence: editData?.sequence || ''
    }
    methods.reset(defaultValues)
  }, [editData, methods])

  const handleClose = () => {
    onCancel()
  }

  const { handleSubmit } = methods

  const formTitle = useMemo(() => {
    const moduleTranslationKey = module.toLowerCase()
    const translatedModule = t(`status.${moduleTranslationKey}`)
    return editData?.status_id
      ? t('status.editTitle', { module: translatedModule })
      : t('status.addTitle', { module: translatedModule })
  }, [module, editData, t])

  const handle = {
    onSubmit: async (formValue: FormData) => {
      const payload: AddStatusI = {
        name: formValue.name || '',
        color: formValue.color || '#b80000',
        icon: formValue.icon || '',
        sequence: Number(formValue?.sequence) || 0,
        module: module,
        organization_id: organization?.organization_id,
        organization_public_id: organization?.organization_public_id
      }

      if (editData?.status_id) {
        await dispatch(updateStatus({ id: editData?.status_id, payload })).unwrap()
      } else {
        await dispatch(addStatus(payload)).unwrap()
      }
      onCancel()
      reloadTable()
    }
  }

  return (
    <FormProvider {...methods}>
      <CommonModal open={isOpen} onClose={handleClose} title={formTitle} size='lg'>
        <form onSubmit={handleSubmit(handle.onSubmit)} noValidate>
          <Row>
            <Col md={12}>
              <CommonInput name='name' label={t('statusForm.name')} />
            </Col>
            <Col md={6}>
              <InputEmojiControl name='icon' placeholder={t('statusForm.icon')} />
            </Col>
            <Col md={6}>
              <CommonInput name='sequence' type='number' label={t('statusForm.order')} />
            </Col>
            <Col md={12}>
              <InputColorPicker name='color' />
            </Col>
            <div className='multi_action_btn_div mt-1'>
              <NormalButton title={t('common.cancel')} onClick={handleClose} variant='outlined' />
              <NormalButton title={t('common.save')} type='submit' />
            </div>
          </Row>
        </form>
      </CommonModal>
    </FormProvider>
  )
}

export default StatusForm
