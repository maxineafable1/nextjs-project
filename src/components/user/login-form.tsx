'use client'

import { login } from "@/actions/auth"
import { useFormState } from "react-dom"

export default function LoginForm() {
  const [state, action] = useFormState(login, undefined)

  return (
    <div>
      <h2>Sign in to your account</h2>
      <form action={action}>
        <input type="text" placeholder="email" name="email" />
        {state?.errors?.email && <p>{state.errors.email}</p>}
        <input type="password" placeholder="password" name="password" />
        {state?.errors?.password && <p>{state.errors.password}</p>}
        <button>Login</button>
        <p className="text-xl text-red-500">{state?.error}</p>
      </form>
    </div>
  )
}
