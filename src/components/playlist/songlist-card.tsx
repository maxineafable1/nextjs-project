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
import { IoIosAddCircleOutline } from "react-icons/io"
import { addOtherUserPlaylist, deleteFromLibrary } from "@/actions/song"
import { useParams } from "next/navigation"
import { FaCheck } from "react-icons/fa6";

type SonglistCardProps = {
  // songs: SampleTypeForPlaylist[] | undefined
  playlistSongs: {
    id: string;
    songId: string;
    playlistId: string;
    addedAt: Date;
    song: SampleTypeForPlaylist
  }[]



  active: boolean
  setTotalDuration: React.Dispatch<React.SetStateAction<number | undefined>>
  image: string | null | undefined
  playlistName: string | undefined
  category: string | undefined
  currUserId: string
  playlistUserId: string | undefined
  isInLibrary: { id: string } | null

  likedSongIds: string[] | undefined
  userPlaylists: {
    id: string;
    name: string;
    songIds: string[];
  }[]
}

export default function SonglistCard({
  playlistSongs,
  active,
  setTotalDuration,
  image,
  playlistName,
  category,
  currUserId,
  playlistUserId,
  isInLibrary,
  likedSongIds,
  userPlaylists,
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

  }, [playlistSongs?.length])

  const validUser = active && currUserId === playlistUserId

  const { id: playlistUrlId } = useParams()
  const addOtherUserPlaylistWithId = addOtherUserPlaylist.bind(null, playlistUrlId as string, category as string)
  const deleteFromLibraryWithId = deleteFromLibrary.bind(null, playlistUrlId as string, category as string)

  return (
    <>
      {playlistSongs?.length !== 0 && (
        <>
          <div className="flex items-center gap-6 my-4">
            <button
              onClick={e => {
                if (!playlistSongs) return
                const random = Math.floor(Math.random() * playlistSongs?.length)
                if (active) {
                  // setCurrentSong(songs[random])
                  setCurrentSong(playlistSongs[random].song)
                  // setCurrentAlbum(songs)
                  setCurrentAlbum(playlistSongs.map(s => s.song))
                } else {
                  setIsOpen(true)
                }
              }}
              className="bg-green-500 p-4 rounded-full hover:scale-110 hover:bg-green-400"
            >
              <FaPlay fill="black" />
            </button>
            {!validUser && (
              <form
                action={(active && isInLibrary) ? deleteFromLibraryWithId : addOtherUserPlaylistWithId}
                className="grid"
              >
                <button
                  className={`
                    text-neutral-400 hover:text-white hover:scale-105
                    ${(active && isInLibrary) && 'bg-green-500 p-2 rounded-full'}
                  `}
                  onClick={() => {
                    if (!active) {
                      alert('login pls')
                    }
                  }}
                >
                  {(active && isInLibrary) ? (
                    <FaCheck
                      title={(active && isInLibrary) ? 'Remove from Your Library' : 'Add to Your Library'}
                      // fontSize='1.5rem'
                      className={`text-black`}
                    />
                  ) : (
                    <IoIosAddCircleOutline fontSize='1.5rem' />
                  )}
                </button>
              </form>
            )}
            {playlistName !== 'Liked Songs' && (
              <Ellipsis
                playlistName={playlistName}
                image={image}
                category={category}
                validUser={validUser}
                isInLibrary={isInLibrary}
                addOtherUserPlaylistWithId={addOtherUserPlaylistWithId}
                deleteFromLibraryWithId={deleteFromLibraryWithId}
              />
            )}
            <ListCompact
              viewAs={viewAs}
              setViewAs={setViewAs}
            />
          </div>
          {isOpen && (
            <UnauthModal
              dialogRef={dialogRef}
              // firstSongImage={songs?.at(0)?.image}
              firstSongImage={playlistSongs.at(0)?.song.image}
              isArtistIcon={false}
              playlistImage={image}
              setIsOpen={setIsOpen}
            />
          )}
          <div className="p-2 px-4 flex items-center gap-4 text-sm text-neutral-400">
            <p className="w-5 text-center">#</p>
            <p className="flex-1">Title</p>
            {category === 'Playlist' ? (
              <>
                {viewAs === 'Compact' ? (
                  <>
                    <p className="flex-1">Artist</p>
                    <p className="flex-1">Album</p>
                  </>
                ) : (
                  <>
                    <p className="flex-1">Album</p>
                    {validUser && (
                      <p className="flex-1">Date added</p>
                    )}
                  </>
                )}
              </>
              // <p className="mx-auto flex-1">{viewAs === 'List' ? 'Album' : 'Artist'}</p>
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
        {playlistSongs?.map((playlistSong, index) => (
          <SonglistPlayer
            key={playlistSong.id}
            song={playlistSong.song}
            index={index}
            audioRef={audioRef}
            setDurations={setDurations}
            durations={durations}
            onClick={() => {
              if (!playlistSongs) return
              if (active) {
                // setCurrentSong(songs[random])
                setCurrentSong(playlistSongs[index].song)
                // setCurrentAlbum(songs)
                setCurrentAlbum(playlistSongs.map(s => s.song))
              }
            }}
            setTotalDuration={setTotalDuration}
            active={active}
            viewAs={viewAs}
            artistPage={false}
            // albumName={song.playlists?.at(0)?.name}
            // albumId={song.playlistIds.at(0)}
            albumName={playlistSong.song.playlists?.at(0)?.name}
            albumId={playlistSong.song.playlistIds.at(0)}
            category={category}
            validUser={validUser}
            likedSongIds={likedSongIds}
            playlistName={playlistName}
            userPlaylists={userPlaylists}

            songAddedAt={playlistSong.addedAt}
            playlistSongId={playlistSong.id}
          />
        ))}
      </ul>
      {playlistSongs?.length !== 0 && <div className="bg-neutral-700 h-px w-full my-2"></div>}
    </>
  )
}
