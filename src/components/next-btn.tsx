import React from 'react'

type NextButtonProps = {
  onClick: () => void
  className: string
  label: string
}

export default function NextButton({ onClick, className, label }: NextButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${className} focus-visible:outline outline-white`}
      type='button'
    >
      {label}
    </button>
  )
}
