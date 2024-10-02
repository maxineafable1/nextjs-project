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
import UnauthModal from "../reusables/unauth-modal"

type SonglistCardProps = {
  songs: SampleTypeForPlaylist[] | undefined
  active: boolean
  setTotalDuration: React.Dispatch<React.SetStateAction<number | undefined>>
  image: string | null | undefined
  playlistName: string | undefined
  category: string | undefined
  currUserId: string
  playlistUserId: string | undefined
}

export default function SonglistCard({
  songs,
  active,
  setTotalDuration,
  image,
  playlistName,
  category,
  currUserId,
  playlistUserId,
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

  const validUser = active && currUserId === playlistUserId

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
              category={category}
              validUser={validUser}
            />
            <ListCompact
              viewAs={viewAs}
              setViewAs={setViewAs}
            />
          </div>
          {isOpen && (
            <UnauthModal
              dialogRef={dialogRef}
              firstSongImage={songs?.at(0)?.image}
              isArtistIcon={false}
              playlistImage={image}
              setIsOpen={setIsOpen}
            />
          )}
          <div className="p-2 px-4 flex items-center gap-4 text-sm text-neutral-400">
            <p className="w-5 text-center">#</p>
            <p className="flex-1">Title</p>
            {category === 'Playlist' ? (
              <p className="mx-auto flex-1">{viewAs === 'List' ? 'Album' : 'Artist'}</p>
            ) : (
              <p className="mx-auto flex-1">{viewAs === 'Compact' && 'Artist'}</p>
            )}
            <p className={`mr-10`} title="Duration">
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
            albumName={song.playlists?.at(0)?.name}
            category={category}
            validUser={validUser}
          />
        ))}
      </ul>
      {songs?.length !== 0 && <div className="bg-neutral-700 h-px w-full my-2"></div>}
    </>
  )
}
