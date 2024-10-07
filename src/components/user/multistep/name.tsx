import { Props } from "./email";
import InputForm from "@/components/input-form";

export default function Name({ register, errors }: Props) {
  return (
    <div className="grid gap-1 mt-8">
      <label htmlFor="name" className='font-semibold text-sm'>Name</label>
      <p className="text-neutral-400 text-sm">This name will appear on your profile</p>
      <InputForm
        id="name"
        name="name"
        register={register}
      />
      <p className="text-sm text-red-400 mt-1">{errors?.message}</p>
    </div>
  )
}
