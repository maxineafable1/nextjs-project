'use client'

import React, { useEffect, useRef, useState } from 'react'
import { IoIosAdd } from 'react-icons/io'
import { BiSolidPlaylist } from "react-icons/bi";
import { MdLibraryMusic } from "react-icons/md";
import Link from 'next/link';
import useModal from '@/hooks/useModal';
import CreateAlbumModal from './reusables/create-album-modal';
import { LuLibrary } from "react-icons/lu";

type SidebarButtonProps = {
  action: () => void
  active: boolean
}

export default function SidebarButton({ action, active }: SidebarButtonProps) {
  const [isCreate, setIsCreate] = useState(false)

  const { dialogRef, isOpen, setIsOpen } = useModal()

  const divRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const plusBtnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!divRef.current?.contains(e.target as Node)
        && (!btnRef.current?.contains(e.target as Node))
        && (!plusBtnRef.current?.contains(e.target as Node))
        && (!listRef.current?.contains(e.target as Node))
      ) {
        setIsCreate(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCreate])

  useEffect(() => {
    if (isOpen)
      setIsCreate(false)
  }, [isOpen])

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button className='flex items-center gap-2 text-2xl text-neutral-400 hover:text-white'>
          <LuLibrary />
          <span className='text-base font-semibold'>Your library</span>
        </button>
        <div className='relative'>
          <button
            ref={plusBtnRef}
            className='hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full'
            onClick={() => setIsCreate(true)}
          >
            <IoIosAdd fontSize='1.75rem' />
          </button>
          {active && (
            <div
              ref={listRef}
              className={`
                absolute bg-neutral-800 text-white rounded p-1 z-10
                right-0 shadow text-sm w-48
                ${!isCreate && 'hidden'}
              `}
            >
              <form
                action={action}
                onSubmit={() => setIsCreate(false)}
              >
                <button className='inline-flex items-center w-full gap-2 hover:bg-neutral-700 p-2'>
                  <BiSolidPlaylist fontSize='1.25rem' />Create a new playlist
                </button>
              </form>
              <button
                onClick={() => setIsOpen(true)}
                className='flex items-center w-full gap-2 hover:bg-neutral-700 p-2'
              >
                <MdLibraryMusic fontSize='1.25rem' />Create a new album
              </button>
            </div>
          )}
        </div>
      </div>
      {!active && (
        <div className='bg-neutral-800 p-4 rounded mt-4 relative'>
          <h2 className='font-semibold'>Create a first playlist</h2>
          <p className='text-sm mt-2'>It's easy, we'll help you</p>
          <button
            ref={btnRef}
            className='mt-4 rounded-full bg-white hover:scale-105 hover:bg-neutral-200 text-black text-sm font-semibold px-3 py-1'
            onClick={() => setIsCreate(true)}
          >
            Create playlist
          </button>
          <div
            ref={divRef}
          >
            <div
              className={`
              bg-sky-600 absolute left-60 top-0 shadow rounded z-10
                ${!isCreate && 'hidden'} w-80 p-3 flex flex-col gap-2 div-pop-up
              `}
            >
              <h2 className='font-semibold'>Create a playlist</h2>
              <p className='text-sm'>Log in to create and share playlists.</p>
              <div className='self-end mt-4 flex gap-3 items-center font-semibold text-sm'>
                <button
                  className='text-neutral-400 hover:text-white'
                  onClick={() => setIsCreate(false)}
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
        </div>
      )}
      {isOpen && (
        <CreateAlbumModal
          dialogRef={dialogRef}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  )
}
