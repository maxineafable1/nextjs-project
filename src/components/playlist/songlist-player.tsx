import Image from 'next/image'
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react'
import { SampleTypeForPlaylist } from '../song/card'
import { FaPlay } from 'react-icons/fa'
import useModal from '@/hooks/useModal'
import Link from 'next/link'

type SonglistPlayerProps = {
  song: SampleTypeForPlaylist
  index: number
  audioRef: MutableRefObject<(HTMLAudioElement | null)[]>
  setDurations: Dispatch<SetStateAction<(number | undefined)[]>>
  durations: (number | undefined)[]
  onClick: () => void
  setTotalDuration?: React.Dispatch<React.SetStateAction<number | undefined>>
  active: boolean
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
}: SonglistPlayerProps) {
  const [isHover, setIsHover] = useState(false)
  const { dialogRef, isOpen, setIsOpen } = useModal()

  function numToTime(value: number) {
    const minutes = Math.floor(value / 60)
    const seconds = Math.trunc(value - minutes * 60)
    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`
  }

  useEffect(() => {
    if (isOpen) {
      setIsHover(false)
    }
  }, [isOpen])

  return (
    <li
      key={song.id}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex items-center gap-4 hover:bg-neutral-800 py-2 px-4 rounded"
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
        <dialog
          ref={dialogRef}
          className="text-white max-w-screen-md rounded-lg relative"
        >
          <div className="bg-neutral-800 p-16 flex items-center gap-8">
            <Image
              src={`/${song.image}`}
              alt=""
              width={500}
              height={500}
              className="aspect-square object-cover block rounded-md max-w-72"
            />
            <div className="flex flex-col gap-8 items-center">
              <h2 className="text-3xl text-center font-bold">
                Start listening with a free Spotify account
              </h2>
              <Link
                href='/signup'
                className="bg-green-500 hover:bg-green-400 hover:scale-105 px-6 py-3 text-black rounded-full font-bold"
              >
                Sign up free</Link>
              <p className="text-neutral-400 text-sm">
                Already have an account?
                <Link href='/login' className="text-white font-semibold ml-2 underline hover:text-green-400">
                  Login
                </Link>
              </p>
            </div>
          </div>
          <button className="fixed mt-4 left-1/2 font-semibold text-neutral-400 hover:text-white hover:scale-105">Close</button>
        </dialog>
      )}
      <div className="flex items-center gap-2 w-full">
        <audio
          key={song.song}
          ref={ref => {
            audioRef.current[index] = ref
          }}
          src={`/${song.song}`}
          preload="metadata"
          onLoadedMetadata={() => {
            // dont remove this so durations are updated
            const list = audioRef.current.map(audio => audio?.duration)
            if (list.length > 0) {
              setDurations(list)
              setTotalDuration && setTotalDuration(list.reduce((a, b) => a! + b!, 0))
            }
          }}
        ></audio>
        <Image
          src={`/${song.image}`}
          alt=""
          width={500}
          height={500}
          className="aspect-square max-w-10 object-cover block rounded-md"
        />
        <div>
          <p>{song.title}</p>
          <p className="text-neutral-400 text-sm">{song.artist.name}</p>
        </div>
        <div className="ml-auto text-sm">
          {durations[index] && numToTime(durations[index])}
        </div>
      </div>
    </li>
  )
}
