import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { FaMusic, FaUser } from 'react-icons/fa';

type UnauthModalProps = {
  dialogRef: React.RefObject<HTMLDialogElement>
  playlistImage: string | null | undefined
  firstSongImage?: string
  isArtistIcon: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UnauthModal({
  dialogRef,
  firstSongImage,
  isArtistIcon,
  playlistImage,
  setIsOpen,
}: UnauthModalProps) {
  return (
    <dialog
      ref={dialogRef}
      className="text-white bg-neutral-800 rounded-lg max-w-screen-md"
    >
      <div className="p-16 flex items-center gap-8">
        {playlistImage ? (
          <Image
            src={playlistImage ? `${process.env.BASE_URL}/${playlistImage}` : `${process.env.BASE_URL}/${firstSongImage}`}
            alt=""
            width={500}
            height={500}
            className={`aspect-square object-cover block ${isArtistIcon ? 'rounded-full': 'rounded'} max-w-72`}
          />
        ) : (
          <div 
            className={`
              p-6 bg-neutral-700 text-neutral-400 w-full max-w-72 aspect-square 
              text-9xl flex items-center justify-center ${isArtistIcon ? 'rounded-full': 'rounded'}
            `}>
            {isArtistIcon ? <FaUser /> : <FaMusic />}
          </div>
        )}
        <div className="flex flex-col gap-8 items-center">
          <h2 className="text-3xl text-center font-bold">
            Start listening with a free Spotify account
          </h2>
          <Link
            href='/signup'
            className="bg-green-500 hover:bg-green-400 hover:scale-105 px-6 py-3 text-black rounded-full font-bold"
          >
            Sign up free</Link>
          <p className="text-neutral-400 text-sm">
            Already have an account?
            <Link href='/login' className="text-white font-semibold ml-2 underline hover:text-green-400">
              Login
            </Link>
          </p>
        </div>
      </div>
      <button
        className="fixed mt-4 left-1/2 font-semibold text-neutral-400 hover:text-white"
        onClick={() => { dialogRef.current?.close(); setIsOpen(false) }}
      >
        Close
      </button>
    </dialog>
  )
}
