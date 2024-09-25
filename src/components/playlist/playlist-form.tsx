'use client'

import { PlaylistSchema } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import InputForm from "../input-form"
import SearchForm from "../search-form"
import { updatePlaylist } from "@/actions/song"
import { useParams } from "next/navigation"
import { useState } from "react"

export type PlaylistFormData = z.infer<typeof PlaylistSchema>

export default function PlaylistForm() {
  const { register, formState: { errors }, handleSubmit, setValue } = useForm<PlaylistFormData>({
    mode: 'all',
    resolver: zodResolver(PlaylistSchema)
  })

  const { id: userId } = useParams()
  const [isFindMore, setIsFindMore] = useState(false)

  const onSubmit: SubmitHandler<PlaylistFormData> = async (data) => {
    try {
      const updatePlaylistWithId = updatePlaylist.bind(null, userId as string)
      const res = await updatePlaylistWithId(data.song)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col">
      {/* <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-1"
      >
        <label
          htmlFor="name"
          className="text-sm font-semibold"
        >
          Playlist Name</label>
        <InputForm
          id="name"
          register={register}
          name="name"
          errors={errors.name}
        />
      </form> */}
      <button
        className={`
          mt-4 font-semibold self-end text-sm
          ${isFindMore ? 'hidden' : 'block'}
        `}
        onClick={() => setIsFindMore(true)}
      >
        Find more</button>
      {isFindMore && (
        <SearchForm
          setPlaylistSong={setValue}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          setIsFindMore={setIsFindMore}
        />
      )}
    </div>
  )
}
