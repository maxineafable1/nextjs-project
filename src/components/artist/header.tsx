'use client'

import useModal from "@/hooks/useModal"
import { ArtistInfoSchema } from "@/lib/definitions"
import Image from "next/image"
import { useState } from "react"
import { MdEdit } from "react-icons/md"
import { z } from "zod"
import { FaUser } from "react-icons/fa";
import EditArtistModal from "../reusables/edit-artist-modal"

type ArtistHeaderProps = {
  active: boolean
  image: string | null | undefined
  name: string | null | undefined
  urlId: string
  currUserId: string
}

export type ArtistInfoData = z.infer<typeof ArtistInfoSchema>

export default function ArtistHeader({
  active,
  image,
  name,
  urlId,
  currUserId,
}: ArtistHeaderProps) {
  const [isEditPhoto, setIsEditPhoto] = useState(false)
  const { dialogRef, isOpen, setIsOpen } = useModal()
  
  const validUser = active && currUserId === urlId

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-36 aspect-square block"
        onMouseEnter={() => validUser && setIsEditPhoto(true)}
        onMouseLeave={() => validUser && setIsEditPhoto(false)}
        onClick={() => {
          if (validUser)
            isEditPhoto && setIsOpen(true)
        }}
      >
        {image ? (
          <div className="relative">
            {isEditPhoto ? (
              <>
                <Image
                  src={`/${image}`}
                  alt=""
                  width={500}
                  height={500}
                  className={`
                aspect-square object-cover block rounded-full
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
                src={`/${image}`}
                alt=""
                width={500}
                height={500}
                className={`aspect-square rounded-full object-cover block`}
              />
            )}
          </div>
        ) : (
          <div className="p-6 bg-neutral-700 rounded-full h-full text-6xl flex flex-col gap-1 items-center justify-center">
            {isEditPhoto ? (
              <>
                <MdEdit />
                <p className="text-sm">Choose photo</p>
              </>
            ) : (
              <FaUser className="text-neutral-400" />
            )}
          </div>
        )}
      </div>
      <div>
        <h2
          className={`text-7xl font-extrabold mb-8 ${validUser && 'cursor-pointer'}`}
          onClick={() => validUser && setIsOpen(true)}
        >
          {name}
        </h2>
      </div>
      {isOpen && (
        <EditArtistModal
          dialogRef={dialogRef}
          image={image}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          urlId={urlId}
          validUser={validUser}
          name={name}
        />
      )}
    </div>
  )
}
