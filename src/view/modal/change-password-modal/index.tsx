import { NormalButton } from '@/components'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/redux-hooks'
import { userChangePassword } from '@/redux/slices/authSlice'
import { FormProvider } from 'react-hook-form'
import CommonModal from '@/components/modal'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { changePasswordSchema } from '@/utils/validation'
import { getUsersInfo } from '@/utils/common'
import { CommonInput } from '@/components/form'

interface ChangePasswordModalProps {
  isOpen: boolean
  onCancel: () => void
}

const ChangePasswordModal = ({ isOpen, onCancel }: ChangePasswordModalProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userInfo = getUsersInfo()
  const methods = useForm<any>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(changePasswordSchema)
  })
  const { handleSubmit, reset } = methods

  const handle = {
    onSubmit: async (formValue: any) => {
      if (!userInfo) return
      dispatch(userChangePassword({ ...formValue, id: userInfo?.user_id }))
        .unwrap()
        .then(() => {
          onCancel()
          reset()
        })
    }
  }

  return (
    <CommonModal open={isOpen} onClose={onCancel} title={t('ChangePassword')}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handle.onSubmit)} noValidate>
          <CommonInput name='current_password' label={`${t('CurrentPassword')} *`} type='password' />
          <CommonInput name='new_password' label={`${t('NewPassword')} *`} type='password' />
          <CommonInput name='confirm_password' label={`${t('ConfirmNewPassword')} *`} type='password' />
          <div className='multi_action_btn_div'>
            <NormalButton
              title={t('common.cancel')}
              variant='outlined'
              onClick={() => {
                onCancel()
                reset()
              }}
            />
            <NormalButton title={t('common.save')} type='submit' />
          </div>
        </form>
      </FormProvider>
    </CommonModal>
  )
}
export default ChangePasswordModal
