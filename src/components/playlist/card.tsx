'use client'

import { useSongContext } from '@/contexts/song-context';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaMusic, FaPlay } from 'react-icons/fa';
import { SampleTypeForPlaylist } from '../song/card';
import { FiMinusCircle } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import useModal from '@/hooks/useModal';
import { deletePlaylist } from '@/actions/song';
import EditPlaylistModal from '../reusables/edit-playlist-modal';

type PlaylistCardProps = {
  songs: SampleTypeForPlaylist[]
  albumName: string
  playlistImage: string | null
  albumId: string
}

export default function PlaylistCard({
  songs,
  albumName,
  playlistImage,
  albumId,
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!divRef.current?.contains(e.target as Node)) {
        setIsCreate(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCreate])

  return (
    <div className='relative'>
      <Link
        onContextMenu={e => {
          e.preventDefault()
          // alert('right click')
          setIsCreate(true)
        }}
        href={`/playlist/${albumId}`}
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
                    src={`/${playlistImage}`}
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
                  src={`/${playlistImage}`}
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
          <p className='font-medium'>{albumName}</p>
          <p className='text-sm text-neutral-400'>Playlist</p>
        </div>
      </Link>
      <div
        ref={divRef}
        className={`
          absolute z-10 bg-neutral-700 w-48 right-0 translate-x-40
          rounded shadow p-1 text-sm
          ${!isCreate && 'hidden'}  
        `}
      >
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
      </div>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className='bg-white p-6 rounded-lg overflow-hidden w-full max-w-md'
        >
          <div className='flex flex-col gap-2 w-full'>
            <h2 className='font-bold text-2xl'>Delete from Your Library?</h2>
            <p className='text-sm'>This will delete <span className='font-bold'>{albumName}</span> from Your Library.</p>
            <div className='flex items-center mt-4 gap-6 self-end'>
              <button
                onClick={() => {
                  setIsOpen(false)
                  dialogRef.current?.close()
                }}
                className='font-bold hover:scale-105'
              >
                Cancel
              </button>
              <form action={deletePlaylistWithId}>
                <button
                  className='bg-green-500 hover:bg-green-400 hover:scale-105 px-6 py-3 rounded-full font-bold'
                  type='submit'
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
      {isEditOpen && (
        <EditPlaylistModal
          dialogRef={editDialogRef}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          playlistId={albumId}
          image={playlistImage}
          playlistName={albumName}
        />
      )}
    </div>
  )
}
