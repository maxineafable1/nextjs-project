'use client'

import { updateUserInfo } from "@/actions/auth"
import useModal from "@/hooks/useModal"
import { ArtistInfoSchema } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { FaMusic } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import { MdEdit } from "react-icons/md"
import { z } from "zod"
import { FaUser } from "react-icons/fa";

type ArtistHeaderProps = {
  active: boolean
  image: string | null | undefined
  name: string | null | undefined
  urlId: string
  currUserId: string
}

type ArtistInfoData = z.infer<typeof ArtistInfoSchema>

export default function ArtistHeader({
  active,
  image,
  name,
  urlId,
  currUserId,
}: ArtistHeaderProps) {
  const [isEditPhoto, setIsEditPhoto] = useState(false)
  const { dialogRef, isOpen, setIsOpen } = useModal()
  const [photoValue, setPhotoValue] = useState<File | null>(null)

  const { register, formState: { errors }, handleSubmit } = useForm<ArtistInfoData>({
    mode: 'all',
    resolver: zodResolver(ArtistInfoSchema)
  })

  const { onChange, name: registerName, ref } = register('image')

  const onSubmit: SubmitHandler<ArtistInfoData> = async (data) => {
    try {
      console.log(data)
      const updateUserInfoWithId = updateUserInfo.bind(null, urlId as string)
      if (data.image[0]) {
        const formData = new FormData()
        formData.append('image', data.image[0])

        // save files to public folder
        const res = await fetch('/api/playlistImage', {
          method: 'POST',
          body: formData
        })

        const { imgFileName } = await res.json()

        const updateRes = await updateUserInfoWithId(data.name, imgFileName)
        console.log(updateRes)
      } else {
        const updateRes = await updateUserInfoWithId(data.name)
        console.log(updateRes)
      }
      if (isOpen)
        setIsOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const validUser = active && currUserId === urlId

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-36 aspect-square block"
        onMouseEnter={() => validUser && setIsEditPhoto(true)}
        onMouseLeave={() => validUser && setIsEditPhoto(false)}
        onClick={() => {
          if (validUser)
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
                aspect-square object-cover block rounded-full
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
                className={`aspect-square rounded-full object-cover block`}
              />
            )}
          </div>
        ) : (
          <div className="p-6 bg-neutral-700 rounded-full h-full text-6xl flex flex-col gap-1 items-center justify-center">
            {isEditPhoto ? (
              <>
                <MdEdit />
                <p className="text-sm">Choose photo</p>
              </>
            ) : (
              <FaUser className="text-neutral-400" />
            )}
          </div>
        )}
      </div>
      <div>
        <h2
          className={`text-7xl font-extrabold mb-8 ${validUser && 'cursor-pointer'}`}
          onClick={() => validUser && setIsOpen(true)}
        >
          {name}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          {/* <p className="font-semibold">{user}</p> */}
          {/* <p className="text-neutral-400">{count} songs<span>{totalDuration && `, ${numToTime(totalDuration)}`}</span></p> */}
        </div>
      </div>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="bg-neutral-800 p-4 rounded text-white"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit details</h2>
              <button
                onClick={() => {
                  console.log('close click')
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
              onSubmit={e => {
                e.preventDefault()
                if (validUser)
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
                        aspect-square object-cover block rounded-full
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
                        className={`aspect-square object-cover block rounded-full`}
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
                              aspect-square object-cover block rounded-full
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
                            className={`aspect-square object-cover block rounded-full`}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="p-6 bg-neutral-700 rounded-full h-full text-6xl flex flex-col gap-1 items-center justify-center">
                        {isEditPhoto ? (
                          <>
                            <MdEdit />
                            <p className="text-sm">Choose photo</p>
                          </>
                        ) : (
                          <FaUser className="text-neutral-400" />
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
                  <label htmlFor="name" className="font-semibold text-sm">Artist Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={name!}
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
      )}
    </div>
  )
}
