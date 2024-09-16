import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email is required' })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .trim()
})

export const SignupFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .max(100, { message: 'Password must not exceed 100 characters.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export type LoginFormState =
  | {
    errors?: {
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | {
    error: string
  }
  | undefined

export type SignupFormState =
  | {
    errors?: {
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | {
    error: string
  }
  | undefined