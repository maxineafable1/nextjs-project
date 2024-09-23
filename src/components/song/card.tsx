'use client'

import { useState } from "react"
import { FaPlay } from "react-icons/fa"
import { useSongContext } from "@/contexts/song-context"
import Image from "next/image"

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

type CardProps = {
  songByGenre: [string, SongType[]]
}

export default function CardGenre({ songByGenre }: CardProps) {
  const { setCurrentSong, setCurrentAlbum } = useSongContext()
  const [isHover, setIsHover] = useState(false)

  const random = Math.floor(Math.random() * songByGenre[1].length)

  return (
    <li
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="hover:bg-neutral-800 p-2 rounded relative"
    >
      <Image
        src={`/${songByGenre[1].at(0)?.image}`}
        alt=""
        width={500}
        height={500}
        className="aspect-square object-cover block rounded-md"
      />
      <p className="text-neutral-300 mt-2 text-sm">
        {songByGenre[0]}
      </p>
      {isHover && (
        <button
          onClick={() => {
            setCurrentSong(songByGenre[1][random])
            setCurrentAlbum(songByGenre[1])
          }}
          className="absolute right-4 bottom-12 bg-green-500 p-4 rounded-full hover:scale-110 hover:bg-green-400"
        >
          <FaPlay fill="black" /></button>
      )}
    </li>
  )
}
