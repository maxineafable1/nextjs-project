import ErrorMessage from "@/components/error-message";
import { Props } from "./email";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { SignupFormData } from "../signup-form";
import { FaCheck } from "react-icons/fa";

export default function Terms({ register, errors, watch, setValue }: Props & { watch: UseFormWatch<SignupFormData>, setValue: UseFormSetValue<SignupFormData> }) {
  const inputValue = watch('terms', false)

  return (
    <div className="grid gap-1 mt-8">
      <label className="flex items-start flex-row-reverse gap-2 bg-neutral-800 rounded p-4 text-sm">
        <input
          type="checkbox"
          {...register('terms')}
          id="terms"
          className={`invisible sr-only`}
        />
        <span className="peer">I agree to the Spotify Terms and Conditions of Use and Privacy Policy.</span>
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.code === 'Space')
              setValue('terms', !inputValue, { shouldValidate: true })
          }}
          className={`
            w-6 aspect-square rounded border border-neutral-400 flex items-center justify-center
            focus-visible:outline outline-white
            ${inputValue ? 'bg-green-500 text-black border-transparent' : 'bg-neutral-950 hover:border-green-500 peer-hover:border-green-500'} 
          `}
        >
          {inputValue && <FaCheck fontSize='0.6rem' />}
        </div>
      </label>
      <ErrorMessage message={errors?.message} />
    </div>
  )
}
