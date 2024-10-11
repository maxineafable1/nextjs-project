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
      className={`
        ${className} focus-visible:border-b-white pb-4
        border-transparent border-b-2 outline-none translate-y-2
      `}
    >
      <FaChevronLeft fontSize='1.5rem' className='fill-neutral-400 hover:fill-white' />
    </button>
  )
}
