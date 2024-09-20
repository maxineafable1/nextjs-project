'use client'

import { useSongContext } from "@/contexts/song-context";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";

export type Song = {
  id: string;
  title: string;
  lyrics: string;
  image: string;
  song: string;
  artistId: string;
}

type CardProps = {
  song: Song
}

export default function Card({ song }: CardProps) {
  const { setCurrentSong } = useSongContext()
  const [isHover, setIsHover] = useState(false)

  return (
    <li
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="hover:bg-neutral-800 p-2 rounded relative">
      <img
        src={song.image}
        alt=""
        className="aspect-square object-cover block rounded-md"
      />
      <h2 className="text-neutral-300 mt-2 text-sm">Artists names</h2>
      {isHover && (
        <button
          onClick={() => setCurrentSong(song)}
          className="absolute right-4 bottom-12 bg-green-500 p-4 rounded-full hover:scale-110 hover:bg-green-400"
        >
          <FaPlay fill="black" /></button>
      )}
    </li>
  )
}
