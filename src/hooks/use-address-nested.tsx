import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/redux-hooks'
import { fetchCountries, fetchStatesByCountryId, fetchCitiesByStateId } from '@/redux/slices/masterDataSlice'

export const useAddressNestedOptions = (methods: UseFormReturn<any>, prefix: string = '') => {
  const dispatch = useAppDispatch()
  const { countries } = useAppSelector(({ masterData }) => masterData)

  // Local state for states and cities to avoid conflicts between multiple address components
  const [localStates, setLocalStates] = useState<any[]>([])
  const [localCities, setLocalCities] = useState<any[]>([])

  const { setValue, watch } = methods

  // Use prefix for watching values if provided, otherwise use direct keys
  const country_id = watch(prefix ? `${prefix}.country_id` : 'country_id')
  const state_id = watch(prefix ? `${prefix}.state_id` : 'state_id')

  // Fetch countries only once on mount
  useEffect(() => {
    dispatch(fetchCountries())
  }, [])

  // Fetch states when country changes
  useEffect(() => {
    if (country_id) {
      dispatch(fetchStatesByCountryId(country_id))
        .unwrap()
        .then(states => {
          setLocalStates(states || [])
        })
        .catch(() => {
          setLocalStates([])
        })
    } else {
      setLocalStates([])
      setLocalCities([])
    }
  }, [country_id])

  // Fetch cities when state changes
  useEffect(() => {
    if (state_id) {
      dispatch(fetchCitiesByStateId(state_id))
        .unwrap()
        .then(cities => {
          setLocalCities(cities || [])
        })
        .catch(() => {
          setLocalCities([])
        })
    } else {
      setLocalCities([])
    }
  }, [state_id])

  const countryOptions = useMemo(() => {
    return countries?.map((country: any) => ({
      label: country?.country_name,
      value: country?.country_id
    }))
  }, [countries])

  const stateOptions = useMemo(() => {
    return localStates?.map((state: any) => ({
      label: state?.state_name,
      value: state?.state_id
    }))
  }, [localStates])

  const cityOptions = useMemo(() => {
    return localCities?.map((city: any) => ({
      label: city?.city_name,
      value: city?.city_id
    }))
  }, [localCities])

  const handleCountryChange = (name: string, value: any) => {
    // Use prefix for setting values if provided, otherwise use direct keys
    const countryKey = prefix ? `${prefix}.country_id` : 'country_id'
    const stateKey = prefix ? `${prefix}.state_id` : 'state_id'
    const cityKey = prefix ? `${prefix}.city_id` : 'city_id'

    setValue(countryKey, value, { shouldValidate: true })
    setValue(stateKey, '', { shouldValidate: true })
    setValue(cityKey, '', { shouldValidate: true })

    // Clear local state when country changes
    setLocalStates([])
    setLocalCities([])
  }

  const handleStateChange = (name: string, value: any) => {
    // Use prefix for setting values if provided, otherwise use direct keys
    const stateKey = prefix ? `${prefix}.state_id` : 'state_id'
    const cityKey = prefix ? `${prefix}.city_id` : 'city_id'

    setValue(stateKey, value, { shouldValidate: true })
    setValue(cityKey, '', { shouldValidate: true })

    // Clear local cities when state changes
    setLocalCities([])
  }

  const handleCityChange = (name: string, value: any) => {
    // Use prefix for setting values if provided, otherwise use direct keys
    const cityKey = prefix ? `${prefix}.city_id` : 'city_id'

    setValue(cityKey, value, { shouldValidate: true })
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
