import { useState } from 'react'

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return {
    isOpen,
    openModal,
    closeModal,
  }
}

export default useModal
