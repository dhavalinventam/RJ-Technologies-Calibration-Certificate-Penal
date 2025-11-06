import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { yupResolver } from '@hookform/resolvers/yup'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { USER } from '@/utils/constant'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchCitiesByStateId } from '@/redux/slices/masterDataSlice'
import { organizationActions } from '@/redux/slices/organizationSlice'
import './index.scss'
import { organizationValidationSchema } from '@/utils/validation'
import { NormalButton } from '@/components'
import data from '../../../data/dataSource.json'
import { SingleAutoCompleteControl } from '@/components/form'

interface IProps {
  onNext: () => void
}

interface FormValues {
  organizationType: string
  industryType: string
  country: string
  language: string
}

export const OrganizationSetup = ({ onNext }: IProps) => {
  const organizationTypeOptions = data['Organization']
  const industryTypeOptions = data['Industry']

  const dispatch = useAppDispatch()
  const { companyDetails, organizationSetup, loading } = useAppSelector(({ organization }) => organization)
  const { countries, languages } = useAppSelector(({ masterData }) => masterData)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const contryOptions = useMemo(() => {
    return countries?.map(country => ({
      label: country.country_name,
      value: country.country_id
    }))
  }, [countries])

  const languageOptions = useMemo(() => {
    return languages?.map(language => ({
      label: language.language_name,
      value: language.language_id
    }))
  }, [languages])

  const defaultValues: FormValues = {
    organizationType: '',
    industryType: '',
    country: '',
    language: ''
  }

  const DefaultCountry = useMemo(() => {
    return countries?.find(country => country.country_name === 'India')
  }, [countries])

  const DefaultLanguage = useMemo(() => {
    return languages?.find(language => language.iso_code === 'en')
  }, [languages])

  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(organizationValidationSchema)
  })

  const { setValue, handleSubmit } = methods

  useEffect(() => {
    setValue('country', DefaultCountry?.country_id)
  }, [DefaultCountry])

  useEffect(() => {
    setValue('language', DefaultLanguage?.language_id)
  }, [DefaultLanguage])

  useEffect(() => {
    if (organizationSetup) {
      setValue('organizationType', organizationSetup.organization_type_id || '')
      setValue('industryType', organizationSetup.industry_id || '')
      setValue('country', organizationSetup.country_id || DefaultCountry?.country_id || '')
      setValue('language', organizationSetup.language_id || DefaultLanguage?.language_id || '')
    }
  }, [organizationSetup, setValue, dispatch, DefaultCountry, DefaultLanguage])

  useEffect(() => {
    if (
      companyDetails &&
      companyDetails?.address_details?.addresses &&
      companyDetails?.address_details?.addresses[0]?.state
    ) {
      dispatch(fetchCitiesByStateId(companyDetails.address_details.addresses[0].state))
    }
  }, [companyDetails, dispatch])

  const handle = {
    onSubmit: async (data: FormValues) => {
      const User = localStorage.getItem(USER)
      const userString = User ? JSON.parse(User) : null
      try {
        const { organizationType, industryType, country, language } = data
        const formData = {
          tenant_id: userString?.user_id,
          organization_type_id: organizationType,
          industry_id: industryType,
          language_id: language,
          country_id: country
        }
        dispatch(organizationActions.setOrganizationSetup(formData))
        onNext()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
    onCancel: () => {
      navigate('/organization')
    }
  }

  return (
    <div>
      {!pathname.includes('organization/') && (
        <p className='organization_user_walcome_data'>
          Welcome {JSON.parse(localStorage.getItem('user') || '{}')?.first_name},
        </p>
      )}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handle.onSubmit)}>
          <Row>
            <Col md={12}>
              <SingleAutoCompleteControl
                name='organizationType'
                options={organizationTypeOptions || []}
                label='Organization Type *'
              />
            </Col>

            <Col md={12}>
              <SingleAutoCompleteControl name='industryType' options={industryTypeOptions || []} label='Industry *' />
            </Col>

            <Col md={6}>
              <SingleAutoCompleteControl name='country' options={contryOptions} label='Country *' />
            </Col>
            <Col md={6}>
              <SingleAutoCompleteControl name='language' options={languageOptions || []} label='Language *' />
            </Col>
          </Row>

          <div className='multi_action_btn_div'>
            {pathname.includes('organization/') && (
              <NormalButton title='Cancel' type='button' variant='outlined' onClick={handle.onCancel} />
            )}

            <NormalButton title={id ? 'Continue' : 'Let’s Get Started'} type='submit' loading={loading} />
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default OrganizationSetup
