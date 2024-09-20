'use client'

import { upload } from "@/actions/song"
import { SongFormSchema } from "@/lib/definitions"
import { useFormState } from "react-dom"
import { FieldError, SubmitHandler, useForm, UseFormRegister } from "react-hook-form"
import { z } from "zod"
import useMultistep from "./multistep/useMultistep"
import Image from "./multistep/image"
import Audio from "./multistep/audio"
import Title from "./multistep/title"
import Lyrics from "./multistep/lyrics"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaChevronLeft } from "react-icons/fa"

export type SongFormData = z.infer<typeof SongFormSchema>

export type UploadFormProps = {
  register: UseFormRegister<SongFormData>
  errors: FieldError | undefined
}

export default function UploadForm() {
  // const [state, action] = useFormState(upload, undefined)
  const { register, formState: { errors }, handleSubmit, trigger } = useForm<SongFormData>({
    // mode: 'all',
    resolver: zodResolver(SongFormSchema),
    defaultValues: {
      image: new File([], ''),
      song: new File([], ''),
    }
  })

  const formSteps = [
    <Image register={register} errors={errors.image as FieldError} />,
    <Audio register={register} errors={errors.song as FieldError} />,
    <Title register={register} titleError={errors.title} genreError={errors.genre} />,
    <Lyrics register={register} errors={errors.lyrics} />,
  ]

  const onSubmit: SubmitHandler<SongFormData> = async (data) => {
    try {
      // const res = await signup(data)
      // console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const {
    currentIndex,
    currentForm,
    lastIndex,
    next,
    back,
    formLength,
  } = useMultistep(formSteps, trigger, handleSubmit, onSubmit)

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={back}
          className={`${currentIndex === 0 && 'hidden'}`}
        >
          <FaChevronLeft fontSize='1.5rem' />
        </button>
        <p className="text-neutral-400">Step {currentIndex + 1} of {formLength}</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-black"
      >
        {currentForm}
        <button
          onClick={next}
          type='button'
          className={`bg-green-500 hover:bg-green-400 w-full rounded-full text-black font-bold py-3 mt-8`}
        >
          {lastIndex ? 'Upload' : 'Next'}
        </button>
      </form>
    </div>
  )
}
