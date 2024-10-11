'use client'

import { useSongContext } from "@/contexts/song-context";
import useModal from "@/hooks/useModal";
import Image from "next/image";
import { SampleTypeForPlaylist } from "../song/card";
import { FaPlay } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SonglistPlayer from "../playlist/songlist-player";
import ListCompact from "../playlist/list-compact";
import UnauthModal from "../reusables/unauth-modal";
import Ellipsis from "../ellipsis";

type ArtistSongCardProps = {
  songs: (SampleTypeForPlaylist
    & {
      playlistSongs: {
        id: string;
      }[];
    }
  )[]

  active: boolean
  image: string | null | undefined
  urlId: string
  currUserId: string
  name: string | null | undefined

  likedSongIds: string[] | undefined
  artistPlaylist: {
    id: string;
    name: string;
    songIds: string[];
  }[]

  likedPlaylistSongIds: {
    id: string;
    songId: string;
  }[] | undefined
}

export default function ArtistSongCard({
  songs,
  active,
  image,
  urlId,
  currUserId,
  name,
  artistPlaylist,
  likedSongIds,
  likedPlaylistSongIds,
}: ArtistSongCardProps) {
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
    }

  }, [songs?.length])

  const validUser = active && currUserId === urlId

  return (
    <>
      {songs?.length !== 0 && (
        <>
          <div className="flex items-center gap-6 my-4">
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
              className="bg-green-500 p-4 rounded-full hover:scale-110 hover:bg-green-400"
            >
              <FaPlay fill="black" />
            </button>
            <Ellipsis
              playlistName={name}
              image={image}
              category={'Artist'}
              validUser={validUser}
              artistName={name}
              urlId={urlId}
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
              isArtistIcon={true}
              playlistImage={image}
              setIsOpen={setIsOpen}
            />
          )}
          <h2 className="text-2xl font-bold mt-8 mb-4">Songs</h2>
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
                viewAs={viewAs}
                artistPage={true}
                category="Artist"
                validUser={validUser}

                likedSongIds={likedSongIds}
                userPlaylists={artistPlaylist}
                playlistSongIds={song.playlistSongs}
                playlistSongId={likedPlaylistSongIds?.find(lp => lp.songId === song.id)?.id}
              />
            ))}
          </ul>
        </>
      )}
    </>
  )
}
