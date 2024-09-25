'use client'

import useModal from "@/hooks/useModal"
import Image from "next/image"
import { useState } from "react"
import { FaMusic } from "react-icons/fa"
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { PlaylistDetailSchema } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { updatePlaylistDetails } from "@/actions/song"
import { useParams } from "next/navigation"


type HeaderProps = {
  image: string | undefined | null
  name: string | undefined
  user: string | undefined | null
}

type PlaylistDetailData = z.infer<typeof PlaylistDetailSchema>

export default function Header({ image, name, user }: HeaderProps) {
  const { dialogRef, isOpen, setIsOpen } = useModal()
  const [isEditPhoto, setIsEditPhoto] = useState(false)
  const [photoValue, setPhotoValue] = useState<File | null>(null)

  const { register, formState: { errors }, handleSubmit } = useForm<PlaylistDetailData>({
    mode: 'all',
    resolver: zodResolver(PlaylistDetailSchema)
  })

  const { onChange, name: registerName, ref } = register('image')

  const { id: userId } = useParams()

  const onSubmit: SubmitHandler<PlaylistDetailData> = async (data) => {
    try {
      const updatePlaylistDetailsWithId = updatePlaylistDetails.bind(null, userId as string)
      if (data.image[0]) {
        const formData = new FormData()
        formData.append('image', data.image[0])

        // save files to public folder
        const res = await fetch('/api/playlistImage', {
          method: 'POST',
          body: formData
        })

        const { imgFileName } = await res.json()

        const updateRes = await updatePlaylistDetailsWithId(data.name, imgFileName)
        console.log(updateRes)
      } else {
        const updateRes = await updatePlaylistDetailsWithId(data.name)
        console.log(updateRes)
      }
      if (isOpen)
        setIsOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-36 aspect-square block"
        onMouseEnter={() => setIsEditPhoto(true)}
        onMouseLeave={() => setIsEditPhoto(false)}
        onClick={() => {
          isEditPhoto && setIsOpen(true)
        }}
      >
        {image ? (
          <div className="relative">
            {isEditPhoto ? (
              <>
                <Image
                  src={`/${image}`}
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
                src={`/${image}`}
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
      </div>
      <div>
        <button
          className="text-7xl font-extrabold mb-8"
          onClick={() => setIsOpen(true)}
        >
          {name}</button>
        <p className="font-semibold text-sm">{user}</p>
      </div>
      <dialog
        ref={dialogRef}
        className="bg-neutral-800 p-4 rounded text-white"
      >
        <div className="border border-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Edit details</h2>
            <button>
              <IoClose fontSize='1.5rem' />
            </button>
          </div>
          {(errors.name?.message || errors.image?.message) && (
            <p className="bg-red-400 text-sm rounded px-2 py-1 mb-2">
              {errors.name?.message || errors.image?.message?.toString()}
            </p>
          )}
          <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
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
                <>
                  {image ? (
                    <div className="relative">
                      {isEditPhoto ? (
                        <>
                          <Image
                            src={`/${image}`}
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
                          src={`/${image}`}
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
                </>
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
                <label htmlFor="name" className="font-semibold text-sm">Playlist Name</label>
                <input
                  type="text"
                  id="name"
                  defaultValue={name}
                  {...register('name')}
                  className="px-3 py-2 rounded bg-neutral-700"
                />
              </div>
              <button
                className="self-end rounded-full bg-white text-black px-6 py-3 font-semibold"
                type="submit"
              >
                Save</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}
