import Link from 'next/link'
import React from 'react'

type LoginPopupProps = {
  divRef: React.RefObject<HTMLDivElement>
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LoginPopup({ 
  divRef,
  setIsPopup,
}: LoginPopupProps) {
  return (
    <div
      ref={divRef}
    >
      <div
        className={`
        bg-sky-600 absolute left-60 top-0 shadow rounded z-10
          w-80 p-3 flex flex-col gap-2 div-pop-up
        `}
      >
        <h2 className='font-semibold'>Create a playlist</h2>
        <p className='text-sm'>Log in to create and share playlists.</p>
        <div className='self-end mt-4 flex gap-3 items-center font-semibold text-sm'>
          <button
            className='text-neutral-400 hover:text-white'
            onClick={() => setIsPopup(false)}
          >
            Not now</button>
          <Link
            href='/login'
            className='text-black rounded-full bg-white px-3 py-1 hover:scale-105 hover:bg-neutral-200'
          >
            Log in</Link>
        </div>
      </div>
    </div>
  )
}
