'use client'

import { useSongContext } from "@/contexts/song-context";
import useModal from "@/hooks/useModal";
import Image from "next/image";
import { SampleTypeForPlaylist } from "../song/card";
import { FaPlay } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SonglistPlayer from "../playlist/songlist-player";

type ArtistSongCardProps = {
  songs: SampleTypeForPlaylist[] | undefined
  active: boolean
  image: string | null | undefined
  urlId: string
  currUserId: string
}

export default function ArtistSongCard({ 
  songs, 
  active, 
  image,
  urlId,
  currUserId,
}: ArtistSongCardProps) {
  const { setCurrentSong, setCurrentAlbum } = useSongContext()
  const { dialogRef, isOpen, setIsOpen } = useModal()

  const [durations, setDurations] = useState<(number | undefined)[]>([])

  const audioRef = useRef<(HTMLAudioElement | null)[]>([])

  useEffect(() => {
    if (!audioRef.current) return
    const audios = audioRef.current

    // TO GET DURATIONS OF EACH SONG WITHOUT BREAKING ANYTHING
    const list = audios.map(audio => !isNaN(audio?.duration!) ? audio?.duration : undefined)
    if (list.length > 0) {
      setDurations(list)
    }

  }, [songs?.length])

  const validUser = active && currUserId === urlId

  return (
    <>
      {songs?.length !== 0 && (
        <>
          <div className="flex items-center gap-4">
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
            {validUser && (
              <Link
                href='/songs/upload'
                className="font-semibold text-sm px-3 py-1 hover:scale-105 hover:border-white border border-neutral-500 rounded-full"
              >
                Upload
              </Link>
            )}
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
          <h2 className="text-2xl font-bold mb-4">Popular</h2>
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
                active={active}
              />
            ))}
          </ul>
        </>
      )}
    </>
  )
}
