import InputForm from "@/components/input-form";
import { Props } from "./email";
import { UseFormWatch } from "react-hook-form";
import { SignupFormData } from "../signup-form";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const passwordNeeds = [
  '1 letter',
  '1 number or special character (example: # ? ! &)',
  '8 characters',
]

export default function Password({ register, errors, watch }: Props & { watch: UseFormWatch<SignupFormData> }) {
  const [isVisible, setIsVisible] = useState(false)

  const messages = errors?.message?.split('\n')
  const inputValue = watch('password', '')

  return (
    <div className="mt-8">
      <div className="grid gap-1 relative">
        <label htmlFor="password" className='font-semibold text-sm'>Password</label>
        <InputForm
          id="password"
          name="password"
          type={isVisible ? 'text' : 'password'}
          register={register}
          error={errors?.message}
          autoFocus
        />
        <button
          className={`absolute right-4 top-1/2 text-xl focus-visible:outline outline-white`}
          onClick={() => setIsVisible(prev => !prev)}
          type="button"
        >
          {isVisible ?
            <FiEye className="hover:stroke-white stroke-neutral-400" />
            :
            <FiEyeOff className="hover:stroke-white stroke-neutral-400" />
          }
        </button>
      </div>
      <div className="text-sm mt-8">
        <p className="font-semibold mb-2">Your password must contain at least</p>
        <ul className="flex flex-col gap-2">
          {passwordNeeds.map((password, index) => (
            <li
              key={index}
              className={`
                ${messages?.includes(password) && 'text-red-400'}
                flex items-center gap-2
              `}
            >
              <div
                className={`
                  bg-none w-full max-w-3 aspect-square border border-neutral-400 rounded-full flex items-center justify-center
                  ${(messages != null && !messages.includes(password)
                    || (!messages && inputValue.length > 1))
                  && 'bg-green-500 border-transparent'}
                `}
              >
                {(messages != null && !messages.includes(password)
                  || (!messages && inputValue.length > 1))
                  && <FaCheck fill="black" fontSize='0.5rem' />}
              </div>
              {password}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
