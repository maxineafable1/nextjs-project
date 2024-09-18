'use server'

import prisma from "@/lib/db"
import { LoginFormSchema, LoginFormState, SignupFormSchema, SignupFormState } from "@/lib/definitions"
import { SessionData, sessionOptions } from "@/lib/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import bcrypt from 'bcryptjs'
import { redirect } from "next/navigation"
import { SignupFormData } from "@/components/user/signup-form"
// import { FormData1 } from "@/components/user/signup-form"

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.active)
    session.active = false
  return session
}

export async function login(state: LoginFormState, formData: FormData) {
  const session = await getSession()

  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (validatedFields.error) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user)
    return { error: 'Incorrect email or password' }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword)
    return { error: 'Incorrect email or password' }

  session.active = true
  session.userId = user.id
  await session.save()
  redirect('/')
}

// state: SignupFormState
export async function signup(formData: SignupFormData) {
  const session = await getSession()

  const validatedFields = await SignupFormSchema.safeParseAsync(formData)

  if (!validatedFields.success) return
  // return {
  //   errors: validatedFields.error.flatten().fieldErrors,
  // }

  const { name, email, password } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  })

  session.active = true
  session.userId = newUser.id
  await session.save()
  redirect('/')
}

export async function logout() {
  const session = await getSession()
  session.destroy()
  redirect('/')
}

export async function findEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  return user?.email !== email
}