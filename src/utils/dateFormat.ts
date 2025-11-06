import moment from 'moment'

export type IFormat =
  | 'YYYY' // 2024
  | 'DD/MM/YYYY' // 01/12/2024
  | 'DD/MM/YYYY hh:mm' // 01/12/2024 01:40
  | 'DD/MM/YYYY hh:mm A' // 01/12/2024 01:40 PM
  | 'hh:mm' // 01:40
  | 'hh:mm A' // 01:40 PM
  | 'hh:mm [IST]' // 01:40 IST
  | 'Do MMM YYYY' // 1st Dec 2024
  | 'Do MMMM' // 1st December
  | 'Do MMMM YYYY' // 1st December 2024

// Converts date string to Unix timestamp (seconds)
export const convertDateToTimestamp = (dateString: any) => {
  return moment(dateString).unix()
}

// Converts Unix timestamp (seconds) to formatted date string
export const convertTimestampToDate = (timestamp: any, format: string = 'DD MMMM YYYY') => {
  if (!timestamp) {
    return
  }
  return moment.unix(timestamp).format(format)
}

// Converts date string to system timestamp (seconds)
export const convertToSystemTimeZone = (dateString: string) => {
  return Math.floor(new Date(dateString).getTime() / 1000)
}

// Converts Unix timestamp (seconds) to Date object
export const setTimestampToDate = (timestamp: string | number | any) => {
  if (!timestamp) {
    return null
  }
  return new Date(Number(timestamp) * 1000)
}

// Returns relative time from now (e.g., "3 hours ago")
export const getRelativeTime = (timestamp: string | number | any) => {
  if (!timestamp) {
    return 'Unknown time'
  }

  const parsedDate = moment.unix(Number(timestamp)).utc()
  if (!parsedDate.isValid()) {
    return 'Invalid date'
  }

  return parsedDate.local().fromNow()
}

// Returns the minimum end date (1 day after given date)
export const getMinEndDate = (date: string | Date): Date => {
  return moment(date).add(1, 'day').toDate()
}

export const convertUnixToDate = (unix: number) => {
  return unix ? new Date(Number(unix) * 1000) : null
}
