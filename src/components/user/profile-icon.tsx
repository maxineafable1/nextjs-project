'use client'

import Link from "next/link"
import LogoutForm from "./logout-form"
import { Fragment, useEffect, useRef, useState } from "react"

const dropdownList = [
  <Link
    href='/songs/upload'
    className="w-full block"
  >
    Upload
  </Link>,
  <Link
    href='/profile'
    className="w-full block"
  >
    Profile
  </Link>,
  <LogoutForm />,
]

type ProfileIconProps = {
  name: string
}

export default function ProfileIcon({ name }: ProfileIconProps) {
  const [isOpen, setIsOpen] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div
      ref={divRef}
      className="relative"
    >
      <div
        title={name}
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 rounded-full text-lg font-bold p-1 px-2.5 hover:scale-105 cursor-pointer text-black"
      >
        {name[0].toUpperCase()}
      </div>
      <ul
        className={`
          absolute bg-neutral-800 rounded shadow p-2 right-0 z-10
          ${!isOpen && 'hidden'} w-40
        `}
      >
        {dropdownList.map((list, i) => (
          <Fragment key={i}>
            <li
              onClick={() => setIsOpen(false)}
              className="hover:bg-neutral-500 rounded-sm p-2 text-sm font-medium"
            >
              {list}
            </li>
            {i === dropdownList.length - 2 && <div className="bg-neutral-400 h-px w-full"></div>}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
