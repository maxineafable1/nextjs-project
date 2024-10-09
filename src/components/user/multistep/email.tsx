import { FieldError, UseFormRegister, UseFormTrigger } from "react-hook-form";
import { FaSpotify } from "react-icons/fa";
import { SignupFormData } from "../signup-form";
import InputForm from "@/components/input-form";
import ErrorMessage from "@/components/error-message";

export type Props = {
  register: UseFormRegister<SignupFormData>
  errors: FieldError | undefined
}

export default function Email({ register, errors }: Props) {
  return (
    <div className="max-w-xs mx-auto">
      <div className="grid place-items-center text-center mb-8">
        <FaSpotify fontSize='2.5rem' />
        <h2 className="text-white text-5xl font-bold mt-4">Sign up to start listening</h2>
      </div>
      <div className='grid gap-1'>
        <label htmlFor="email" className='font-semibold text-sm'>Email address</label>
        <InputForm
          id="email"
          name="email"
          register={register}
          placeholder="name@domain.com"
          error={errors?.message}
          autoFocus
        />
        <ErrorMessage message={errors?.message} />
      </div>
    </div>
  )
}
