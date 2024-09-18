import { useState } from "react"
import { SubmitHandler, UseFormHandleSubmit, UseFormTrigger } from "react-hook-form"
import { SignupFormData } from "../signup-form"

const steps = [
  {
    id: 1,
    label: '',
    bar: '',
    fields: ['email'],
  },
  {
    id: 2,
    label: 'Create a password',
    bar: 'w-1/3',
    fields: ['password'],
  },
  {
    id: 3,
    label: 'Tell us about yourself',
    bar: 'w-2/3',
    fields: ['name'],
  },
  {
    id: 4,
    label: 'Terms and conditions',
    bar: 'w-3/3',
    fields: ['terms'],
  },
]

type FieldName = keyof SignupFormData

export default function useMultistep(forms: React.JSX.Element[], trigger: UseFormTrigger<SignupFormData>, handleSubmit: UseFormHandleSubmit<SignupFormData>, onSubmit: SubmitHandler<SignupFormData>) {
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
    formLabels: steps.map(step => step.label),
    barWidth: steps.map(step => step.bar),
    lastIndex: currentIndex === steps.length - 1,
    next,
    back,
  }
}
