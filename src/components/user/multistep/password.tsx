import { Props } from "./email";

const passwordNeeds = [
  '1 letter',
  '1 number or special character (example: # ? ! &)',
  '8 characters',
]

export default function Password({ register, errors }: Props) {
  const messages = errors?.message?.split('\n')

  return (
    <div className="grid gap-1 mt-8">
      <label htmlFor="password" className='font-semibold text-sm'>Password</label>
      <input
        type="password"
        id="password"
        className="px-3 py-2 rounded bg-inherit border border-white"
        {...register('password')}
      />
      <div className="text-sm my-4">
        <p className="font-semibold">Your password must contain at least</p>
        <ul>
          {passwordNeeds.map((password, index) => (
            <li
              key={index}
              className={`
                ${messages?.includes(password) && 'text-red-400'}
              `}
            >
              {password}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
