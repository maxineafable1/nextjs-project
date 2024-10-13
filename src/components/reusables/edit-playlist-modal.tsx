import { FieldValues, Path, SubmitHandler, useForm, WatchObserver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RefObject, SetStateAction, useState } from "react"
import { IoClose } from "react-icons/io5"
import Image from "next/image"
import { MdEdit } from "react-icons/md"
import { FaMusic } from "react-icons/fa"
import InputForm from "../input-form"
import { ZodSchema } from "zod"

type EditPlaylistModalProps<T extends FieldValues, U extends ZodSchema> = {
  dialogRef: RefObject<HTMLDialogElement>
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  image: string | undefined | null
  playlistName: string | null | undefined
  category: string | undefined
  registerImage: Path<T>
  registerName: Path<T>
  schema: U
  action: (name: string, image?: string) => Promise<void>
}

export default function EditPlaylistModal<T extends FieldValues, U extends ZodSchema>({
  dialogRef,
  setIsOpen,
  image,
  playlistName,
  category,
  registerImage,
  registerName,
  schema,
  action,
}: EditPlaylistModalProps<T, U>) {
  const [isEditPhoto, setIsEditPhoto] = useState(false)

  const { register, formState: { errors }, handleSubmit, watch } = useForm<T>({
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const photoValue = watch(registerImage)

  const onSubmit: SubmitHandler<T> = async (data) => {
    try {
      // const updatePlaylistDetailsWithId = updatePlaylistDetails.bind(null, playlistId as string)
      if (data.image[0]) {
        const formData = new FormData()
        formData.append('image', data.image[0])

        // save files to public folder
        const res = await fetch('/api/playlistImage', {
          method: 'POST',
          body: formData
        })

        const { imgFileName } = await res.json()

        const updateRes = await action(data.name, imgFileName)
        console.log(updateRes)
      } else {
        const updateRes = await action(data.name)
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
              dialogRef.current?.close()
              setIsOpen(false)
            }}
          >
            <IoClose fontSize='1.5rem' />
          </button>
        </div>
        {(errors.name?.message || errors.image?.message) && (
          <p className="bg-red-400 text-sm rounded px-2 py-1 mb-2">
            {/* {errors.name?.message || errors.image?.message?.toString()} */}
            {errors.name?.message?.toString() || errors.image?.message?.toString()}
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
                        aspect-square object-cover block
                        ${category === 'Artist' ? 'rounded-full' : 'rounded-md'}
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
                    className={`aspect-square object-cover block ${category === 'Artist' ? 'rounded-full' : 'rounded-md'}`}
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
                            aspect-square object-cover block ${category === 'Artist' ? 'rounded-full' : 'rounded-md'}
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
                        className={`aspect-square object-cover block ${category === 'Artist' ? 'rounded-full' : 'rounded-md'}`}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    className={`
                      p-6 bg-neutral-700 h-full text-6xl 
                      flex flex-col gap-1 items-center justify-center
                      ${category === 'Artist' ? 'rounded-full' : 'rounded-md'}
                    `}
                  >
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
            accept="image/*"
            id="file"
            {...register(registerImage)}
            className={`sr-only invisible`}
          />
          <div className="flex flex-col justify-between gap-1">
            <div className="grid gap-1">
              <label htmlFor="name" className="font-semibold text-sm">{category} Name</label>
              {/* <input
                type="text"
                id="name"
                defaultValue={playlistName!}
                {...register('name')}
                className="px-3 py-2 rounded bg-neutral-700"
                autoFocus
              /> */}
              <InputForm
                register={register}
                name={registerName}
                id="name"
                defaultValue={playlistName!}
                error={errors.name?.message?.toString()}
                autoFocus
              />
            </div>
            <button
              className="self-end rounded-full bg-white text-black px-6 py-3 font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
