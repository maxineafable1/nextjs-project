import { deletePlaylist } from '@/actions/song'
import useModal from '@/hooks/useModal'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { FaEllipsis } from 'react-icons/fa6'
import { FiMinusCircle } from 'react-icons/fi'
import { MdEdit } from 'react-icons/md'
import EditPlaylistModal from './reusables/edit-playlist-modal'
import { IoIosAddCircleOutline } from "react-icons/io";

type EllipsisProps = {
  playlistName: string | undefined
  image: string | null | undefined
  category: string | undefined
  validUser: boolean
}

export default function Ellipsis({
  playlistName,
  image,
  category,
  validUser,
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
        className="text-neutral-400 hover:text-white hover:scale-105"
      >
        <FaEllipsis fontSize='1.5rem' />
      </button>
      <div
        ref={divRef}
        className={`
          absolute bg-neutral-800 rounded shadow w-48 p-1
          ${!isCreate && 'hidden'} overflow-hidden text-sm
        `}
      >
        {validUser ? (
          <>
            <button
              onClick={() => setIsOpen(true)}
              className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <FiMinusCircle /> Delete
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <MdEdit /> Edit details
            </button>
          </>
        ) : (
          <>
            <button
              // onClick={() => setIsEditOpen(true)}
              className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <MdEdit /> Temporary
            </button>
          </>
        )}
      </div>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className='bg-white p-6 rounded-lg overflow-hidden w-full max-w-md'
        >
          <div className='flex flex-col gap-2 w-full'>
            <h2 className='font-bold text-2xl'>Delete from Your Library?</h2>
            <p className='text-sm'>This will delete <span className='font-bold'>{playlistName}</span> from Your Library.</p>
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
          playlistId={playlistId}
          image={image}
          playlistName={playlistName}
          category={category}
        />
      )}
    </div>
  )
}
