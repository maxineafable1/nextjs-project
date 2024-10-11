import { SessionOptions } from 'iron-session'

export type SessionData = {
  userId: string
  name: string
  active: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'next-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}