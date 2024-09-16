import Link from "next/link"
import LogoutForm from "./user/logout-form"
import { getSession } from "@/actions/auth"
import { protectedRoutes, publicRoutes } from "@/middleware"

const links = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/login',
    label: 'Login',
  },
  {
    href: '/signup',
    label: 'Sign Up',
  },
]

export default async function Navbar() {
  const session = await getSession()

  const displayLinks = session.active ? (
    <>
      {links.filter(link => protectedRoutes.includes(link.href)).map(link => (
        <li key={link.href}>
          <Link href={link.href}>{link.label}</Link>
        </li>
      ))}
      <li>
        <LogoutForm />
      </li>
    </>
  ) : (
    links.filter(link => publicRoutes.includes(link.href)).map(link => (
      <li key={link.href}>
        <Link href={link.href}>{link.label}</Link>
      </li>
    ))
  )

  return (
    <nav>
      <ul>
        {displayLinks}
      </ul>
    </nav>
  )
}
