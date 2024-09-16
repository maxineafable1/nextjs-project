'use client'

import { signup } from '@/actions/auth'
import React from 'react'
import { useFormState } from 'react-dom'

export default function SignupForm() {
  const [state, action] = useFormState(signup, undefined)

  return (
    <div>
      <h2>Create an account</h2>
      <form action={action}>
        <input type="text" name="email" placeholder="email" />
        {state?.errors?.email && <p>{state.errors.email}</p>}
        <input type="password" name="password" placeholder="password" />
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <button>Sign up</button>
        <p className="text-xl text-red-500">{state?.error}</p>
      </form>
    </div>
  )
}
