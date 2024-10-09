import { useState } from "react";
import { SongFormData, UploadFormProps } from "../upload-form";
import { FaMusic } from "react-icons/fa";
import { UseFormWatch } from "react-hook-form";

export default function Audio({ register, errors, watch }: UploadFormProps & { watch: UseFormWatch<SongFormData> }) {
  const [isEditPhoto, setIsEditPhoto] = useState(false)

  const inputValue = watch('song', null)
  console.log(inputValue)

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
          block p-3 cursor-pointer rounded relative
          border border-neutral-400 hover:border-white text-white
          focus-visible:outline focus-visible:border-transparent
          ${errors?.message ? 'border-red-400 outline-red-400' : 'outline-white '}
        `}
      >
        {inputValue ? (
          <>
            <div className={`${isEditPhoto && 'opacity-30'}`}>
              <div className={`flex items-center gap-2 mb-3`}>
                <FaMusic />
                <p className="font-medium text-sm">{inputValue?.[0].name}</p>
              </div>
              <p className="text-xs mb-2">Listen to your track</p>
            </div>
            {isEditPhoto && (
              <p className="absolute top-2 right-2 text-white hover:text-green-400 hover:underline text-sm font-medium">
                Change track
              </p>
            )}
            <audio
              key={inputValue?.[0].name}
              controls
              preload="metadata"
              className="w-full bg-neutral-700 rounded-lg shadow"
            >
              <source src={URL.createObjectURL(inputValue?.[0])} type="audio/mpeg" />
            </audio>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <FaMusic />
            <p className="font-medium text-sm">Choose a song</p>
          </div>
        )}
        <input
          type="file"
          accept=".mp3, audio/*"
          id="file"
          {...register('song')}
          className={`sr-only invisible`}
        />
      </label>
      {errors && <p className="text-sm text-red-400 mt-1">{errors.message}</p>}
    </div>
  )
}
