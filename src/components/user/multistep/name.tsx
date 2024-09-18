import { Props } from "./email";

export default function Name({ register, errors }: Props) {
  return (
    <div className="grid gap-1 mt-8">
      <label htmlFor="name" className='font-semibold text-sm'>Name</label>
      <p className="text-neutral-400 text-sm">This name will appear on your profile</p>
      <input
        type="text"
        id="name"
        className="px-3 py-2 rounded bg-inherit border border-white"
        {...register('name')}
      />
      {errors && <p className="text-sm text-red-400 mt-1">{errors.message}</p>}
    </div>
  )
}
