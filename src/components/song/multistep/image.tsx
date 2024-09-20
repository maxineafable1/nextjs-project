import { useState } from "react";
import { UploadFormProps } from "../upload-form";

export default function Image({ register, errors }: UploadFormProps) {
  const [fileName, setFileName] = useState<File | null>(null)
  const { onChange, name, ref } = register('image')

  return (
    <div>
      <label
        htmlFor="file"
        className="block text-white border border-white px-8 py-4 cursor-pointer rounded"
      >
        {fileName?.name || 'Image'}</label>
      <input
        type="file"
        accept="image/*"
        id="file"
        onChange={e => {
          if (e.target.files?.[0]) {
            setFileName(e.target.files?.[0])
            onChange(e)
          }
        }}
        ref={ref}
        name={name}
        // {...register('image')}
        className="text-white"
      />
      {errors && <p className="text-white">{errors.message}</p>}
    </div>
  )
}
