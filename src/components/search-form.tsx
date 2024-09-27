'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { searchSong } from "@/actions/song"
import Image from "next/image"
import { SubmitHandler, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { PlaylistFormData } from "./playlist/playlist-form"
import { IoClose } from "react-icons/io5";

type SearchSongsType = {
  id: string;
  title: string;
  lyrics: string;
  image: string;
  song: string;
  genre: string;
  artistId: string;
  playlistIds: string[];
}[]

type SearchFormProps = {
  setPlaylistSong: UseFormSetValue<PlaylistFormData>
  handleSubmit: UseFormHandleSubmit<PlaylistFormData>
  onSubmit: SubmitHandler<PlaylistFormData>
  register: UseFormRegister<PlaylistFormData>
  setIsFindMore: Dispatch<SetStateAction<boolean>>
}

export default function SearchForm({ setPlaylistSong, handleSubmit, onSubmit, register, setIsFindMore }: SearchFormProps) {
  const [songs, setSongs] = useState<SearchSongsType>([])
  const [value, setValue] = useState('')

  useEffect(() => {
    async function search() {
      return await searchSong(value)
    }
    search().then(songlist => setSongs(songlist))
    console.log('search song post')
  }, [value])

  const { ref } = register('song')

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div className="grid gap-1 mt-4 max-w-sm">
            <label
              htmlFor="search"
              className="text-xl font-bold"
            >
              Let's find something for your playlist</label>
            <input
              type="search"
              name="search"
              id="search"
              value={value}
              onChange={e => {
                setValue(e.target.value)
              }}
              placeholder="Search for songs"
              className="px-3 py-2 rounded bg-inherit border border-white "
            />
          </div>
          <button onClick={() => setIsFindMore(false)}>
            <IoClose fontSize='2rem' />
          </button>
        </div>
      </div>
      <ul className="mt-8">
        {songs?.map(song => (
          <li
            key={song.id}
            className="flex items-center gap-2 hover:bg-neutral-800 p-2 rounded"
          >
            <Image
              src={`/${song.image}`}
              alt=""
              width={500}
              height={500}
              className="aspect-square max-w-10 object-cover block rounded-md"
            />
            <div>
              <p>{song.title}</p>
              <p className="text-neutral-400 text-sm">Artist name</p>
            </div>
            <form className="ml-auto" onSubmit={handleSubmit(onSubmit)}>
              <button
                className="rounded-full border border-neutral-400 hover:border-white hover:scale-105 font-semibold px-3 py-1"
                ref={ref}
                onClick={() => {
                  setPlaylistSong('song', song.id)
                }}
              >
                Add
              </button>
            </form>
          </li>
        ))}
      </ul>
    </>
  )
}
