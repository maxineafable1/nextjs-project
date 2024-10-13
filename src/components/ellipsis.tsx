import { deletePlaylist, updatePlaylistDetails } from '@/actions/song'
import useModal from '@/hooks/useModal'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { FaEllipsis } from 'react-icons/fa6'
import { FiMinusCircle } from 'react-icons/fi'
import { MdEdit } from 'react-icons/md'
import EditPlaylistModal from './reusables/edit-playlist-modal'
import Link from 'next/link'
import { FiUpload } from "react-icons/fi";
import DeleteModal from './reusables/delete-modal'
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaCheck } from 'react-icons/fa'
import { useLoginPopupContext } from '@/contexts/login-popup-context'
import { ArtistInfoData } from './artist/header'
import { ArtistInfoSchema, PlaylistDetailSchema } from '@/lib/definitions'
import { PlaylistDetailData } from './playlist/header'
import { updateUserInfo } from '@/actions/auth'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

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
  active: boolean
}

type Artist = {
  zData: ArtistInfoData
  zSchema: typeof ArtistInfoSchema
}

type Playlist = {
  zData: PlaylistDetailData
  zSchema: typeof PlaylistDetailSchema
}

function getType<T = 'Playlist'>(input: T):
  T extends 'Artist' ? Artist : Playlist {
  return {} as any
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
  active,
}: EllipsisProps) {
  const [isCreate, setIsCreate] = useState(false)

  const { setIsPopup } = useLoginPopupContext()

  const { dialogRef, isOpen, setIsOpen } = useModal()
  const { dialogRef: editDialogRef, isOpen: isEditOpen, setIsOpen: setIsEditOpen } = useModal()

  const divRef = useRef<HTMLDivElement>(null)
  const ellipsisRef = useRef<HTMLButtonElement>(null)

  const { id: playlistId } = useParams()

  const deletePlaylistWithId = deletePlaylist.bind(null, playlistId as string)

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

  useOnClickOutside([divRef, ellipsisRef], handleClickOutside, [isCreate])

  const res = getType(category)

  return (
    <div className="relative">
      <button
        ref={ellipsisRef}
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
              <form
                action={active ? (isInLibrary ? deleteFromLibraryWithId : addOtherUserPlaylistWithId) : ''}
                onSubmit={e => {
                  if (!active) {
                    e.preventDefault()
                    setIsPopup(true)
                  }
                  setIsCreate(false)
                }}
              >
                <button
                  className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                >
                  {active && isInLibrary ? (
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
            {category === 'Artist' && (
              <button onClick={() => alert('sabing wala pa')}>
                Wala pa po
              </button>
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
        <EditPlaylistModal<typeof res.zData, typeof res.zSchema>
          dialogRef={editDialogRef}
          setIsOpen={setIsOpen}
          image={image}
          playlistName={playlistName}
          category={category}
          registerImage="image"
          registerName="name"
          schema={res.zSchema}
          action={category === 'Artist' ? updateUserInfo.bind(null, urlId as string) : updatePlaylistDetails.bind(null, playlistId as string)}
        />
      )}
    </div>
  )
}