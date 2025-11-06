import { useEffect, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchCountries, fetchStatesByCountryId, fetchCitiesByStateId } from '@/redux/slices/masterDataSlice'

export const useAddressOptions = (methods: UseFormReturn<any>) => {
  const dispatch = useAppDispatch()
  const { countries, states, cities } = useAppSelector(({ masterData }) => masterData)

  const { setValue, watch } = methods

  const country_id = watch('country_id')
  const state_id = watch('state_id')

  // Fetch countries only once on mount
  useEffect(() => {
    dispatch(fetchCountries())
  }, [])

  // Fetch states when country changes
  useEffect(() => {
    if (country_id) {
      dispatch(fetchStatesByCountryId(country_id))
    }
  }, [country_id])

  // Fetch cities when state changes
  useEffect(() => {
    if (state_id) {
      dispatch(fetchCitiesByStateId(state_id))
    }
  }, [state_id])

  const countryOptions = useMemo(() => {
    return countries?.map((country: any) => ({
      label: country?.country_name,
      value: country?.country_id
    }))
  }, [countries])

  const stateOptions = useMemo(() => {
    return states?.map((state: any) => ({
      label: state?.state_name,
      value: state?.state_id
    }))
  }, [states])

  const cityOptions = useMemo(() => {
    return cities?.map((city: any) => ({
      label: city?.city_name,
      value: city?.city_id
    }))
  }, [cities])

  const handleCountryChange = (name: string, value: any) => {
    setValue('country_id', value, { shouldValidate: true })
    setValue('state_id', '')
    setValue('city_id', '')
  }

  const handleStateChange = (name: string, value: any) => {
    setValue('state_id', value, { shouldValidate: true })
    setValue('city_id', '')
  }

  const handleCityChange = (name: string, value: any) => {
    setValue('city_id', value, { shouldValidate: true })
  }

  return {
    countryOptions,
    stateOptions,
    cityOptions,
    country_id,
    state_id,
    handleCountryChange,
    handleStateChange,
    handleCityChange
  }
}
