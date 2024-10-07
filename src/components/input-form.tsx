import { FieldValues, Path, UseFormRegister } from "react-hook-form"

type InputLabelProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  name: Path<T>
  id: string
  placeholder?: string
  type?: 'text' | 'password' | 'checkbox'
}

export default function InputForm<T extends FieldValues>({
  register,
  name,
  id,
  placeholder,
  type = 'text',
}: InputLabelProps<T>) {

  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="px-3 py-2 rounded bg-inherit border border-white"
      {...register(name)}
    />
  )
}
