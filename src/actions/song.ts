'use server'

import { getSession } from "./auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type NewDataType = {
  title: string
  genre: string
  lyrics: string
  image: string
  song: string
}

export async function upload(newData: NewDataType) {
  const session = await getSession()

  const { title, lyrics, image, song, genre } = newData
  console.log(newData)

  await prisma.song.create({
    data: {
      title,
      lyrics,
      image,
      genre,
      song,
      artistId: session.userId,
    }
  })

  revalidatePath('/')
  redirect('/')
}

export async function getSongs() {
  const songs = await prisma.song.findMany({
    include: {
      artist: {
        select: {
          name: true,
        }
      }
    }
  })
  return songs
}

