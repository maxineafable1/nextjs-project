import React from 'react'
import { UploadFormProps } from '../upload-form'
import ErrorMessage from '@/components/error-message'

export default function Lyrics({ register, errors }: UploadFormProps) {
  return (
    <div className='grid gap-1'>
      <label htmlFor="lyrics" className='text-sm font-semibold'>Lyrics</label>
      <textarea
        id="lyrics"
        {...register('lyrics')}
        className={`
          p-3 min-h-40 text-lg bg-inherit rounded
          border border-neutral-400 hover:border-white
          focus-visible:outline focus-visible:border-transparent
          ${errors?.message ? 'border-red-400 outline-red-400' : 'outline-white'}
        `}
      ></textarea>
      <ErrorMessage message={errors?.message} />
    </div>
  )
}
