import React from 'react'
import { UploadFormProps } from '../upload-form'

export default function Lyrics({ register, errors }: UploadFormProps) {
  return (
    <div>
      <textarea
        id="lyrics"
        {...register('lyrics')}
      ></textarea>
      {errors && <p>{errors.message}</p>}
    </div>
  )
}
