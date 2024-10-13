'use client'

import { useSongContext } from '@/contexts/song-context';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaCheck, FaMusic, FaPlay } from 'react-icons/fa';
import { SampleTypeForPlaylist } from '../song/card';
import { FiMinusCircle } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import useModal from '@/hooks/useModal';
import { deleteFromLibrary, deletePlaylist, updatePlaylistDetails } from '@/actions/song';
import EditPlaylistModal from '../reusables/edit-playlist-modal';
import DeleteModal from '../reusables/delete-modal';
import { PlaylistDetailData } from './header';
import { PlaylistDetailSchema } from '@/lib/definitions';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

type PlaylistCardProps = {
  songs: SampleTypeForPlaylist[]
  albumName: string
  playlistImage: string | null
  albumId: string
  category: string
  active: boolean
  playlistUserId: string
  currUserId: string | undefined
  playlistOwner: string | null
}

export default function PlaylistCard({
  songs,
  albumName,
  playlistImage,
  albumId,
  category,
  active,
  currUserId,
  playlistUserId,
  playlistOwner,
}: PlaylistCardProps) {
  const { id: urlPlaylistId } = useParams()
  const { setCurrentSong, setCurrentAlbum } = useSongContext()
  const [isHover, setIsHover] = useState(false)

  const [isCreate, setIsCreate] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  const { dialogRef, isOpen, setIsOpen } = useModal()
  const { dialogRef: editDialogRef, isOpen: isEditOpen, setIsOpen: setIsEditOpen } = useModal()

  const random = Math.floor(Math.random() * songs.length)

  const deletePlaylistWithId = deletePlaylist.bind(null, albumId as string)

  // useEffect(() => {
  //   function handleClickOutside(e: MouseEvent) {
  //     if (!divRef.current?.contains(e.target as Node)) {
  //       setIsCreate(false)
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside)
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  // }, [isCreate])

  function handleClickOutside() {
    setIsCreate(false)
  }

  useOnClickOutside(divRef, handleClickOutside, isCreate)

  const validUser = active && currUserId === playlistUserId

  const deleteFromLibraryWithId = deleteFromLibrary.bind(null, albumId as string, category as string)

  return (
    <div className='relative'>
      <Link
        title={albumName}
        onContextMenu={e => {
          e.preventDefault()
          albumName !== 'Liked Songs' && setIsCreate(true)
        }}
        href={`/${category.toLowerCase()}/${albumId}`}
        className={`
          flex items-center gap-4 hover:bg-neutral-700 rounded p-2
          ${albumId === urlPlaylistId && 'bg-neutral-600'}
      `}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={`max-w-10 relative w-full aspect-square rounded 
          flex flex-col gap-1 items-center justify-center ${isHover ? 'bg-neutral-600' : 'bg-neutral-700'}
        `}
          onClick={e => {
            e.preventDefault()
            if (songs.length > 0) {
              setCurrentSong(songs[random])
              setCurrentAlbum(songs)
            }
          }}
        >
          {playlistImage ? (
            <>
              {isHover ? (
                <>
                  <Image
                    src={`${process.env.BASE_URL}/${playlistImage}`}
                    alt=""
                    width={500}
                    height={500}
                    className="aspect-square object-cover block rounded-md"
                  />
                  <button className='absolute text-xl text-white'>
                    <FaPlay />
                  </button>
                </>
              ) : (
                <Image
                  src={`${process.env.BASE_URL}/${playlistImage}`}
                  alt=""
                  width={500}
                  height={500}
                  className="aspect-square object-cover block rounded-md"
                />
              )}
            </>
          ) : (
            <>
              {isHover ? (
                <>
                  <FaMusic className={`text-neutral-400`} />
                  <button className={`absolute text-white`}>
                    <FaPlay />
                  </button>
                </>
              ) : (
                <FaMusic className="text-neutral-400" />
              )}
            </>
          )}
        </div>
        <div>
          <p className='font-medium line-clamp-1'>
            {albumName}
          </p>
          <div className='flex items-center gap-1 text-neutral-400 text-sm'>
            <p>{category}</p>
            <div className='w-1 h-1 bg-neutral-400 rounded-full'></div>
            <p>{playlistOwner}</p>
          </div>
        </div>
      </Link>
      <div
        ref={divRef}
        className={`
          absolute z-10 bg-neutral-800 w-max right-0 translate-x-40
          rounded shadow p-1 text-sm
          ${!isCreate && 'hidden'}  
        `}
      >
        {validUser ? (
          <>
            <button
              onClick={() => {
                setIsOpen(true)
                setIsCreate(false)
              }}
              className="w-full rounded-sm inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <FiMinusCircle /> Delete
            </button>
            <button
              onClick={() => {
                setIsEditOpen(true)
                setIsCreate(false)
              }}
              className="w-full rounded-sm inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <MdEdit /> Edit details
            </button>
          </>
        ) : (
          <>
            <form action={deleteFromLibraryWithId}>
              <button
                onClick={() => setIsCreate(false)}
                className="w-full rounded-sm inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
              >
                <FaCheck className={`bg-green-500 text-black p-0.5 rounded-full`} /> Remove from Your Library
              </button>
            </form>
          </>
        )}

      </div>
      {isOpen && (
        <DeleteModal
          deleteDialogRef={dialogRef}
          nameToDelete={albumName}
          setIsDeleteOpen={setIsOpen}
          action={deletePlaylistWithId}
          category={category}
        />
      )}
      {isEditOpen && (
        <EditPlaylistModal<PlaylistDetailData, typeof PlaylistDetailSchema>
          dialogRef={editDialogRef}
          setIsOpen={setIsEditOpen}
          image={playlistImage}
          playlistName={albumName}
          category={category}
          registerImage="image"
          registerName="name"
          schema={PlaylistDetailSchema}
          action={updatePlaylistDetails.bind(null, albumId as string)}
        />
      )}
    </div>
  )
}
