import { deletePlaylist } from '@/actions/song'
import useModal from '@/hooks/useModal'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { FaEllipsis } from 'react-icons/fa6'
import { FiMinusCircle } from 'react-icons/fi'
import { MdEdit } from 'react-icons/md'
import EditPlaylistModal from './reusables/edit-playlist-modal'
import Link from 'next/link'
import { FiUpload } from "react-icons/fi";
import EditArtistModal from './reusables/edit-artist-modal'
import DeleteModal from './reusables/delete-modal'
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaCheck } from 'react-icons/fa'

type EllipsisProps = {
  playlistName: string | null | undefined
  image: string | null | undefined
  category: string | undefined
  validUser: boolean
  urlId?: string
  artistName?: string | null
  isInLibrary?: { id: string } | null
  addOtherUserPlaylistWithId?: () => Promise<void>
  deleteFromLibraryWithId?: () => Promise<void>
}

export default function Ellipsis({
  playlistName,
  image,
  category,
  validUser,
  urlId,
  artistName,
  isInLibrary,
  addOtherUserPlaylistWithId,
  deleteFromLibraryWithId,
}: EllipsisProps) {
  const [isCreate, setIsCreate] = useState(false)

  const { dialogRef, isOpen, setIsOpen } = useModal()
  const { dialogRef: editDialogRef, isOpen: isEditOpen, setIsOpen: setIsEditOpen } = useModal()

  const divRef = useRef<HTMLDivElement>(null)

  const { id: playlistId } = useParams()

  const deletePlaylistWithId = deletePlaylist.bind(null, playlistId as string)

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
    <div className="relative">
      <button
        onClick={() => setIsCreate(true)}
        className="text-neutral-400 grid hover:text-white hover:scale-105"
      >
        <FaEllipsis fontSize='1.5rem' />
      </button>
      <div
        ref={divRef}
        className={`
          absolute bg-neutral-800 rounded shadow w-max p-1
          ${!isCreate && 'hidden'} overflow-hidden text-sm
        `}
      >
        {validUser ? (
          <>
            {category !== 'Artist' ? (
              <>
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                >
                  <FiMinusCircle /> Delete
                </button>
              </>
            ) : (
              <Link
                href='/songs/upload'
                className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
              >
                <FiUpload /> Upload
              </Link>
            )}
            <button
              onClick={() => setIsEditOpen(true)}
              className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <MdEdit /> Edit details
            </button>
          </>
        ) : (
          <>
            {category !== 'Artist' && (
              <form action={isInLibrary ? deleteFromLibraryWithId : addOtherUserPlaylistWithId}>
                <button
                  onClick={() => setIsCreate(false)}
                  className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                >
                  {isInLibrary ? (
                    <>
                      <FaCheck className={`${isInLibrary && 'bg-green-500 text-black p-0.5 rounded-full'}`} /> Remove from Your Library
                    </>
                  ) : (
                    <>
                      <IoIosAddCircleOutline /> Add to Your Library
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
      {isOpen && (
        <DeleteModal
          deleteDialogRef={dialogRef}
          nameToDelete={playlistName}
          setIsDeleteOpen={setIsOpen}
          action={deletePlaylistWithId}
          category={category}
        // onSubmit={onSubmit}
        />
      )}
      {isEditOpen && (
        <>
          {category === 'Artist' ? (
            <EditArtistModal
              dialogRef={editDialogRef}
              image={image}
              setIsOpen={setIsOpen}
              urlId={urlId!}
              validUser={validUser}
              name={artistName}
            />
          ) : (
            <EditPlaylistModal
              dialogRef={editDialogRef}
              setIsOpen={setIsEditOpen}
              playlistId={playlistId}
              image={image}
              playlistName={playlistName}
              category={category}
            />
          )}
        </>

      )}
    </div>
  )
}
