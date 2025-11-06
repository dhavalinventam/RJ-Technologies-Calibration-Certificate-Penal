import { useState, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export interface TableState {
  sortBy: string
  sortOrder: 'asc' | 'desc'
  currentPage: number
  rowsPerPage: number
  searchTerm: string
}

export interface UseTableStateOptions {
  initialSortBy?: string
  initialSortOrder?: 'asc' | 'desc'
  initialPage?: number
  initialRowsPerPage?: number
  initialSearchTerm?: string
  debounceMs?: number
  onStateChange?: (state: TableState) => void
}

export interface UseTableStateReturn {
  // State
  sortBy: string
  sortOrder: 'asc' | 'desc'
  currentPage: number
  rowsPerPage: number
  searchTerm: string

  // Setters
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: 'asc' | 'desc') => void
  setCurrentPage: (page: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
  setSearchTerm: (searchTerm: string) => void

  // Handlers
  handleSortChange: (columnId: string, direction: 'asc' | 'desc' | null) => void
  handlePageChange: (page: number, limit: number) => void
  handleSearchChange: (searchValue: string) => void
  handleSearchDebounced: (searchValue: string) => void

  // Utilities
  resetState: () => void
  getState: () => TableState
}

const useTableState = (options: UseTableStateOptions = {}): UseTableStateReturn => {
  const {
    initialSortBy = '',
    initialSortOrder = 'asc',
    initialPage = 1,
    initialRowsPerPage = 10,
    initialSearchTerm = '',
    debounceMs = 500,
    onStateChange
  } = options

  // State management
  const [sortBy, setSortBy] = useState<string>(initialSortBy)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage)
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm)

  // Create a debounced search handler
  const debouncedSearch = useDebouncedCallback((searchValue: string) => {
    setSearchTerm(searchValue)
    setCurrentPage(1) // Reset to first page when search changes
    onStateChange?.({
      sortBy,
      sortOrder,
      currentPage: 1,
      rowsPerPage,
      searchTerm: searchValue
    })
  }, debounceMs)

  // Handle sort change
  const handleSortChange = useCallback(
    (columnId: string, direction: 'asc' | 'desc' | null) => {
      if (direction === null) {
        setSortBy('')
        setSortOrder('asc')
        setCurrentPage(1)
        onStateChange?.({
          sortBy: '',
          sortOrder: 'asc',
          currentPage: 1,
          rowsPerPage,
          searchTerm
        })
      } else {
        setSortBy(columnId)
        setSortOrder(direction)
        setCurrentPage(1) // Reset to first page when sorting changes
        onStateChange?.({
          sortBy: columnId,
          sortOrder: direction,
          currentPage: 1,
          rowsPerPage,
          searchTerm
        })
      }
    },
    [rowsPerPage, searchTerm, onStateChange]
  )

  // Handle page change
  const handlePageChange = useCallback(
    (page: number, limit: number) => {
      const newPage = page + 1 // Convert from 0-based to 1-based page numbering
      setCurrentPage(newPage)
      setRowsPerPage(limit)
      onStateChange?.({
        sortBy,
        sortOrder,
        currentPage: newPage,
        rowsPerPage: limit,
        searchTerm
      })
    },
    [sortBy, sortOrder, searchTerm, onStateChange]
  )

  // Handle search change (immediate)
  const handleSearchChange = useCallback(
    (searchValue: string) => {
      setSearchTerm(searchValue)
      setCurrentPage(1) // Reset to first page when search changes
      onStateChange?.({
        sortBy,
        sortOrder,
        currentPage: 1,
        rowsPerPage,
        searchTerm: searchValue
      })
    },
    [sortBy, sortOrder, rowsPerPage, onStateChange]
  )

  // Handle debounced search change
  const handleSearchDebounced = useCallback(
    (searchValue: string) => {
      debouncedSearch(searchValue)
    },
    [debouncedSearch]
  )

  // Reset state to initial values
  const resetState = useCallback(() => {
    setSortBy(initialSortBy)
    setSortOrder(initialSortOrder)
    setCurrentPage(initialPage)
    setRowsPerPage(initialRowsPerPage)
    setSearchTerm(initialSearchTerm)
    onStateChange?.({
      sortBy: initialSortBy,
      sortOrder: initialSortOrder,
      currentPage: initialPage,
      rowsPerPage: initialRowsPerPage,
      searchTerm: initialSearchTerm
    })
  }, [initialSortBy, initialSortOrder, initialPage, initialRowsPerPage, initialSearchTerm, onStateChange])

  // Get current state
  const getState = useCallback(
    (): TableState => ({
      sortBy,
      sortOrder,
      currentPage,
      rowsPerPage,
      searchTerm
    }),
    [sortBy, sortOrder, currentPage, rowsPerPage, searchTerm]
  )

  return {
    // State
    sortBy,
    sortOrder,
    currentPage,
    rowsPerPage,
    searchTerm,

    // Setters
    setSortBy,
    setSortOrder,
    setCurrentPage,
    setRowsPerPage,
    setSearchTerm,

    // Handlers
    handleSortChange,
    handlePageChange,
    handleSearchChange,
    handleSearchDebounced,

    // Utilities
    resetState,
    getState
  }
}

export default useTableState
