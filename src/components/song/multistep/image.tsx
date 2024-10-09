import { useState } from "react";
import { SongFormData, UploadFormProps } from "../upload-form";
import { FaImage } from "react-icons/fa";
import Image from "next/image"
import { UseFormWatch } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import ErrorMessage from "@/components/error-message";

export default function ImageUpload({ register, errors, watch }: UploadFormProps & { watch: UseFormWatch<SongFormData> }) {
  const [isEditPhoto, setIsEditPhoto] = useState(false)

  const inputValue = watch('image', null)

  return (
    <div>
      <label
        htmlFor="file"
        tabIndex={0}
        onMouseEnter={() => inputValue && setIsEditPhoto(true)}
        onMouseLeave={() => inputValue && setIsEditPhoto(false)}
        onKeyDown={e => {
          console.log(e.code)
          if (e.code === 'Enter') {
            e.currentTarget.control?.click()
          }
        }}
        className={`
          block p-3 cursor-pointer rounded
          border border-neutral-400 hover:border-white text-white
          focus-visible:outline focus-visible:border-transparent
          ${errors?.message ? 'border-red-400 outline-red-400' : 'outline-white '}
        `}
      >
        {inputValue ? (
          <>
            <p className="text-xs font-medium text-center mb-2">A preview of your track image</p>
            <div className="relative">
              {isEditPhoto ? (
                <>
                  <Image
                    src={URL.createObjectURL(inputValue?.[0])}
                    alt=""
                    width={500}
                    height={500}
                    className={`
                      aspect-square object-cover block rounded-md max-w-40
                      ${isEditPhoto && 'opacity-30'} mx-auto
                    `}
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-full -translate-x-1/2 text-6xl flex flex-col gap-1 items-center justify-center p-6">
                    <MdEdit />
                    <p className="text-sm font-medium">Change photo</p>
                  </div>
                </>
              ) : (
                <Image
                  src={URL.createObjectURL(inputValue?.[0])}
                  alt=""
                  width={500}
                  height={500}
                  className={`
                    aspect-square object-cover block rounded-md max-w-40 mx-auto
                  `}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <FaImage />
            <span className="font-medium text-sm">Choose a photo</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          id="file"
          {...register('image')}
          className={`sr-only invisible`}
        />
      </label>
      <ErrorMessage message={errors?.message} />
    </div>
  )
}
