import React, { useEffect } from 'react'
import { IoClose } from "react-icons/io5";

type LogoutPopupProps = {
  divRef: React.RefObject<HTMLDivElement>
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>
  isLogoutPopup: boolean
}

export default function LogoutPopup({ divRef, setIsPopup, isLogoutPopup }: LogoutPopupProps) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!divRef.current?.contains(e.target as Node)) {
        setIsPopup(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLogoutPopup])

  return (
    <div
      ref={divRef}
      className={`
      bg-sky-600 absolute right-0 top-full translate-y-4 shadow rounded z-10
        text-black w-80 p-3 flex flex-col gap-2 div-logout-pop-up
      `}
    >
      <div className='flex items-center justify-between'>
        <h2 className='font-bold'>You're logged out</h2>
        <IoClose
          onClick={() => setIsPopup(false)}
          className='text-lg cursor-pointer fill-neutral-950 hover:fill-neutral-800'
        />
      </div>
      <p className='text-sm'>Log in to add this to your Liked Songs.</p>
    </div>
  )
}
