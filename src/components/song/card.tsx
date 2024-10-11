'use client'

import { useEffect, useState } from "react"
import { FaMusic, FaPlay } from "react-icons/fa"
import { useSongContext } from "@/contexts/song-context"
import Image from "next/image"
import useModal from "@/hooks/useModal"
import Link from "next/link"
import { FaUser } from "react-icons/fa";
import UnauthModal from "../reusables/unauth-modal"

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

type Playlist = {
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
  playlistIds: string[]
  artist: Artist
  playlists?: Playlist[]
}

type CardProps = {
  songs: SampleTypeForPlaylist[]
  active: boolean
  name: string | null
  isArtistIcon: boolean
  playlistImage?: string | null
  roundedCard: boolean
  href: string
}

export default function CardGenre({
  songs,
  active,
  name,
  playlistImage,
  roundedCard,
  isArtistIcon,
  href,
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
      <Link href={href}>
        {playlistImage ? (
          <Image
            src={`${process.env.BASE_URL}/${playlistImage}`}
            alt=""
            width={500}
            height={500}
            className={`aspect-square object-cover block ${roundedCard ? 'rounded-full' : 'rounded-md'}`}
          />
        ) : (
          <div
            className={`
              bg-neutral-700 w-full aspect-square text-neutral-400 text-6xl 
              flex flex-col gap-1 items-center justify-center
              ${roundedCard ? 'rounded-full' : 'rounded-md'}
            `}
          >
            {isArtistIcon ? <FaUser /> : <FaMusic />}
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
        <UnauthModal
          dialogRef={dialogRef}
          firstSongImage={songs.at(0)?.image}
          isArtistIcon={isArtistIcon}
          playlistImage={playlistImage}
          setIsOpen={setIsOpen}
        />
      )}
    </li>
  )
}
