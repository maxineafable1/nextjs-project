import React from 'react'
import { IoIosInformationCircleOutline } from 'react-icons/io'

export default function ErrorMessage({ message }: { message: string | undefined }) {
  return (
    <>
      {message && (
        <p className="text-sm text-red-400 mt-1 inline-flex items-center gap-1">
          <IoIosInformationCircleOutline fontSize='1.25rem' /> {message}
        </p>
      )}
    </>
  )
}
