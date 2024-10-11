import LoginForm from "@/components/user/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Login - Spotify',
}

export default async function page() {

  return (
    <LoginForm />
  )
}
