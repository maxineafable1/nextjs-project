import React, { useState } from 'react'
import { SongFormData } from '../upload-form'
import { SubmitHandler, UseFormHandleSubmit, UseFormTrigger } from 'react-hook-form'

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

type FieldName = keyof SongFormData

export default function useMultistep(forms: React.JSX.Element[], trigger: UseFormTrigger<SongFormData>, handleSubmit: UseFormHandleSubmit<SongFormData>, onSubmit: SubmitHandler<SongFormData>) {
  const [currentIndex, setCurrentIndex] = useState(0)

  async function next() {
    // validate each form step fields before going to next
    const fields = steps[currentIndex].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    // will submit the form at last step if all valid
    if (currentIndex < steps.length) {
      if (currentIndex === steps.length - 1) {
        await handleSubmit(onSubmit)()
        return
      }
      setCurrentIndex(prev => prev + 1)
    }
  }

  function back() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  return {
    currentIndex,
    currentForm: forms[currentIndex],
    formLength: steps.length,
    lastIndex: currentIndex === steps.length - 1,
    next,
    back,
  }
}
