import Image from 'next/image'
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react'
import { SampleTypeForPlaylist } from '../song/card'
import { FaCheck, FaPlay } from 'react-icons/fa'
import useModal from '@/hooks/useModal'
import Link from 'next/link'
import SongEllipsis from '../song/ellipsis'
import { useParams } from 'next/navigation'
import { deleteSong, saveToLikedSongs } from '@/actions/song'
import UnauthModal from '../reusables/unauth-modal'
import DeleteModal from '../reusables/delete-modal'
import { IoIosAddCircleOutline } from 'react-icons/io'
// import HoverPlayButton from '../hover-play-btn'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

type SonglistPlayerProps = {
  song: SampleTypeForPlaylist
  index: number
  audioRef: MutableRefObject<(HTMLAudioElement | null)[]>
  setDurations: Dispatch<SetStateAction<(number | undefined)[]>>
  durations: (number | undefined)[]
  onClick: () => void
  setTotalDuration?: React.Dispatch<React.SetStateAction<number | undefined>>
  active: boolean
  viewAs: 'List' | 'Compact'
  artistPage: boolean
  albumName?: string | null
  category: string | undefined
  validUser: boolean
  albumId?: string | undefined
  likedSongIds: string[] | undefined
  playlistName?: string | undefined

  userPlaylists: {
    id: string;
    name: string;
    songIds: string[];
  }[]

  songAddedAt?: Date
  playlistSongId?: string

  playlistSongIds?: {
    id: string;
  }[]
}

export default function SonglistPlayer({
  song,
  index,
  audioRef,
  setDurations,
  durations,
  onClick,
  setTotalDuration,
  active,
  viewAs,
  artistPage,
  albumName,
  category,
  validUser,
  albumId,
  likedSongIds,
  playlistName,
  userPlaylists,
  songAddedAt,
  playlistSongId,
  playlistSongIds,
}: SonglistPlayerProps) {
  const [isHover, setIsHover] = useState(false)

  const { dialogRef, isOpen, setIsOpen } = useModal()
  const { dialogRef: deleteDialogRef, isOpen: isDeleteOpen, setIsOpen: setIsDeleteOpen } = useModal()

  const [isCreate, setIsCreate] = useState(false)

  const { id: playlistId } = useParams()

  const deleteSongWithId = deleteSong.bind(null, song.id, playlistSongIds!)

  function numToTime(value: number) {
    const minutes = Math.floor(value / 60)
    const seconds = Math.trunc(value - minutes * 60)
    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`
  }

  useEffect(() => {
    if (isOpen) {
      // para di ma-stuck hover pag open ng dialog
      setIsHover(false)
    }
  }, [isOpen])

  const saveToLikedSongsWithId = saveToLikedSongs.bind(null, song.id)

  dayjs.extend(relativeTime)

  return (
    <li
      key={song.id}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => !isCreate && setIsHover(false)}
      className={`flex items-center gap-4 py-2 px-4 rounded
        ${isHover && 'bg-neutral-700'}
      `}
    >
      <div className="w-5 text-center">
        {isHover ? (
          <button
            onClick={() => {
              if (active) {
                onClick()
              } else {
                setIsOpen(true)
              }
            }}
          >
            <FaPlay />
          </button>
        ) : (
          <p>{index + 1}</p>
        )}
      </div>
      {isOpen && (
        <UnauthModal
          dialogRef={dialogRef}
          isArtistIcon={false}
          playlistImage={song.image}
          setIsOpen={setIsOpen}
        />
      )}
      <div className="flex items-center gap-2 w-full relative">
        <audio
          key={song.song}
          ref={ref => {
            audioRef.current[index] = ref
          }}
          src={`${process.env.SONG_URL}/${song.song}`}
          preload="metadata"
          onLoadedMetadata={() => {
            // dont remove this so durations are updated
            const list = audioRef.current.map(audio => audio?.duration)
            if (list.length > 0) {
              setDurations(list)
              setTotalDuration?.(list.filter(l => l != null).reduce((a, b) => a + b, 0))
            }
          }}
        ></audio>
        {viewAs === 'List' ? (
          <>
            <div className='flex-1 flex items-center gap-2'>
              <Image
                src={`${process.env.BASE_URL}/${song.image}`}
                alt=""
                width={500}
                height={500}
                className="aspect-square max-w-10 object-cover block rounded-md"
              />
              <div >
                <p className='hover:underline'>
                  {song.title}
                </p>
                {category !== 'Artist' && (
                  <Link
                    href={`/artist/${song.artistId}`}
                    className={`
                    text-neutral-400 text-sm hover:underline block
                      ${isHover && 'text-white'} 
                    `}
                  >
                    {song.artist.name}
                  </Link>
                )}
              </div>
            </div>
            {category === 'Playlist' && (
              <>
                <div
                  className={`
                 text-neutral-400 text-sm
                  ${isHover && 'text-white'} mx-auto flex-1
                `}
                >
                  <Link
                    href={`/album/${song.playlistIds.at(0)}`}
                    className="hover:underline"
                  >
                    {albumName}
                  </Link>
                </div>
                {validUser && (
                  <div className='text-sm text-neutral-400 flex-1'>
                    {dayjs(songAddedAt).fromNow()}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div className='flex-1'>
              <span className='hover:underline'>
                {song.title}
              </span>
            </div>
            {category !== 'Artist' && (
              <div
                className={`
                text-neutral-400 text-sm block
                  ${isHover && 'text-white'} mx-auto flex-1
                `}
              >
                <Link
                  href={`/artist/${song.artistId}`}
                  className='hover:underline'
                >
                  {song.artist.name}
                </Link>
              </div>
            )}
            {category === 'Playlist' && (
              <>
                <div
                  className={`
                text-neutral-400 text-sm block
                  ${isHover && 'text-white'} mx-auto flex-1
                `}
                >
                  <Link
                    href={`/album/${albumId}`}
                    className='hover:underline'
                  >
                    {albumName}
                  </Link>
                </div>
              </>
            )}
          </>
        )}
        {isHover && (
          <form
            action={(active && likedSongIds?.includes(song.id)) ? '' : saveToLikedSongsWithId}
            className='absolute right-10 grid'
            onClick={() => {
              if (!active) {
                alert('login pls')
              }
            }}
          >
            <button
              title={`${(active && likedSongIds?.includes(song.id)) ? 'Remove from Liked Songs' : 'Add to Liked Songs'}`}
              className={`hover:scale-110 justify-self-center`}
            >
              {(active && likedSongIds?.includes(song.id)) ? (
                <FaCheck
                  className={`bg-green-500 text-black p-1 rounded-full `}
                />
              ) : (
                <IoIosAddCircleOutline
                  fontSize='1.125rem'
                  className='text-neutral-400 hover:text-white'
                />
              )}
            </button>
          </form>
        )}
        <div
          className={`text-sm ${(
            (category !== 'Playlist' && viewAs === 'List') ||
            (category === 'Artist' && viewAs === 'Compact'))
            && 'ml-auto'}
          `}>
          {durations[index] && numToTime(durations[index])}
        </div>
      </div>
      <div className="w-5 text-center">
        {isHover && (
          <SongEllipsis
            isCreate={isCreate}
            setIsCreate={setIsCreate}
            setIsHover={setIsHover}
            playlistId={playlistId}
            songId={song.id}
            artistId={song.artistId}
            artistPage={artistPage}
            setIsDeleteOpen={setIsDeleteOpen}
            category={category}
            validUser={validUser}
            albumId={albumId}
            likedSongIds={likedSongIds}
            playlistName={playlistName}
            userPlaylists={userPlaylists}
            playlistSongId={playlistSongId}
          />
        )}
      </div>
      {isDeleteOpen && (
        <DeleteModal
          deleteDialogRef={deleteDialogRef}
          nameToDelete={song.title}
          setIsDeleteOpen={setIsDeleteOpen}
          action={deleteSongWithId}
          category={category}
        />
      )}
    </li>
  )
}
