import { useEffect, useState } from 'react'
import { useWatch, Control } from 'react-hook-form'

import { useAppDispatch } from '@/redux/redux-hooks'
import { fetchCitiesByStateId, fetchCountries, fetchStatesByCountryId } from '@/redux/slices/masterDataSlice'

interface OptionType {
  country_id?: number
  country_name?: string
  state_id?: number
  state_name?: string
  city_id?: number
  city_name?: string
}

interface UseAddressOptionsProps {
  control: Control<any> // from react-hook-form
}

export const useAddressOptions = ({ control }: UseAddressOptionsProps) => {
  const dispatch = useAppDispatch()

  const [countryList, setCountryList] = useState<OptionType[]>([])
  const [stateList, setStateList] = useState<OptionType[]>([])
  const [cityList, setCityList] = useState<OptionType[]>([])

  const countryId = useWatch({ control, name: 'country_id' })
  const stateId = useWatch({ control, name: 'state_id' })

  // Fetch countries on mount
  useEffect(() => {
    dispatch(fetchCountries())
      .then(res => setCountryList(res.payload))
      .catch(console.error)
  }, [])

  // Fetch states when country_id changes
  useEffect(() => {
    if (countryId) {
      dispatch(fetchStatesByCountryId(countryId))
        .then(res => {
          setStateList(res.payload)
        })
        .catch(console.error)
    } else {
      setStateList([])
      setCityList([])
    }
  }, [countryId])

  // Fetch cities when state_id changes
  useEffect(() => {
    if (stateId) {
      dispatch(fetchCitiesByStateId(stateId))
        .then(res => setCityList(res.payload))
        .catch(console.error)
    } else {
      setCityList([])
    }
  }, [stateId])

  return {
    countryList,
    stateList,
    cityList
  }
}
