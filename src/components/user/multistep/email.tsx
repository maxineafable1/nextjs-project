import { FieldError, UseFormRegister } from "react-hook-form";
import { FaSpotify } from "react-icons/fa";
import { SignupFormData } from "../signup-form";

export type Props = {
  register: UseFormRegister<SignupFormData>
  errors: FieldError | undefined
}

export default function Email({ register, errors }: Props) {
  return (
    <div className="max-w-xs mx-auto">
      <div className="grid place-items-center text-center mb-8">
        <FaSpotify fontSize='2rem' />
        <h2 className="text-white text-5xl font-bold">Sign up to start listening</h2>
      </div>
      <div className='grid gap-1'>
        <label htmlFor="email" className='font-semibold text-sm'>Email address</label>
        <input
          type="text"
          id="email"
          placeholder="name@domain.com"
          className="px-3 py-2 rounded bg-inherit border border-white"
          {...register('email')}
        />
        {errors && <p className="text-sm text-red-400 mt-1">{errors.message}</p>}
      </div>
    </div>
  )
}
