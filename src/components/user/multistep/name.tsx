import ErrorMessage from "@/components/error-message";
import { Props } from "./email";
import InputForm from "@/components/input-form";

export default function Name({ register, errors }: Props) {
  return (
    <div className="grid mt-8">
      <label htmlFor="name" className='font-semibold text-sm'>Name</label>
      <p className="text-neutral-400 text-sm mb-1">This name will appear on your profile</p>
      <InputForm
        id="name"
        name="name"
        register={register}
        error={errors?.message}
        autoFocus
      />
      <ErrorMessage message={errors?.message} />
    </div>
  )
}
