import Link from 'next/link'
import React from 'react'
import { FaSpotify } from 'react-icons/fa'

export default function NotFound() {
  return (
    <section className='flex flex-col justify-center items-center min-h-full'>
      <FaSpotify fontSize='4rem' className='mb-6' />
      <h2 className='font-bold text-5xl'>Page not available</h2>
      <p className='text-neutral-400 mt-4 mb-12'>Something went wrong, please try again later.</p>
      <Link
        href="/"
        className='bg-white rounded-full text-black block hover:scale-105 font-semibold px-8 py-3'
      >
        Home
      </Link>
    </section>
  )
}
