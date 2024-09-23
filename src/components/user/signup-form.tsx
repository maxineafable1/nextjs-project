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
    bar: 'w-3/3',
    fields: ['terms'],
  },
]

export default function SignupForm() {
  const { register, formState: { errors }, handleSubmit, trigger } = useForm<SignupFormData>({
    mode: 'all',
    resolver: zodResolver(SignupFormSchema)
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
    <Password register={register} errors={errors.password} />,
    <Name register={register} errors={errors.name} />,
    <Terms register={register} errors={errors.terms} />,
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
    <>
      <section className="my-8 max-w-md mx-auto">
        {currentIndex > 0 && (
          <>
            <div className="grid place-items-center">
              <FaSpotify fontSize='2rem' />
            </div>
            <ProgressBar barWidth={barWidth[currentIndex]} />
            <div className="flex items-center gap-4 my-4">
              <BackButton 
                onClick={back}
              />
              <div>
                <p className="text-neutral-400">Step {currentIndex} of {formLength - 1}</p>
                <p className="font-semibold">{formLabels[currentIndex]}</p>
              </div>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
          {currentForm}
          <NextButton
            onClick={next}
            className={`${currentIndex === 0 && 'max-w-xs mx-auto'} bg-green-500 hover:bg-green-400 w-full rounded-full text-black font-bold py-3 mt-8`}
            label={lastIndex ? 'Sign up' : 'Next'}
          />
        </form>
      </section>
    </>
  )
}
