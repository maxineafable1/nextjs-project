'use client'

import { useSongContext } from '@/contexts/song-context';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { FaMusic, FaPlay } from 'react-icons/fa';
import { SampleTypeForPlaylist } from '../song/card';

type PlaylistCardProps = {
  songs: SampleTypeForPlaylist[]
  albumName: string
  playlistImage: string | null
  albumId: string
}

export default function PlaylistCard({ songs, albumName, playlistImage, albumId }: PlaylistCardProps) {
  const { id } = useParams()
  const { setCurrentSong, setCurrentAlbum } = useSongContext()
  const [isHover, setIsHover] = useState(false)

  const random = Math.floor(Math.random() * songs.length)

  return (
    <Link
      href={`/playlist/${albumId}`}
      className={`
        flex items-center gap-4 hover:bg-neutral-700 rounded p-2
        ${albumId === id && 'bg-neutral-600'}
      `}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={`max-w-10 relative w-full aspect-square rounded 
          flex flex-col gap-1 items-center justify-center ${isHover ? 'bg-neutral-600' : 'bg-neutral-700'}
        `}
        onClick={e => {
          e.preventDefault()
          if (songs.length > 0) {
            setCurrentSong(songs[random])
            setCurrentAlbum(songs)
          }
        }}
      >
        {playlistImage ? (
          <>
            {isHover ? (
              <>
                <Image
                  src={`/${playlistImage}`}
                  alt=""
                  width={500}
                  height={500}
                  className="aspect-square object-cover block rounded-md"
                />
                <button className='absolute text-xl text-white'>
                  <FaPlay />
                </button>
              </>
            ) : (
              <Image
                src={`/${playlistImage}`}
                alt=""
                width={500}
                height={500}
                className="aspect-square object-cover block rounded-md"
              />
            )}
          </>
        ) : (
          <>
            {isHover ? (
              <>
                <FaMusic className={`text-neutral-400`} />
                <button className={`absolute text-white`}>
                  <FaPlay />
                </button>
              </>
            ) : (
              <FaMusic className="text-neutral-400" />
            )}
          </>
        )}
      </div>
      <div>
        <p className='font-medium'>{albumName}</p>
        <p className='text-sm text-neutral-400'>Playlist</p>
      </div>
    </Link>
  )
}
