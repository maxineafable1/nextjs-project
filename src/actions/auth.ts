'use server'

import prisma from "@/lib/db"
import { SessionData, sessionOptions } from "@/lib/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import bcrypt from 'bcryptjs'
import { redirect } from "next/navigation"
import { SignupFormData } from "@/components/user/signup-form"
import { LoginFormData } from "@/components/user/login-form"
// import { FormData1 } from "@/components/user/signup-form"

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.active)
    session.active = false
  return session
}

export async function login(formData: LoginFormData) {
  const session = await getSession()

  const { email, password } = formData
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
  session.name = user.name as string
  await session.save()
  redirect('/')
}

export async function signup(formData: SignupFormData) {
  const session = await getSession()

  const { name, email, password } = formData

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
  session.name = newUser.name as string
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