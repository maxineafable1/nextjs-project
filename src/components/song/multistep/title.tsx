import React, { useEffect, useRef, useState } from 'react'
import { SongFormData } from '../upload-form'
import { FieldError, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import InputForm from '@/components/input-form'
import { FaCaretDown } from "react-icons/fa";

type TitleProps = {
  register: UseFormRegister<SongFormData>
  titleError?: FieldError | undefined
  genreError?: FieldError | undefined
  setValue: UseFormSetValue<SongFormData>
}

const genres = [
  'OPM',
  'Pop',
  'Rock',
  'Rap',
  'Hiphop',
]

export default function Title({ register, titleError, genreError, setValue }: TitleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const [genreValue, setGenreValue] = useState('')
  const { ref } = register('genre')

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    setValue('genre', genreValue)
  }, [genreValue])

  return (
    <>
      <div className='grid gap-1'>
        <label htmlFor="title" className='font-semibold text-sm'>Title</label>
        <InputForm
          id='title'
          name="title"
          register={register}
          errors={titleError}
        />
      </div>
      <div className='grid gap-1 mt-4'>
        <label htmlFor="genre" className='font-semibold text-sm'>Genre</label>
        <div
          ref={divRef}
          className='relative'
        >
          <div
            className='flex items-center justify-between border border-white rounded px-3 py-2 cursor-pointer'
            onClick={() => setIsOpen(true)}
          >
            <span>
              {genreValue || 'Select a genre'}
            </span>
            <FaCaretDown />
          </div>
          <ul
            className={`
              absolute bg-neutral-600 rounded p-2 shadow w-full z-10 mt-1
              ${!isOpen && 'hidden'}
            `}
          >
            {genres.map((genre, i) => (
              <li
                key={i}
                className='hover:bg-neutral-500 cursor-pointer p-1 rounded'
                onClick={() => {
                  setGenreValue(genre)
                  setIsOpen(false)
                }}
              >
                {genre}</li>
            ))}
          </ul>
        </div>
        <p className='text-sm text-red-400'>{genreError?.message}</p>
      </div>
    </>
  )
}
