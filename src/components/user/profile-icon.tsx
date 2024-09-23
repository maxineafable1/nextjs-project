'use client'

import Link from "next/link"
import LogoutForm from "./logout-form"
import { Fragment, useEffect, useRef, useState } from "react"

const dropdownList = [
  <Link
    href='/songs/upload'
  >
    Upload
  </Link>,
  <LogoutForm />,
]

export default function ProfileIcon() {
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
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 rounded-full text-lg font-bold p-1 px-2.5 hover:scale-105 cursor-pointer text-black"
      >
        M
      </div>
      <ul
        className={`
          absolute bg-neutral-800 rounded shadow p-2 -right-5 -bottom-24 z-10
          ${!isOpen && 'hidden'}
        `}
      >
        {dropdownList.map((list, i) => (
          <li
            key={i}
            onClick={() => setIsOpen(false)}
            className="hover:bg-neutral-500 rounded px-2 py-1 w-40"
          >
            {list}
          </li>
        ))}
      </ul>
    </div>
  )
}
