'use server'

import { SongFormData } from "@/components/song/upload-form";
import { getSession } from "./auth";
import { SongFormSchema } from "@/lib/definitions";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import fs from "node:fs/promises";
import { join } from "node:path";

export async function upload(formData: FormData) {
  const session = await getSession()

  const validatedFields = SongFormSchema.safeParse({
    title: formData.get('title'),
    lyrics: formData.get('lyrics'),
    image: formData.get('image'),
    song: formData.get('song'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { title, lyrics, image, song } = validatedFields.data

  const imgArrayBuffer = await image.arrayBuffer()
  const imgBuffer = Buffer.from(imgArrayBuffer)

  const imgFileName = `${Date.now()}${image.name}`
  const imgPath = join(process.cwd(), 'public', imgFileName)

  const songArrayBuffer = await song.arrayBuffer()
  const songBuffer = Buffer.from(songArrayBuffer)

  const songFileName = `${Date.now()}${song.name}`
  const songPath = join(process.cwd(), 'public', songFileName)

  await prisma.song.create({
    data: {
      title,
      lyrics,
      image: imgFileName,
      song: songFileName,
      artistId: session.userId,
    }
  })

  await fs.writeFile(imgPath, imgBuffer)
  await fs.writeFile(songPath, songBuffer)

  redirect('/')
}

export async function getSongs() {
  const songs = await prisma.song.findMany()
  return songs
}