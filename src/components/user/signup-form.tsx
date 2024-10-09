'use client'

import { FaChevronLeft, FaSpotify } from 'react-icons/fa'
import Email from './multistep/email'
import Password from './multistep/password'
import Name from './multistep/name'
import Terms from './multistep/terms'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { SignupFormSchema } from '@/lib/definitions'
import { zodResolver } from '@hookform/resolvers/zod'
import { signup } from '@/actions/auth'
import useMultistep from '@/hooks/useMultistep'
import ProgressBar from '../progress-bar'
import NextButton from '../next-btn'
import BackButton from '../back-btn'
import Link from 'next/link'

export type SignupFormData = z.infer<typeof SignupFormSchema>

const steps = [
  {
    label: '',
    bar: '',
    fields: ['email'],
  },
  {
    label: 'Create a password',
    bar: 'w-1/3',
    fields: ['password'],
  },
  {
    label: 'Tell us about yourself',
    bar: 'w-2/3',
    fields: ['name'],
  },
  {
    label: 'Terms and conditions',
    bar: 'w-full',
    fields: ['terms'],
  },
]

export default function SignupForm() {
  const { register, formState: { errors }, handleSubmit, trigger, watch, setValue } = useForm<SignupFormData>({
    mode: 'onChange',
    resolver: zodResolver(SignupFormSchema),
  })

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const res = await signup(data)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const formSteps = [
    <Email register={register} errors={errors.email} />,
    <Password register={register} errors={errors.password} watch={watch} />,
    <Name register={register} errors={errors.name} />,
    <Terms register={register} errors={errors.terms} watch={watch} setValue={setValue} />,
  ]

  const {
    currentIndex,
    currentForm,
    formLength,
    formLabels,
    barWidth,
    lastIndex,
    next,
    back
  } = useMultistep(formSteps, trigger, handleSubmit, onSubmit, steps)

  return (
    <section className='py-8 from-neutral-950 bg-gradient-to-b to-neutral-900 min-h-full'>
      <div className="max-w-md mx-auto">
        {currentIndex > 0 && (
          <>
            <FaSpotify fontSize='2.5rem' className='text-center w-full' />
            <ProgressBar barWidth={barWidth[currentIndex]} />
          </>
        )}
        <div className={`${currentIndex > 0 && 'flex gap-4 justify-center items-start'}`}>
          {currentIndex > 0 && (
            <BackButton
              onClick={back}
            />
          )}
          <div className={`flex-1 ${currentIndex > 0 && 'max-w-xs'}`}>
            {currentIndex > 0 && (
              <div>
                <p className="text-neutral-400 text-sm">Step {currentIndex} of {formLength - 1}</p>
                <p className="font-semibold">{formLabels[currentIndex]}</p>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
              {currentForm}
              <NextButton
                onClick={next}
                className={`
              ${currentIndex === 0 && 'max-w-xs mx-auto'} 
              bg-green-500 hover:bg-green-400 w-full 
              rounded-full text-black font-bold py-3 mt-8
            `}
                label={lastIndex ? 'Sign up' : 'Next'}
              />
            </form>
          </div>
        </div>
        {currentIndex === 0 && (
          <p className="text-neutral-300 text-sm text-center mt-8">
            Already have an account?
            <span className="pl-1.5">
              <Link
                href='/login'
                className="text-white underline hover:text-green-400 focus-visible:no-underline focus-visible:border-b-2 pb-1 border-b-white outline-none">
                Log in here
              </Link>
            </span>
          </p>
        )}
      </div>
    </section>
  )
}
