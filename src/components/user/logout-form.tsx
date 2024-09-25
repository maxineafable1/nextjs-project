import { logout } from "@/actions/auth";

export default function LogoutForm() {
  return (
    <form action={logout}>
      <button className="w-full text-start">
        Log out
      </button>
    </form>
  )
}
