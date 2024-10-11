import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ArtistInfoData } from '../artist/header'
import { ArtistInfoSchema } from '@/lib/definitions'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserInfo } from '@/actions/auth'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import InputForm from '../input-form'

type EditArtistModalProps = {
  dialogRef: React.RefObject<HTMLDialogElement>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  urlId: string
  validUser: boolean
  image: string | null | undefined
  name: string | null | undefined
}

export default function EditArtistModal({
  dialogRef,
  setIsOpen,
  urlId,
  validUser,
  image,
  name,
}: EditArtistModalProps) {
  const [isEditPhoto, setIsEditPhoto] = useState(false)
  // const [photoValue, setPhotoValue] = useState<File | null>(null)

  const { register, formState: { errors }, handleSubmit, watch } = useForm<ArtistInfoData>({
    mode: 'all',
    resolver: zodResolver(ArtistInfoSchema)
  })

  const photoValue = watch('image', null)

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
            {photoValue?.length > 0 ? (
              <div className="relative">
                {isEditPhoto ? (
                  <>
                    <Image
                      src={URL.createObjectURL(photoValue?.[0])}
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
                    src={URL.createObjectURL(photoValue?.[0])}
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
                          src={`${process.env.BASE_URL}/${image}`}
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
                        src={`${process.env.BASE_URL}/${image}`}
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
          {/* <input
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
          /> */}
          <input
            type="file"
            accept="image/*"
            id="file"
            {...register('image')}
            className={`sr-only invisible`}
          />
          <div className="flex flex-col justify-between gap-1">
            <div className="grid gap-1">
              <label htmlFor="name" className="font-semibold text-sm">Artist Name</label>
              {/* <input
                type="text"
                id="name"
                defaultValue={name!}
                {...register('name')}
                className="px-3 py-2 rounded bg-neutral-700"
              /> */}
              <InputForm
                register={register}
                name="name"
                id="name"
                defaultValue={name!}
                error={errors.name?.message}
                autoFocus
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
  )
}
