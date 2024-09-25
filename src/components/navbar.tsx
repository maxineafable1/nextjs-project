import Link from "next/link"
import { getSession } from "@/actions/auth"
import { GoHomeFill } from "react-icons/go";
import { FaSpotify, FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import ProfileIcon from "./user/profile-icon";

export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className="p-4">
      <ul className="flex items-center gap-4">
        <li className="">
          <Link href='/'>
            <FaSpotify fontSize='2rem' />
          </Link>
        </li>
        <li className="flex items-center gap-2 mx-auto w-[420px]">
          <Link href='/' className="bg-neutral-800 p-1.5 rounded-full block hover:scale-105">
            <GoHomeFill fontSize='2rem' />
          </Link>
          <form
            action=""
            className="w-full relative"
          >
            <CiSearch className="absolute top-2 left-2 text-neutral-400 hover:text-white" fontSize='2rem' />
            <input
              type="text"
              placeholder="What do you want to play?"
              className="px-12 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white w-full"
            />
          </form>
        </li>
        {session.active ? (
          <ProfileIcon name={session.name} />
        ) : (
          <>
            <li className="">
              <Link
                href='/signup'
                className="text-neutral-400 block hover:scale-105 hover:text-white font-bold"
              >
                Sign up</Link>
            </li>
            <li>
              <Link
                href='/login'
                className="bg-white block hover:scale-105 hover:bg-neutral-200 text-neutral-900 font-bold py-3 px-8 rounded-full"
              >
                Log in</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
