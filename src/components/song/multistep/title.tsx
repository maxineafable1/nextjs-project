import React from 'react'
import { SongFormData } from '../upload-form'
import { FieldError, UseFormRegister } from 'react-hook-form'

type TitleProps = {
  register: UseFormRegister<SongFormData>
  titleError: FieldError | undefined
  genreError:FieldError | undefined
}

export default function Title({ register, titleError, genreError }: TitleProps) {
  return (
    <div className='text-white'>
      <label htmlFor="">title</label>
      <input
        type="text"
        // name="title"
        {...register('title')}
      />
      {titleError && <p>{titleError.message}</p>}
      <label htmlFor="">genre</label>
      <input
        type="text"
        // name="genre"
        {...register('genre')}
      />
      {genreError && <p>{genreError.message}</p>}
    </div>
  )
}
