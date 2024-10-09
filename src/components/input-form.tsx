import { FieldValues, Path, UseFormRegister } from "react-hook-form"

type InputLabelProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  name: Path<T>
  id: string
  placeholder?: string
  type?: 'text' | 'password'
  error: string | undefined
  autoFocus?: boolean
}

export default function InputForm<T extends FieldValues>({
  register,
  name,
  id,
  placeholder,
  error,
  type = 'text',
  autoFocus,
}: InputLabelProps<T>) {

  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className={`
        p-3 rounded bg-inherit 
        border border-neutral-400 hover:border-white
        focus-visible:outline focus-visible:border-transparent
        ${error ? 'border-red-400 outline-red-400' : 'outline-white'}
        placeholder:text-sm placeholder:font-medium placeholder:text-neutral-400
      `}
      {...register(name)}
      autoFocus={autoFocus}
    />
  )
}
