import { useState } from "react";
import { UploadFormProps } from "../upload-form";
import { FaImage, FaMusic } from "react-icons/fa";

export default function Audio({ register, errors }: UploadFormProps) {
  const [fileName, setFileName] = useState<File | null>(null)
  const { onChange, name, ref } = register('song')

  return (
    <div>
      <label
        htmlFor="file"
        className="flex items-center gap-2 text-white border border-white px-8 py-4 cursor-pointer rounded"
      >
        <FaMusic fontSize='1.5rem' />
        {fileName?.name || 'Song Track'}</label>
      <input
        type="file"
        accept=".mp3, audio/*"
        id="file"
        onChange={e => {
          if (e.target.files?.[0]) {
            setFileName(e.target.files?.[0])
            onChange(e)
          }
        }}
        ref={ref}
        name={name}
        // {...register('song')}
        className="text-white"
      />
      {errors && <p className="text-sm text-red-400 mt-1">{errors.message}</p>}
    </div>
  )
}
