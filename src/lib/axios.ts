import axios from 'axios'
import Cookies from 'js-cookie'
import { cookiesOptions, CUR_ADDRESS, REFRESH_TOKEN, TOKEN } from '@/utils/constant'
import { showToastError } from '@/utils/helper'
import { getAccessToken, getCurrentAddress, getRefreshToken, handleClearStorage } from '@/utils/common'

const baseURL = import.meta.env.VITE_PUBLIC_API_URL || 'http://3.6.164.149:3001'

const apiClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': true }
})

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('Session expired. Please sign in again.')
    }

    const payload = { refresh_token: refreshToken }
    const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/user/refresh-token`, payload)
    const { access_token, refresh_token: newRefreshToken, x_cur_add } = response.data.data

    if (access_token && newRefreshToken) {
      localStorage.setItem(TOKEN, access_token)
      localStorage.setItem(REFRESH_TOKEN, newRefreshToken)
      localStorage.setItem(CUR_ADDRESS, x_cur_add)
      Cookies.set(TOKEN, access_token, { ...cookiesOptions, sameSite: 'Strict' })
      Cookies.set(REFRESH_TOKEN, newRefreshToken, { ...cookiesOptions, sameSite: 'Strict' })
      Cookies.set(CUR_ADDRESS, x_cur_add, { ...cookiesOptions, sameSite: 'Strict' })
    }
    return access_token
  } catch (error: any) {
    console.log('Error===>', error)
    handleClearStorage()
    window.location.replace('/dashboard')
    return null
  }
}

// Request Interceptor - Handles Request
apiClient.interceptors.request.use(
  config => {
    const token = getAccessToken()
    const curAddress = getCurrentAddress()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers['x-cur-add'] = curAddress
    }
    return config
  },
  error => {
    showToastError('Request Error. Please try again.')
    return Promise.reject(error)
  }
)

// Response Interceptor - Handles Errors
apiClient.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config

    if (!error.response) {
      showToastError('Server is down. Please try again later.')
      return Promise.reject(error)
    }

    const status = error.response.status

    if (status === 401 && !originalRequest._retry && getRefreshToken()) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        originalRequest._retry = true
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }
    }

    if (status === 401) {
      if (getAccessToken()) {
        handleClearStorage()
        window.location.replace('/dashboard')
      } else {
        showToastError(error?.response?.data?.message || 'Session expired. Please sign in again.')
      }
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default apiClient
