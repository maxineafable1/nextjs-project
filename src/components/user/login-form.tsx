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

export type LoginFormData = z.infer<typeof LoginFormSchema>

export default function LoginForm() {
  const { register, formState: { errors }, handleSubmit, setError } = useForm<LoginFormData>({
    mode: 'all',
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
    <section className="max-w-2xl mx-auto min-h-full my-8 bg-neutral-950 py-8 px-20 rounded-lg">
      <div className="grid place-items-center text-center mb-8">
        <FaSpotify fontSize='2rem' />
        <h2 className="text-white text-3xl font-bold">Login to Spotify</h2>
      </div>
      {errors.root?.message && <p className="flex items-center gap-2 text-white bg-red-400 p-3 text-sm rounded-sm">
        <MdErrorOutline />
        {errors.root.message}
      </p>}
      <div className="bg-neutral-500 h-px w-full my-16"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 max-w-xs mx-auto"
      >
        <div className="grid gap-1">
          <label
            htmlFor="email"
            className="font-semibold text-sm"
          >
            Email Address</label>
          <InputForm
            id="email"
            register={register}
            name="email"
            placeholder="Email Address"
            errors={errors.email}
          />
        </div>
        <div className="grid gap-1">
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
            errors={errors.password}
            type="password"
          />
        </div>
        <button className="bg-green-500 hover:bg-green-400 hover:scale-105 py-2 font-bold text-black rounded-full mt-4">Login</button>
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
