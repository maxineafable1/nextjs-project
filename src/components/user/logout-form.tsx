import { logout } from "@/actions/auth";

export default function LogoutForm() {
  return (
    <form action={logout}>
      <button className="w-full p-2 text-start">
        Log out
      </button>
    </form>
  )
}
