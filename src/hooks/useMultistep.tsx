import { useState } from "react";
import { FieldValues, SubmitHandler, UseFormHandleSubmit, UseFormTrigger } from "react-hook-form";

type USignupFormArrayType = {
  label: string
  bar: string
}

type UArrayFieldType = {
  fields: string[]
} & Partial<USignupFormArrayType>

export default function useMultistep<T extends FieldValues, U extends UArrayFieldType>(
  forms: React.JSX.Element[],
  trigger: UseFormTrigger<T>,
  handleSubmit: UseFormHandleSubmit<T>,
  onSubmit: SubmitHandler<T>,
  steps: U[],
) {
  const [currentIndex, setCurrentIndex] = useState(0)

  async function next() {
    // validate each form step fields before going to next
    const fields = steps[currentIndex].fields
    // TODO: make fields type as keys for the T generic data
    const output = await trigger(fields as any[], { shouldFocus: true })

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