'use client'

import { login } from "@/actions/auth"
import Link from "next/link";
import { useFormState } from "react-dom"
import { FaSpotify } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

export default function LoginForm() {
  const [state, action] = useFormState(login, undefined)

  return (
    <section className="max-w-2xl mx-auto min-h-full my-8 bg-neutral-900 py-8 px-20 rounded-lg">
      <div className="grid place-items-center text-center mb-8">
        <FaSpotify fontSize='2rem' />
        <h2 className="text-white text-3xl font-bold">Login to Spotify</h2>
      </div>
      {state?.error && (
        <p className="flex items-center gap-2 text-white bg-red-600 p-3 text-sm rounded-sm">
          <MdErrorOutline />
          {state?.error}
        </p>
      )}
      <div className="bg-neutral-500 h-px w-full my-16"></div>
      <form action={action} className="grid gap-4 max-w-xs mx-auto">
        <div className="grid gap-1">
          <label
            htmlFor="email"
            className="font-semibold text-sm"
          >
            Email or username</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email or username"
            className="px-3 py-2 rounded bg-inherit border border-white"
          />
          {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
        </div>
        <div className="grid gap-1">
          <label
            htmlFor="password"
            className="font-semibold text-sm"
          >
            Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="px-3 py-2 rounded bg-inherit border border-white"
          />
          {state?.errors?.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
        </div>
        <button className="bg-green-500 py-2 font-bold text-black rounded-full mt-4">Login</button>
      </form>
      <p className="text-neutral-300 text-center mt-8 ">
        Don't have an account?
        <span className="pl-1">
          <Link href='/signup' className="text-white underline">
            Sign up for Spotify
          </Link>
        </span>
      </p>
    </section>
  )
}
