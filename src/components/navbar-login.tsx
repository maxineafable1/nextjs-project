'use client'

import Link from 'next/link'
import React, { useRef } from 'react'
import LogoutPopup from './logout-popup'
import { useLoginPopupContext } from '@/contexts/login-popup-context'

export default function NavbarLogin() {
  const { isLogoutPopup, setIsLogoutPopup } = useLoginPopupContext()
  const divRef = useRef<HTMLDivElement>(null)

  return (
    <li className="relative">
      <Link
        href='/login'
        className="bg-white block hover:scale-105 hover:bg-neutral-200 text-neutral-900 font-bold py-3 px-8 rounded-full"
      >
        Log in
      </Link>
      {isLogoutPopup && (
        <LogoutPopup
          divRef={divRef}
          setIsPopup={setIsLogoutPopup}
          isLogoutPopup={isLogoutPopup}
        />
      )}
    </li>
  )
}
