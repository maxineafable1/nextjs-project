'use client'

import { login } from "@/actions/auth"
import { LoginFormSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaSpotify } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { z } from "zod";
import InputForm from "../input-form";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export type LoginFormData = z.infer<typeof LoginFormSchema>

export default function LoginForm() {
  const [isVisible, setIsVisible] = useState(false)

  const { register, formState: { errors }, handleSubmit, setError } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(LoginFormSchema)
  })

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const res = await login(data)
      if (res.error)
        return setError('root', { message: res.error })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section
      className="max-w-2xl mx-auto my-8 min-h-screen from-neutral-950 bg-gradient-to-b to-neutral-900 py-8 px-20 rounded-lg shadow"
    >
      <div className="grid gap-2 place-items-center text-center mb-8">
        <FaSpotify fontSize='2rem' />
        <h2 className="text-white text-3xl font-bold">
          Login to Spotify
        </h2>
      </div>
      {errors.root?.message && <p className="flex items-center gap-2 text-white bg-red-400 p-3 text-sm rounded-sm">
        <MdErrorOutline />
        {errors.root.message}
      </p>}
      <div className="bg-neutral-700 h-px w-full my-16"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 max-w-xs mx-auto"
      >
        <div className="grid gap-1">
          <label
            htmlFor="email"
            className="font-semibold text-sm"
          >
            Email address</label>
          <InputForm
            id="email"
            register={register}
            name="email"
            placeholder="Email address"
            error={errors.email?.message}
            autoFocus
          />
          <p className="text-sm text-red-400 mt-1">{errors?.email?.message}</p>
        </div>
        <div className="grid gap-1 relative">
          <label
            htmlFor="password"
            className="font-semibold text-sm"
          >
            Password</label>
          <InputForm
            id="password"
            register={register}
            name="password"
            placeholder="Password"
            type={isVisible ? 'text' : 'password'}
            error={errors.password?.message}
          />
          <p className="text-sm text-red-400 mt-1">{errors?.password?.message}</p>
          <button
            className={`absolute right-4 top-1/2 ${errors.password?.message && '-translate-y-1/2'} text-xl`}
            onClick={() => setIsVisible(prev => !prev)}
            type="button"
          >
            {isVisible ?
              <FiEye className="hover:stroke-white stroke-neutral-400" />
              :
              <FiEyeOff className="hover:stroke-white stroke-neutral-400" />
            }
          </button>
        </div>
        <button
          className="bg-green-500 hover:bg-green-400 hover:scale-105 py-3 font-bold text-black rounded-full mt-4 focus-visible:outline outline-white"
        >
          Login
        </button>
      </form>
      <p className="text-neutral-300 text-sm text-center mt-8">
        Don't have an account?
        <span className="pl-1.5">
          <Link
            href='/signup'
            className={`
            text-white border-b hover:text-green-400 hover:border-b-green-400
              focus-visible:border-b-2 focus-visible:pb-2 border-b-white outline-none
              active:border-b-2 active:border-b-green-400 active:pb-2 pb-0.5
            `}
          >
            Sign up for Spotify
          </Link>
        </span>
      </p>
    </section>
  )
}
