import Cookies from 'js-cookie'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import {
  CONTACT_VERIFIED,
  CONTACT_VERIFY_TOKEN,
  cookiesOptions,
  CUR_ADDRESS,
  EMAIL_VERIFY_TOKEN,
  FIRST_ORGANIZATION,
  ORGANIZATIONS,
  REFRESH_TOKEN,
  TOKEN,
  USER
} from './constant'

export const getNameInitials = (name: string) => {
  if (!name) {
    return ''
  }

  const words = name.trim().split(' ')
  const firstInitial = words[0]?.[0]?.toUpperCase() || ''
  const lastInitial = words.length > 1 ? words[words.length - 1][0]?.toUpperCase() : ''

  return firstInitial + lastInitial
}

export const generateId = (prefix: string, digits: number = 8) => {
  const now = Date.now()
  const unique = (now % Math.pow(10, digits)).toString().padStart(digits, '0')
  return `${prefix}${unique}`
}

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN)
  }
  return null
}

export const getCurrentAddress = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CUR_ADDRESS)
  }
  return null
}

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN)
  }
  return null
}

export const getUsersInfo = () => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem(USER)
    if (userInfo) {
      return JSON.parse(userInfo)
    }
  }
  return null
}

export const handleClearStorage = () => {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
  localStorage.removeItem(CUR_ADDRESS)
  localStorage.removeItem(USER)
  Cookies.remove(TOKEN, { path: '/' })
  Cookies.remove(REFRESH_TOKEN, { path: '/' })
  Cookies.remove(CUR_ADDRESS, { path: '/' })
  Cookies.remove(CONTACT_VERIFY_TOKEN, { path: '/' })
  Cookies.remove(EMAIL_VERIFY_TOKEN, { path: '/' })
  Cookies.remove(USER, { path: '/' })
  Cookies.remove(CONTACT_VERIFIED, { path: '/' })
  Cookies.remove(ORGANIZATIONS, { path: '/' })
  Cookies.remove(FIRST_ORGANIZATION, { path: '/' })
}

export const getRandomColor = () => {
  const colors = [
    '#FF5733', // Dark Red
    '#C70039', // Dark Maroon
    '#900C3F', // Deep Purple
    '#581845', // Dark Violet
    '#1D3557', // Deep Blue
    '#0B3D91', // Navy Blue
    '#264653', // Dark Teal
    '#6A0572', // Dark Magenta
    '#FF9F1C', // Vibrant Orange
    '#2EC4B6', // Bright Cyan
    '#E63946', // Bold Coral
    '#457B9D' // Steel Blue
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export const getColorFromString = (str: string) => {
  const colors = [
    '#FF5733',
    '#C70039',
    '#900C3F',
    '#581845',
    '#1D3557',
    '#0B3D91',
    '#264653',
    '#6A0572',
    '#FF9F1C',
    '#2EC4B6',
    '#E63946',
    '#457B9D'
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Safe color validation helper
export const isValidHexColor = (color: any): color is string => {
  if (typeof color !== 'string') return false
  const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexPattern.test(color)
}

// Safe color getter with fallback
export const getSafeColor = (color: any, fallback = '#000000'): string => {
  if (isValidHexColor(color)) {
    return color.startsWith('#') ? color : `#${color}`
  }
  return fallback
}

export const getTransparentLightBackground = (color: string, opacity = 0.2) => {
  // Handle undefined, null, or empty color values with safe color validation
  const safeColor = getSafeColor(color, '#000000')

  // Convert HEX to RGB
  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '')

    // Ensure hex has at least 6 characters for proper substring operations
    if (hex.length < 6) {
      // Pad short hex codes or return default
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map(char => char + char)
          .join('')
      } else {
        return { r: 0, g: 0, b: 0 } // Default to black
      }
    }

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // Handle invalid color values
    return {
      r: isNaN(r) ? 0 : r,
      g: isNaN(g) ? 0 : g,
      b: isNaN(b) ? 0 : b
    }
  }

  const rgb = hexToRgb(safeColor)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` // Set light transparent background
}

// Remember me functionality
export const rememberMeTask = (x_cur_add: string) => {
  localStorage.setItem(CUR_ADDRESS, x_cur_add)
  Cookies.set(CUR_ADDRESS, x_cur_add, {
    ...cookiesOptions,
    sameSite: 'Strict'
  })
}

// React-compatible cookie functions (without NextRequest)
export const getCookieValue = (key: string) => {
  return Cookies.get(key) || null
}

export const setCookieValue = (key: string, value: string, options = {}) => {
  Cookies.set(key, value, options)
}

export const datePickerMinDate = () => {
  const todayMinDate = new Date()
  todayMinDate.setHours(0, 0, 0, 0)
  return todayMinDate
}

export const capitalizeWords = (str: string): string => {
  return str
    ?.toLowerCase()
    ?.split(' ')
    ?.filter(Boolean)
    ?.map(word => word[0].toUpperCase() + word.slice(1))
    ?.join(' ')
}

export const removeUnderscoreAndCapitalize = (str: string): string => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const getMinAllowedDate = (ID: any, taskStartDate: any): Date => {
  const today = moment().startOf('day')
  const originalStart = taskStartDate ? moment(taskStartDate).startOf('day') : null

  return ID
    ? originalStart && originalStart.isAfter(today)
      ? originalStart.toDate()
      : today.toDate()
    : datePickerMinDate()
}
export const truncateText = (text: string, maxLength: number = 10): string => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const toNumber = (value: string | number | null | undefined): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

export function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function generateUUID(): string {
  return uuidv4()
}

export const extractValue = (field: any) => {
  if (field && typeof field === 'object' && field.value !== undefined) {
    return field.value
  }
  return field
}

// Helper function to extract array of values
export const extractArrayValues = (field: any) => {
  if (Array.isArray(field)) {
    return field.map(item => extractValue(item))
  }
  return field ? [extractValue(field)] : []
}
