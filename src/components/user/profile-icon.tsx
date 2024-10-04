'use client'

import Link from "next/link"
import LogoutForm from "./logout-form"
import { Fragment, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { FaUser } from "react-icons/fa"

type ProfileIconProps = {
  name: string
  image: string | null | undefined
  userId: string
}

export default function ProfileIcon({ name, image, userId }: ProfileIconProps) {
  const [isOpen, setIsOpen] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  const dropdownList = [
    <Link
      href='/songs/upload'
      className="w-full block"
    >
      Upload
    </Link>,
    <Link
      href={`/artist/${userId}`}
      className="w-full block"
    >
      Profile
    </Link>,
    <LogoutForm />,
  ]

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
      {image ? (
        <Image
          src={`${process.env.BASE_URL}/${image}`}
          alt=""
          height={500}
          width={500}
          title={name}
          onClick={() => setIsOpen(true)}
          className="rounded-full max-w-10 aspect-square object-cover hover:opacity-80 cursor-pointer"
        />
      ) : (
        // <div
        //   title={name}
        //   onClick={() => setIsOpen(true)}
        //   className="bg-orange-500 rounded-full text-lg font-bold p-1 px-2.5 hover:scale-105 cursor-pointer text-black"
        // >
        //   {name[0].toUpperCase()}
        // </div>
        <div 
          title={name}
          className="bg-neutral-700 hover:bg-neutral-600 hover:scale-105 rounded-full p-2"
          onClick={() => setIsOpen(true)}
        >
          <FaUser className="text-neutral-400" />
        </div>
      )}
      <ul
        className={`
          absolute bg-neutral-800 rounded shadow p-2 right-0 z-10
          ${!isOpen && 'hidden'} w-40 top-10
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
