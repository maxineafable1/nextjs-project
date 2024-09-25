'use client'

import { useState } from "react"
import { FaMusic, FaPlay } from "react-icons/fa"
import { useSongContext } from "@/contexts/song-context"
import Image from "next/image"
import useModal from "@/hooks/useModal"
import Link from "next/link"

export type SongType = {
  id: string;
  title: string;
  lyrics: string;
  image: string;
  song: string;
  artistId: string;
  artist: Artist
}

type Artist = {
  name: string | null
}

// TEMPORARY TYPE FOR PLAYLIST SONGS
export type SampleTypeForPlaylist = {
  id: string;
  title: string;
  lyrics: string;
  image: string;
  song: string;
  genre: string;
  artistId: string;
  playlistIds: string[];
  artist: Artist
}

type CardProps = {
  // songByGenre: [string, SongType[]]
  songs: SampleTypeForPlaylist[]
  active: boolean
  name: string
  albumId: string
  playlistImage: string | null
}

export default function CardGenre({ songs, active, name, albumId, playlistImage }: CardProps) {
  const { setCurrentSong, setCurrentAlbum } = useSongContext()
  const { dialogRef, setIsOpen } = useModal()
  const [isHover, setIsHover] = useState(false)

  const random = Math.floor(Math.random() * songs.length)

  return (
    <li
      // href={`/playlist/${albumId}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="hover:bg-neutral-800 p-2 block rounded relative"
    >
      <Link href={`/playlist/${albumId}`}>
        {playlistImage ? (
          <Image
            src={`/${playlistImage}`}
            alt=""
            width={500}
            height={500}
            className="aspect-square object-cover block rounded-md"
          />
        ) : (
          <div className="bg-neutral-700 w-full aspect-square rounded text-6xl flex flex-col gap-1 items-center justify-center">
            <FaMusic className="text-neutral-400" />
          </div>
        )}
        <p className="text-neutral-300 mt-2 text-sm">
          {name}
        </p>
      </Link>
      {isHover && (
        <button
          onClick={e => {
            e.stopPropagation()
            if (active) {
              setCurrentSong(songs[random])
              setCurrentAlbum(songs)
            } else {
              setIsOpen(true)
            }
          }}
          className="absolute right-4 bottom-12 bg-green-500 p-4 rounded-full hover:scale-110 hover:bg-green-400"
        >
          <FaPlay fill="black" /></button>
      )}
      <dialog
        ref={dialogRef}
        className="text-white max-w-screen-md rounded-lg"
      >
        <div className="bg-neutral-800 p-16 flex gap-8">
          <Image
            src={`/${songs.at(0)?.image}`}
            alt=""
            width={500}
            height={500}
            className="aspect-square object-cover block rounded-md max-w-80"
          />
          <div className="text-center flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8">Start listening with a free Spotify account</h2>
            <Link
              href='/signup'
              className="bg-green-500 hover:bg-green-400 hover:scale-105 px-6 py-3 text-black rounded-full font-bold"
            >
              Sign up free</Link>
            <p className="mt-auto text-neutral-400 text-sm">
              Already have an account?
              <Link href='/login' className="text-white font-semibold ml-2 underline hover:text-green-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </dialog>
    </li>
  )
}
