import { UploadFormProps } from "../upload-form";

export default function Audio({ register, errors }: UploadFormProps) {
  return (
    <div>
      <label htmlFor="" className="text-white">Song Track</label>
      <input
        type="file"
        accept=".mp3, audio/*"
        id="song"
        {...register('song')}
        className="text-white"
      />
      {errors && <p>{errors.message}</p>}
    </div>
  )
}
