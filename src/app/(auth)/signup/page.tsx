import SignupForm from "@/components/user/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign up - Spotify',
}

export default async function Page() {
  
  return (
    <SignupForm />
  )
}
