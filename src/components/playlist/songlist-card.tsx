'use client'

import { FaPlay } from "react-icons/fa"
import { SampleTypeForPlaylist } from "../song/card"
import { IoTimeOutline } from "react-icons/io5"
import { useEffect, useRef, useState } from "react"
import SonglistPlayer from "./songlist-player"
import { useSongContext } from "@/contexts/song-context"
import useModal from "@/hooks/useModal"
import Image from "next/image"
import Link from "next/link"
import Ellipsis from "../ellipsis"
import ListCompact from "./list-compact"

type SonglistCardProps = {
  songs: SampleTypeForPlaylist[] | undefined
  active: boolean
  setTotalDuration: React.Dispatch<React.SetStateAction<number | undefined>>
  image: string | null | undefined
  playlistName: string | undefined
}

export default function SonglistCard({
  songs,
  active,
  setTotalDuration,
  image,
  playlistName,
  
}: SonglistCardProps) {
  const { setCurrentSong, setCurrentAlbum } = useSongContext()
  const { dialogRef, isOpen, setIsOpen } = useModal()
  const [durations, setDurations] = useState<(number | undefined)[]>([])
  const [viewAs, setViewAs] = useState<'List' | 'Compact'>('List')

  const audioRef = useRef<(HTMLAudioElement | null)[]>([])

  useEffect(() => {
    if (!audioRef.current) return
    const audios = audioRef.current

    // TO GET DURATIONS OF EACH SONG WITHOUT BREAKING ANYTHING
    const list = audios.map(audio => !isNaN(audio?.duration!) ? audio?.duration : undefined)
    if (list.length > 0) {
      setDurations(list)
      setTotalDuration(list.filter(l => l != null).reduce((a, b) => a! + b!, 0))
    }

  }, [songs?.length])

  return (
    <>
      {songs?.length !== 0 && (
        <>
          <div className="flex items-center gap-6">
            <button
              onClick={e => {
                if (!songs) return
                const random = Math.floor(Math.random() * songs?.length)
                if (active) {
                  setCurrentSong(songs[random])
                  setCurrentAlbum(songs)
                } else {
                  setIsOpen(true)
                }
              }}
              className="bg-green-500 p-4 my-4 rounded-full hover:scale-110 hover:bg-green-400"
            >
              <FaPlay fill="black" />
            </button>
            <Ellipsis
              playlistName={playlistName}
              image={image}
              active={active}
            />
            <ListCompact 
              viewAs={viewAs}
              setViewAs={setViewAs}
            />
          </div>
          {isOpen && (
            <dialog
              ref={dialogRef}
              className="text-white max-w-screen-md rounded-lg relative"
            >
              <div className="bg-neutral-800 p-16 flex items-center gap-8">
                <Image
                  src={image ? `/${image}` : `/${songs?.at(0)?.image}`}
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
          <div className="p-2 px-4 flex items-center gap-4 text-sm text-neutral-400">
            <p className="w-5 text-center">#</p>
            <p>Title</p>
            <p className="ml-auto mr-10" title="Duration">
              <IoTimeOutline fontSize='1.125rem' />
            </p>
          </div>
          <div className="bg-neutral-700 h-px w-full my-2"></div>
        </>
      )}
      <ul>
        {songs?.map((song, index) => (
          <SonglistPlayer
            key={song.id}
            song={song}
            index={index}
            audioRef={audioRef}
            setDurations={setDurations}
            durations={durations}
            onClick={() => {
              if (!songs) return
              if (active) {
                setCurrentSong(songs[index])
                setCurrentAlbum(songs)
              }
            }}
            setTotalDuration={setTotalDuration}
            active={active}
            viewAs={viewAs}
            artistPage={false}
          />
        ))}
      </ul>
      {songs?.length !== 0 && <div className="bg-neutral-700 h-px w-full my-2"></div>}
    </>
  )
}
