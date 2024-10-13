'use client'

import useModal from "@/hooks/useModal"
import Image from "next/image"
import { useState } from "react"
import { FaMusic } from "react-icons/fa"
import { MdEdit } from "react-icons/md";
import { z } from "zod"
import { PlaylistDetailSchema } from "@/lib/definitions"
import { useParams } from "next/navigation"
import Link from "next/link"
import EditPlaylistModal from "../reusables/edit-playlist-modal"
import { updatePlaylistDetails } from "@/actions/song"

type HeaderProps = {
  image: string | undefined | null
  name: string | undefined
  user: string | undefined | null
  count: number | undefined
  totalDuration: number | undefined
  active: boolean
  userId: string | undefined
  currUserId: string | undefined
  category: string | undefined
}

export type PlaylistDetailData = z.infer<typeof PlaylistDetailSchema>

export default function Header({
  image,
  name,
  user,
  count,
  totalDuration,
  active,
  userId,
  currUserId,
  category,
}: HeaderProps) {
  const { dialogRef, isOpen, setIsOpen } = useModal()
  const [isEditPhoto, setIsEditPhoto] = useState(false)

  const { id: playlistId } = useParams()

  function numToTime(value: number) {
    const minutes = Math.floor(value / 60)
    const seconds = Math.trunc(value - minutes * 60)
    return `${String(minutes).padStart(1, '0')} min ${String(seconds).padStart(2, '0')} sec`
  }

  const validUser = active && currUserId === userId
  const notLikedSongs = validUser && name !== 'Liked Songs'

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-full max-w-36 aspect-square"
        onMouseEnter={() => notLikedSongs && setIsEditPhoto(true)}
        onMouseLeave={() => notLikedSongs && setIsEditPhoto(false)}
        onClick={() => {
          if (notLikedSongs)
            isEditPhoto && setIsOpen(true)
        }}
      >
        {image ? (
          <div className="relative">
            {isEditPhoto ? (
              <>
                <Image
                  src={`${process.env.BASE_URL}/${image}`}
                  alt=""
                  width={500}
                  height={500}
                  className={`
                aspect-square object-cover block rounded-md
                ${isEditPhoto && 'opacity-30'}
              `}
                />
                <div className="absolute top-0 text-6xl flex flex-col gap-1 items-center justify-center p-6">
                  <MdEdit />
                  <p className="text-sm">Choose photo</p>
                </div>
              </>
            ) : (
              <Image
                src={`${process.env.BASE_URL}/${image}`}
                alt=""
                width={500}
                height={500}
                className={`aspect-square object-cover block rounded-md`}
              />
            )}
          </div>
        ) : (
          <div className="p-6 bg-neutral-700 rounded h-full text-6xl flex flex-col gap-1 items-center justify-center">
            {isEditPhoto ? (
              <>
                <MdEdit />
                <p className="text-sm">Choose photo</p>
              </>
            ) : (
              <FaMusic className="text-neutral-400" />
            )}
          </div>
        )}
      </div>
      <div>
        <h2
          title={name}
          className={`
            text-7xl font-extrabold mb-8 line-clamp-1
            ${notLikedSongs && 'cursor-pointer'}
          `}
          onClick={() => notLikedSongs && setIsOpen(true)}
        >
          {name}</h2>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/artist/${userId}`}
            className="font-semibold hover:underline"
          >
            {user}
          </Link>
          <p className="text-neutral-400">
            {(count !== 0) ? count === 1 ? `${count} song` : `${count} songs` : null}
            <span>
              {totalDuration ? `, ${numToTime(totalDuration)}` : null}
            </span>
          </p>
        </div>
      </div>
      {isOpen && (
        <EditPlaylistModal<PlaylistDetailData, typeof PlaylistDetailSchema>
          dialogRef={dialogRef}
          setIsOpen={setIsOpen}
          image={image}
          playlistName={name}
          category={category}
          registerImage="image"
          registerName="name"
          schema={PlaylistDetailSchema}
          action={updatePlaylistDetails.bind(null, playlistId as string)}
        />
      )}
    </div>
  )
}