import { z } from "zod";
import { findEmail } from "@/actions/auth";

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
  name: z
    .string()
    .min(3, { message: 'Name at least 3 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .toLowerCase()
    .trim()
    .refine(async e => await findEmail(e), {
      message: 'User already exists'
    }),
  password: z
    .string()
    .superRefine((value, ctx) => {
      const errors = []

      if (!/[a-zA-Z]/.test(value)) {
        errors.push('1 letter')
      }

      if (!/[0-9]|[^a-zA-Z0-9]/.test(value)) {
        errors.push('1 number or special character (example: # ? ! &)')
      }

      if (value.length < 8) {
        errors.push('8 characters')
      }

      // If there are errors, add them to the context
      if (errors.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errors.join('\n'), // Join errors with newline or any other separator
        })
      }
    }),
  terms: z.literal<boolean>(true, {
    errorMap: () => ({
      message: 'accept the terms'
    })
  }),
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
      name?: string[]
      email?: string[]
      password?: string[]
    }
    message?: string
  }
  | {
    error: string
  }
  | undefined