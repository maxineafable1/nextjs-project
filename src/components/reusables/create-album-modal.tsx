import React, { RefObject, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PlaylistDetailData } from '../playlist/header'
import { PlaylistDetailSchema } from '@/lib/definitions'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAlbum } from '@/actions/song'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { FaMusic } from 'react-icons/fa'

type CreateAlbumModalProps = {
  dialogRef: RefObject<HTMLDialogElement>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateAlbumModal({
  dialogRef,
  isOpen,
  setIsOpen,
}: CreateAlbumModalProps) {
  const [isEditPhoto, setIsEditPhoto] = useState(false)
  const [photoValue, setPhotoValue] = useState<File | null>(null)

  const { register, formState: { errors }, handleSubmit } = useForm<PlaylistDetailData>({
    mode: 'all',
    resolver: zodResolver(PlaylistDetailSchema)
  })

  const { onChange, name: registerName, ref } = register('image')

  const onSubmit: SubmitHandler<PlaylistDetailData> = async (data) => {
    try {
      if (data.image[0]) {
        const formData = new FormData()
        formData.append('image', data.image[0])

        // save files to public folder
        const res = await fetch('/api/playlistImage', {
          method: 'POST',
          body: formData
        })

        const { imgFileName } = await res.json()

        await createAlbum(data.name, imgFileName)
      } else {
        await createAlbum(data.name)
      }
      setIsOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="bg-neutral-800 p-4 rounded text-white"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create album</h2>
          <button
            onClick={() => {
              dialogRef.current?.close()
              setIsOpen(false)
            }}
          >
            <IoClose fontSize='1.5rem' />
          </button>
        </div>
        {(errors.name?.message || errors.image?.message) && (
          <p className="bg-red-400 text-sm rounded px-2 py-1 mb-2">
            {errors.name?.message || errors.image?.message?.toString()}
          </p>
        )}
        <form
          className="flex gap-4"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={e => {
            // ayaw mag submit pag enter e, kaya ito muna
            if (e.key.toLowerCase() === 'enter')
              handleSubmit(onSubmit)()
          }}
        >
          <label
            htmlFor="file"
            className="w-36 aspect-square block"
            onMouseEnter={() => setIsEditPhoto(true)}
            onMouseLeave={() => setIsEditPhoto(false)}
          >
            {photoValue ? (
              <div className="relative">
                {isEditPhoto ? (
                  <>
                    <Image
                      src={URL.createObjectURL(photoValue)}
                      alt=""
                      width={500}
                      height={500}
                      className={`
                        aspect-square object-cover block rounded-md
                        ${isEditPhoto && 'opacity-30'}
                      `}
                    />
                    <div className="absolute top-0 text-6xl flex flex-col gap-1 items-center justify-center p-6">
                      <MdEdit />
                      <p className="text-sm">Choose photo</p>
                    </div>
                  </>
                ) : (
                  <Image
                    src={URL.createObjectURL(photoValue)}
                    alt=""
                    width={500}
                    height={500}
                    className={`aspect-square object-cover block rounded-md`}
                  />
                )}
              </div>
            ) : (
              <div className="p-6 bg-neutral-700 rounded h-full text-6xl flex flex-col gap-1 items-center justify-center">
                {isEditPhoto ? (
                  <>
                    <MdEdit />
                    <p className="text-sm">Choose photo</p>
                  </>
                ) : (
                  <FaMusic className="text-neutral-400" />
                )}
              </div>
            )}
          </label>
          <input
            type="file"
            id="file"
            ref={ref}
            name={registerName}
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                setPhotoValue(file)
              }
              onChange(e)
            }}
          />
          <div className="flex flex-col justify-between gap-1">
            <div className="grid gap-1">
              <label htmlFor="name" className="font-semibold text-sm">Album Name</label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="px-3 py-2 rounded bg-neutral-700"
              />
            </div>
            <button
              className="self-end rounded-full bg-white text-black px-6 py-3 font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
