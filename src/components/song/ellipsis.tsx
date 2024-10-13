import { createPlaylistWithSong, deleteSongFromPlaylist, removeFromLikedSongs, saveToLikedSongs, updatePlaylist } from "@/actions/song";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { MdDeleteOutline, MdLibraryMusic } from "react-icons/md";
import { FaCaretRight, FaCheck, FaUser } from "react-icons/fa";
import { IoIosAdd, IoIosAddCircleOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import AddToPlaylistModal from "../add-to-playlist";
import useModal from "@/hooks/useModal";
import LoginPopup from "../login-popup";
import { useLoginPopupContext } from "@/contexts/login-popup-context";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

type SongEllipsisProps = {
  isCreate: boolean
  setIsCreate: React.Dispatch<React.SetStateAction<boolean>>
  setIsHover: React.Dispatch<React.SetStateAction<boolean>>
  playlistId: string | string[]
  songId: string
  artistId: string
  artistPage: boolean
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
  category: string | undefined
  validUser: boolean
  albumId: string | undefined
  likedSongIds: string[] | undefined
  playlistName?: string | undefined

  userPlaylists: {
    id: string;
    name: string;
    songIds: string[];
  }[]

  playlistSongId: string | undefined
  active: boolean
}

export default function SongEllipsis({
  isCreate,
  setIsCreate,
  setIsHover,
  playlistId,
  songId,
  artistId,
  artistPage,
  setIsDeleteOpen,
  category,
  validUser,
  albumId,
  likedSongIds,
  playlistName,
  userPlaylists,
  playlistSongId,
  active,
}: SongEllipsisProps) {
  const [isInnerHover, setIsInnerHover] = useState(false)
  const { dialogRef, isOpen, setIsOpen } = useModal()

  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    playlistName: string,
    playlistId: string,
  } | null>(null)

  const { setIsPopup } = useLoginPopupContext()

  const [searchValue, setSearchValue] = useState('')

  const divRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const playlistRef = useRef<HTMLDivElement>(null)

  const deleteSongFromPlaylistWithId = deleteSongFromPlaylist.bind(null, playlistId as string, songId, playlistSongId as string)

  // useEffect(() => {
  //   // wag alisin itong return para makapag play ng music
  //   if (!isCreate) return
  //   function handleClickOutside(e: MouseEvent) {
  //     if (!divRef.current?.contains(e.target as Node)
  //       && !btnRef.current?.contains(e.target as Node)
  //       && !playlistRef.current?.contains(e.target as Node)
  //     ) {
  //       setIsCreate(false)
  //       setIsHover(false)
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside)
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  // }, [isCreate])

  function handleClickOutside() {
    // wag alisin itong return para makapag play ng music
    if (!isCreate) return
    setIsCreate(false)
    setIsHover(false)
  }

  useOnClickOutside([divRef, btnRef, playlistRef], handleClickOutside, [isCreate])

  const saveToLikedSongsWithId = saveToLikedSongs.bind(null, songId)
  const removeFromLikedSongsWithId = removeFromLikedSongs.bind(null, songId, playlistSongId as string)

  const createPlaylistWithSongWithId = createPlaylistWithSong.bind(null, songId)

  return (
    <div className="relative grid">
      <button
        ref={btnRef}
        onClick={() => {
          setIsCreate(true)
        }}
        className='text-neutral-200 justify-self-center hover:text-white hover:scale-105'
      >
        <FaEllipsis fontSize='1.125rem' />
      </button>
      <div
        ref={divRef}
        className={`
          absolute bg-neutral-800 rounded shadow  ${!likedSongIds?.includes(songId) ? 'w-56' : 'w-64'} p-1
          ${!isCreate && 'hidden'} text-sm right-0 z-10
        `}
      >
        <div className="relative">
          {isInnerHover && (
            <div
              ref={playlistRef}
              className={`
                absolute -left-full ${likedSongIds?.includes(songId) && 'translate-x-8'}  bg-neutral-800  
                z-20 rounded p-1.5 ${active && 'min-h-36'} max-h-36 overflow-y-auto
              `}
              onMouseEnter={() => setIsInnerHover(true)}
            >
              <div
                className="relative bg-neutral-700 mb-1"
              >
                <CiSearch className="absolute text-xl left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  onChange={e => setSearchValue(e.target.value)}
                  className={`
                    border-none bg-neutral-700 rounded placeholder:text-sm 
                    placeholder:text-neutral-400 outline-none py-1 pl-8
                    text-sm
                  `}
                  placeholder="Find a playlist"
                />
              </div>
              <form
                action={active ? createPlaylistWithSongWithId : ''}
                onSubmit={e => {
                  if (!active) {
                    e.preventDefault()
                    setIsPopup(true)
                  }
                  setIsCreate(false)
                }}
              >
                <button
                  className="w-full text-sm flex items-center gap-1 p-2 hover:bg-neutral-600"
                >
                  <IoIosAdd className="text-base" /> New Playlist
                </button>
              </form>
              <div className="h-px w-full bg-neutral-700"></div>
              {active && (
                <ul>
                  {userPlaylists
                    .filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()))
                    ?.map(playlist => (
                      <Fragment key={playlist.id}>
                        <li
                          onClick={() => {
                            if (playlist.songIds.includes(songId)) {
                              setIsOpen(true)
                              setSelectedPlaylist({
                                playlistId: playlist.id,
                                playlistName: playlist.name
                              })
                            } else {
                              const updatePlaylistWithId = updatePlaylist.bind(null, playlist.id, songId)
                              updatePlaylistWithId()
                            }
                          }}
                          className={`
                            text-start p-2 text-sm hover:bg-neutral-600 cursor-pointer
                            line-clamp-1
                          `}
                        >
                          {playlist.name.split('').map((letter, i) => (
                            <span
                              key={i}
                              className={`
                                ${searchValue.toLowerCase().includes(letter.toLowerCase()) && 'bg-blue-400 rounded-full'}
                              `}
                            >
                              {letter}
                            </span>
                          ))}
                        </li>
                        {(isOpen && selectedPlaylist != null) && (
                          <AddToPlaylistModal
                            key={playlist.id}
                            dialogRef={dialogRef}
                            setIsOpen={setIsOpen}
                            playlistName={selectedPlaylist.playlistName}
                            clickedPlaylistId={selectedPlaylist.playlistId}
                          />
                        )}
                      </Fragment>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div
          onMouseEnter={e => setIsInnerHover(true)}
          className={`flex items-center gap-2 p-2 ${isInnerHover && 'bg-neutral-600'}`}
        >
          <IoIosAdd />
          <p>Add to playlist</p>
          <FaCaretRight className="ml-auto" />
        </div>
        {!artistPage ? (
          <>
            {(validUser && playlistName !== 'Liked Songs') ? (
              <>
                <form
                  action={deleteSongFromPlaylistWithId}
                  onMouseEnter={() => setIsInnerHover(false)}
                >
                  <button
                    className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                  >
                    <MdDeleteOutline /> Remove from this {category?.toLowerCase()}
                  </button>
                </form>
              </>
            ) : (
              <>
              </>
            )}
            <Link
              href={`/artist/${artistId}`}
              onMouseEnter={() => setIsInnerHover(false)}
              className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
            >
              <FaUser /> Go to artist
            </Link>
            {(albumId && category === 'Playlist') && (
              <Link
                href={`/album/${albumId}`}
                onMouseEnter={() => setIsInnerHover(false)}
                className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
              >
                <MdLibraryMusic /> Go to album
              </Link>
            )}
          </>
        ) : (
          <>
            {validUser ? (
              <>
                <button
                  onClick={() => {
                    setIsDeleteOpen(true)
                    setIsCreate(false)
                    setIsHover(false)
                  }}
                  onMouseEnter={() => setIsInnerHover(false)}
                  className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                >
                  <MdDeleteOutline /> Delete song
                </button>
              </>
            ) : (
              <>
                {albumId && (
                  <Link
                    href={`/album/${albumId}`}
                    onMouseEnter={() => setIsInnerHover(false)}
                    className="w-full inline-flex items-center gap-2 text-start p-2 hover:bg-neutral-600"
                  >
                    <MdLibraryMusic /> Go to album
                  </Link>
                )}
              </>
            )}
          </>
        )}
        <form
          action={active ? (likedSongIds?.includes(songId) ? removeFromLikedSongsWithId : saveToLikedSongsWithId) : ''}
          onMouseEnter={() => setIsInnerHover(false)}
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
            {active && likedSongIds?.includes(songId) ? (
              <>
                <FaCheck className={`bg-green-500 text-black p-0.5 rounded-full`} /> Remove from your Liked Songs
              </>
            ) : (
              <>
                <IoIosAddCircleOutline /> Save to your Liked Songs
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
