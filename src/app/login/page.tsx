import { getSession } from "@/actions/auth"
import LoginForm from "@/components/user/login-form"
import { redirect } from "next/navigation"

export default async function page() {
  // const session = await getSession()

  // if (session.active) {
  //   redirect('/')
  // }

  return (
    <LoginForm />
  )
}
