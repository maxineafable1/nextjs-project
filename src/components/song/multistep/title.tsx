import React, { useEffect, useRef, useState } from 'react'
import { SongFormData } from '../upload-form'
import { FieldError, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import InputForm from '@/components/input-form'
import { FaCaretDown } from "react-icons/fa";
import ErrorMessage from '@/components/error-message';

type TitleProps = {
  register: UseFormRegister<SongFormData>
  titleError?: FieldError | undefined
  genreError?: FieldError | undefined
  setValue: UseFormSetValue<SongFormData>
  watch: UseFormWatch<SongFormData>
}

const genres = [
  'OPM',
  'Pop',
  'Rock',
  'Rap',
  'Hiphop',
]

export default function Title({ register, titleError, genreError, setValue, watch }: TitleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const divRef = useRef<HTMLDivElement>(null)

  const genreValue = watch('genre', '')

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
    function accessibility(e: KeyboardEvent) {
      console.log(e.code)
      switch (e.code) {
        case 'Enter': {
          !isOpen && setIsOpen(true)
          if (isOpen) {
            setValue('genre', genres[selectedIndex], { shouldValidate: true })
            setIsOpen(false)
          }
          return
        }
        case 'ArrowUp': {
          e.preventDefault()
          isOpen && setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
          return
        }
        case 'ArrowDown': {
          e.preventDefault()
          !isOpen && setIsOpen(true)
          isOpen && setSelectedIndex(prev => prev < genres.length - 1 ? prev + 1 : prev)
          return
        }
        case 'Escape': {
          isOpen && setIsOpen(false)
        }
      }
    }

    divRef.current?.addEventListener('keydown', accessibility)
    return () => divRef.current?.removeEventListener('keydown', accessibility)
  }, [isOpen, selectedIndex])

  return (
    <>
      <div className='grid gap-1'>
        <label htmlFor="title" className='font-semibold text-sm'>Title</label>
        <InputForm
          id='title'
          name="title"
          register={register}
          error={titleError?.message}
          autoFocus
          placeholder='e.g. Pusong Bato'
        />
        <ErrorMessage message={titleError?.message} />
      </div>
      <div className='grid gap-1 mt-4'>
        <label htmlFor="genre" className='font-semibold text-sm'>Genre</label>
        <div
          ref={divRef}
          tabIndex={0}
          className={`
            relative flex items-center justify-between rounded p-3 cursor-pointer
            border border-neutral-400 hover:border-white
            focus-visible:outline focus-visible:border-transparent
            ${genreError?.message ? 'border-red-400 outline-red-400' : 'outline-white'}
          `}
          onClick={() => setIsOpen(true)}
        >
          <span>
            {genreValue || 'Select a genre'}
          </span>
          <FaCaretDown />
          <ul
            className={`
            absolute bg-neutral-800 rounded p-1 shadow w-full z-10
            top-12 left-0
            ${!isOpen && 'hidden'}
          `}
          >
            {genres.map((genre, i) => (
              <li
                key={i}
                className={`
                  font-medium cursor-pointer p-1 rounded
                  ${genreValue === genre && 'bg-neutral-400'}
                  ${i === selectedIndex && 'bg-neutral-700'}
                `}
                onClick={() => {
                  setValue('genre', genre, { shouldValidate: true })
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
