import Image from 'next/image'
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react'
import { SampleTypeForPlaylist } from '../song/card'
import { FaPlay } from 'react-icons/fa'
import useModal from '@/hooks/useModal'
import Link from 'next/link'
import SongEllipsis from '../song/ellipsis'
import { useParams } from 'next/navigation'
import { deleteSong } from '@/actions/song'
import UnauthModal from '../reusables/unauth-modal'
import DeleteModal from '../reusables/delete-modal'
// import HoverPlayButton from '../hover-play-btn'

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
}: SonglistPlayerProps) {
  const [isHover, setIsHover] = useState(false)

  const { dialogRef, isOpen, setIsOpen } = useModal()
  const { dialogRef: deleteDialogRef, isOpen: isDeleteOpen, setIsOpen: setIsDeleteOpen } = useModal()

  const [isCreate, setIsCreate] = useState(false)

  const { id: playlistId } = useParams()

  const deleteSongWithId = deleteSong.bind(null, song.id)

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
      <div className="flex items-center gap-2 w-full">
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
                <p className='hover:underline'>{song.title}</p>
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
              <Link
                href={`/album/${song.playlistIds.at(0)}`}
                className={`
                hover:underline text-neutral-400 text-sm
                ${isHover && 'text-white'} mx-auto flex-1
              `}
              >
                {albumName}
              </Link>
            )}
          </>
        ) : (
          <>
            <p className='hover:underline flex-1'>{song.title}</p>
            {category !== 'Artist' && (
              <Link
                href={`/artist/${song.artistId}`}
                className={`
                text-neutral-400 text-sm hover:underline block
                ${isHover && 'text-white'} mx-auto flex-1
              `}
              >
                {song.artist.name}
              </Link>
            )}
          </>
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
