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
    .min(3, { message: 'Enter a name for your profile' })
    .max(100, { message: 'Must not exceed 100 characters' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .toLowerCase()
    .trim()
    // TODO: prevent post request when not validating for email
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
      message: 'Please accept the terms and conditions to continue.'
    })
  }),
})

const MAX_IMG_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

const MAX_AUD_FILE_SIZE = 10000000
const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mpeg3']

export const SongFormSchema = z.object({
  title: z.
    string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Must not exceed 200 characters' })
    .trim(),
  lyrics: z.
    string()
    .min(1, { message: 'Lyrics is required' })
    .max(1000, { message: 'Must not exceed 1000 characters' })
    .trim(),
  genre: z.
    string()
    .min(1, { message: 'Genre is required' })
    .max(200, { message: 'Must not exceed 200 characters' })
    .trim(),
  image: z
    // .instanceof(File),
    .any()
    .refine((files) => files?.length > 0, { message: 'Image is required' })
    .refine((files) => files[0]?.size < MAX_IMG_FILE_SIZE, { message: 'Max image size is 5MB.' })
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Only .jpg, .jpeg and .png formats are supported."
    ),
  song: z
    // .instanceof(File)
    .any()
    .refine((files) => files?.length > 0, { message: 'Audio is required.' })
    .refine((files) => files[0]?.size <= MAX_AUD_FILE_SIZE, `Max song size is 10MB.`)
    .refine(
      (files) => ACCEPTED_AUDIO_TYPES.includes(files[0]?.type),
      "Only .mp3, .wav and .mpeg3 formats are supported."
    )
})

export const PlaylistSchema = z.object({
  song: z
    .string()
})

export const PlaylistDetailSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Must be less than 100 characters long' })
    .trim(),
  image: z
    .any()
    .optional()
    .refine(file => file.length > 0 ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) ? true : false : true, { message: 'Only .jpg, .jpeg and .png formats are supported.' })
    .refine(file => file.length > 0 ? file[0]?.size <= MAX_IMG_FILE_SIZE ? true : false : true, { message: 'Max file size allowed is 5MB.' })
})

export const ArtistInfoSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Must be less than 100 characters long' })
    .trim(),
  image: z
    .any()
    .optional()
    .refine(file => file.length > 0 ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type) ? true : false : true, { message: 'Only .jpg, .jpeg and .png formats are supported.' })
    .refine(file => file.length > 0 ? file[0]?.size <= MAX_IMG_FILE_SIZE ? true : false : true, { message: 'Max file size allowed is 5MB.' })
})