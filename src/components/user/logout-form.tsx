import { logout } from "@/actions/auth";

export default function LogoutForm() {
  return (
    <form action={logout}>
      <button
        className="bg-white hover:bg-neutral-200 text-neutral-900 font-bold py-4 px-8 rounded-full"
      >
        Logout</button>
    </form>
  )
}
