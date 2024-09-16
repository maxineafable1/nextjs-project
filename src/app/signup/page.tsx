import { getSession } from "@/actions/auth";
import SignupForm from "@/components/user/signup-form";
import { redirect } from "next/navigation";

export default async function Page() {
  // const session = await getSession()

  // if (session.active) {
  //   redirect('/')
  // }
  
  return (
    <SignupForm />
  )
}
