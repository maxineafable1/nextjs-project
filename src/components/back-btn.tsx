import React from 'react'
import { FaChevronLeft } from 'react-icons/fa'

type BackButtonProps = {
  onClick: () => void
  className?: string
  label?: string
}

export default function BackButton({ onClick, className, label }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
    >
      <FaChevronLeft fontSize='1.5rem' />
    </button>
  )
}
