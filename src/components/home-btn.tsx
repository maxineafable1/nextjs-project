'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { GoHomeFill } from 'react-icons/go'

export default function HomeButton() {

  const pathname = usePathname()

  return (
    <Link href='/' className="bg-neutral-800 p-1.5 rounded-full block hover:scale-105">
      <GoHomeFill
        fontSize='2rem'
        fill={`${pathname === '/' ? 'white' : 'none'}`}
        stroke="white"
        strokeWidth='1px'
      />
    </Link>
  )
}
