import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppDispatch } from '@/redux/redux-hooks'
import { addSourcePlatform, AllSourcePlatforms, updateSourcePlatform } from '@/redux/slices/sourcePlatformSlice'
import { sourcePlatformSchema } from '@/utils/validation'
import { AddSourcePlatformI } from '@/types/api-paylod-types'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'react-bootstrap'
import CommonModal from '@/components/modal'
import { CommonInput, InputEmojiControl } from '@/components/form'
import { NormalButton } from '@/components'

interface FormData {
  name: string
  icon?: string
}

interface IProps {
  onCancel: () => void
  isOpen: boolean
  data?: any
}

const SourcePlatformModal = ({ onCancel, isOpen, data }: IProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const defaultValues: FormData = {
    name: '',
    icon: ''
  }

  const methods = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    resolver: yupResolver(sourcePlatformSchema)
  })

  const handleClose = () => {
    onCancel()
  }

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (data) {
      reset({ name: data?.name, icon: data?.icon })
    } else {
      reset(defaultValues)
    }
  }, [data])

  const handle = {
    onSubmit: async (formValue: FormData) => {
      const payload: AddSourcePlatformI = {
        name: formValue.name || '',
        icon: formValue.icon || ''
      }

      try {
        if (data) {
          await dispatch(updateSourcePlatform({ id: data?.source_platform_id, payload }))
            .unwrap()
            .then(() => dispatch(AllSourcePlatforms({})))
        } else {
          await dispatch(addSourcePlatform(payload))
            .unwrap()
            .then(() => dispatch(AllSourcePlatforms({})))
        }
        onCancel()
      } catch (error) {
        console.error('Failed to save source platform:', error)
      }
    }
  }

  return (
    <CommonModal
      open={isOpen}
      onClose={handleClose}
      title={data ? t('sourcePlatformForm.editTitle') : t('sourcePlatformForm.addTitle')}
      size='lg'
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handle.onSubmit)} noValidate>
          <Row>
            <Col md={6}>
              <div className=''>
                <CommonInput name='name' label={`${t('sourcePlatformForm.name')} *`} />
              </div>
            </Col>
            <Col md={6}>
              <div className=''>
                <InputEmojiControl name='icon' placeholder={t('sourcePlatformForm.icon')} />
              </div>
            </Col>
            <div className='multi_action_btn_div'>
              <NormalButton variant='outlined' title={t('common.cancel')} onClick={handleClose} />
              <NormalButton title={t('common.save')} type='submit' />
            </div>
          </Row>
        </form>
      </FormProvider>
    </CommonModal>
  )
}

export default SourcePlatformModal
