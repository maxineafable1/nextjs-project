import { deleteSongFromPlaylist } from "@/actions/song";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import useModal from "@/hooks/useModal";
import { IoIosAddCircleOutline } from "react-icons/io";

type SongEllipsisProps = {
  active: boolean
  isCreate: boolean
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>
  setIsHover: React.Dispatch<React.SetStateAction<boolean>>
  playlistId: string | string[]
  songId: string
  artistId: string
  artistPage: boolean
  isDeleteOpen: boolean
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SongEllipsis({
  active,
  isCreate,
  setIsCreate,
  setIsHover,
  playlistId,
  songId,
  artistId,
  artistPage,
  isDeleteOpen,
  setIsDeleteOpen,
}: SongEllipsisProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const deleteSongFromPlaylistWithId = deleteSongFromPlaylist.bind(null, playlistId as string, songId)

  useEffect(() => {
    // wag alisin itong return para makapag play ng music
    if (!isCreate) return
    function handleClickOutside(e: MouseEvent) {
      if (!divRef.current?.contains(e.target as Node)
        && !btnRef.current?.contains(e.target as Node)
      ) {
        setIsCreate(false)
        setIsHover(false)
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
        ref={btnRef}
        onClick={() => {
          setIsCreate(true)
        }}
        className='text-neutral-200 hover:text-white hover:scale-105'
      >
        <FaEllipsis fontSize='1.125rem' />
      </button>
      <div
        ref={divRef}
        className={`
          absolute bg-neutral-800 rounded shadow w-52 p-1
          ${!isCreate && 'hidden'} overflow-hidden text-sm right-0
        `}
      >
        {!artistPage ? (
          <>
            {active ? (
              <>
                <form action={deleteSongFromPlaylistWithId}>
                  <button
                    className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                  >
                    <MdDeleteOutline /> Remove from this playlist
                  </button>
                </form>
              </>
            ) : (
              <>
              </>
            )}
            <Link
              href={`/artist/${artistId}`}
              className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <FaUser /> Go to artist
            </Link>
          </>
        ) : (
          <>
            {active ? (
              <>
                <button
                  onClick={() => {
                    setIsDeleteOpen(true)
                    setIsCreate(false)
                    setIsHover(false)
                  }}
                  className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                >
                  <MdDeleteOutline /> Delete song
                </button>
              </>
            ) : (
              <>

              </>
            )}

          </>
        )}
      </div>
    </div>
  )
}
