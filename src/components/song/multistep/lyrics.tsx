import React from 'react'
import { UploadFormProps } from '../upload-form'

export default function Lyrics({ register, errors }: UploadFormProps) {
  return (
    <div className='grid gap-1'>
      <label htmlFor="lyrics">Lyrics</label>
      <textarea
        id="lyrics"
        {...register('lyrics')}
        className='px-3 py-2 min-h-40 text-lg bg-inherit border border-white rounded'
      ></textarea>
      <p className="text-sm text-red-400 mt-1">{errors?.message}</p>
    </div>
  )
}
