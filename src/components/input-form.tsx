import { FieldError, FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form"

type InputLabelProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  name: Path<T>
  id: string
  placeholder?: string
  errors?: FieldError | undefined
  type?: 'text' | 'password'
}

export default function InputForm<T extends FieldValues>({ register, name, id, errors, placeholder, type = 'text' }: InputLabelProps<T>) {
  return (
    <>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="px-3 py-2 rounded bg-inherit border border-white"
        {...register(name)}
      />
      <p className="text-sm text-red-400 mt-1">{errors?.message}</p>
    </>
  )
}
