'use client'

import { SongFormSchema } from "@/lib/definitions"
import { FieldError, SubmitHandler, useForm, UseFormRegister } from "react-hook-form"
import { z } from "zod"
import Image from "./multistep/image"
import Audio from "./multistep/audio"
import Title from "./multistep/title"
import Lyrics from "./multistep/lyrics"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaChevronLeft } from "react-icons/fa"
import { NewDataType, upload } from "@/actions/song"
import useMultistep from "@/hooks/useMultistep"
import NextButton from "../next-btn"
import BackButton from "../back-btn"

export type SongFormData = z.infer<typeof SongFormSchema>

export type UploadFormProps = {
  register: UseFormRegister<SongFormData>
  errors: FieldError | undefined
}

const steps = [
  {
    id: 1,
    fields: ['image'],
  },
  {
    id: 2,
    fields: ['song'],
  },
  {
    id: 3,
    fields: ['title', 'genre'],
  },
  {
    id: 4,
    fields: ['lyrics'],
  },
]

export default function UploadForm() {
  // const [state, action] = useFormState(upload, undefined)
  const { register, formState: { errors }, handleSubmit, trigger, setValue } = useForm<SongFormData>({
    mode: 'all',
    resolver: zodResolver(SongFormSchema),
    defaultValues: {
      image: '',
      song: '',
    }
  })

  const onSubmit: SubmitHandler<SongFormData> = async (data) => {
    try {
      const formData = new FormData()
      formData.append('image', data.image[0])
      formData.append('song', data.song[0])

      // save files to public folder
      const res = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData
      })
      const { imgFileName, songFileName } = await res.json()

      const newData: NewDataType = {
        title: data.title,
        genre: data.genre,
        lyrics: data.lyrics,
        image: imgFileName as string,
        song: songFileName as string,
      }

      // save to database
      const uploadRes = await upload(newData)
      console.log(uploadRes)
    } catch (error) {
      console.log(error)
    }
  }

  const formSteps = [
    <Image register={register} errors={errors.image as FieldError} />,
    <Audio register={register} errors={errors.song as FieldError} />,
    <Title register={register} titleError={errors.title} genreError={errors.genre} setValue={setValue} />,
    <Lyrics register={register} errors={errors.lyrics} />,
  ]

  const {
    currentIndex,
    currentForm,
    lastIndex,
    next,
    back,
    formLength,
  } = useMultistep(formSteps, trigger, handleSubmit, onSubmit, steps)

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <BackButton
          onClick={back}
          className={`${currentIndex === 0 && 'hidden'}`}
        />
        <p className="text-neutral-400">Step {currentIndex + 1} of {formLength}</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        {currentForm}
        <NextButton
          onClick={next}
          className={`bg-green-500 hover:bg-green-400 w-full rounded-full text-black font-bold py-3 mt-8`}
          label={lastIndex ? 'Upload' : 'Next'}
        />
      </form>
    </div>
  )
}
