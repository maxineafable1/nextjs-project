'use client'

import { useEffect, useState } from "react"
import { FaMusic, FaPlay } from "react-icons/fa"
import { useSongContext } from "@/contexts/song-context"
import Image from "next/image"
import useModal from "@/hooks/useModal"
import Link from "next/link"
import { FaUser } from "react-icons/fa";

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
  songs: SampleTypeForPlaylist[]
  active: boolean
  name: string | null
  isArtist: boolean
  albumId?: string
  artistId?: string
  playlistImage?: string | null
  roundedCard?: boolean
}

export default function CardGenre({
  songs,
  active,
  name,
  albumId,
  playlistImage,
  artistId,
  roundedCard,
  isArtist,
}: CardProps) {
  const { setCurrentSong, setCurrentAlbum } = useSongContext()
  const { dialogRef, isOpen, setIsOpen } = useModal()
  const [isHover, setIsHover] = useState(false)

  const random = Math.floor(Math.random() * songs.length)

  useEffect(() => {
    if (isOpen)
      setIsHover(false)
  }, [isOpen])

  return (
    <li
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="hover:bg-neutral-800 p-2 block rounded relative"
    >
      <Link href={albumId ? `/playlist/${albumId}` : `/artist/${artistId}`}>
        {playlistImage ? (
          <Image
            src={`/${playlistImage}`}
            alt=""
            width={500}
            height={500}
            className={`aspect-square object-cover block ${roundedCard ? 'rounded-full' : 'rounded-md'}`}
          />
        ) : (
          <div className="bg-neutral-700 w-full aspect-square rounded text-neutral-400 text-6xl flex flex-col gap-1 items-center justify-center">
            {isArtist ? <FaUser /> : <FaMusic />}
          </div>
        )}
        <p className="text-neutral-400 hover:text-white hover:underline mt-2 text-sm">
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
          <FaPlay fill="black" />
        </button>
      )}
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="text-white bg-neutral-800 rounded-lg max-w-screen-md relative"
        >
          <div className="p-16 flex items-center gap-8">
            {playlistImage ? (
              <Image
                src={playlistImage ? `/${playlistImage}` : `/${songs.at(0)?.image}`}
                alt=""
                width={500}
                height={500}
                className="aspect-square object-cover block rounded-md max-w-72"
              />
            ) : (
              <div className="p-6 bg-neutral-700 text-neutral-400 rounded w-full max-w-72 aspect-square text-9xl flex items-center justify-center">
                {isArtist ? <FaUser /> : <FaMusic />}
              </div>
            )}
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
    </li>
  )
}
