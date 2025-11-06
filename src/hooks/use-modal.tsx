import { useState } from 'react'

interface IsOpenI {
  show: boolean
  row: any
}

const useModal = () => {
  const [isOpen, setIsOpen] = useState<IsOpenI>({ show: false, row: {} })

  const onClose = () => {
    setIsOpen({ show: false, row: {} })
  }

  const onOpen = (row: object = {}) => {
    setIsOpen({ show: true, row })
  }

  return {
    isOpen: isOpen.show,
    selectedRow: isOpen.row,
    onClose,
    onOpen
  }
}

export default useModal
