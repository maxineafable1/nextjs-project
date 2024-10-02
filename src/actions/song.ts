'use server'

import { getSession } from "./auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PlaylistFormData } from "@/components/playlist/playlist-form";

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

export async function searchSong(value: string, category: string) {
  if (!value) return []

  if (category === 'Playlist') {
    const songs = await prisma.song.findMany({
      where: {
        title: {
          contains: value
        }
      }
    })
    return songs
  }

  // only one album per song
  const songs = await prisma.song.findMany({
    where: {
      title: {
        contains: value
      },
      playlists: { none: { category: 'Album' } }
    }
  })
  return songs
}

export async function createPlaylist() {
  const session = await getSession()

  const playlistCount = await prisma.playlist.count({
    where: {
      userId: session.userId,
      category: { equals: 'Playlist' }
    }
  })

  const playlist = await prisma.playlist.create({
    data: {
      name: `My Playlist #${playlistCount < 1 ? 1 : playlistCount + 1}`,
      userId: session.userId,
      category: 'Playlist'
    }
  })

  redirect(`/playlist/${playlist.id}`)
}

export async function getPlaylist() {
  const session = await getSession()

  const playlists = await prisma.playlist.findMany({
    where: {
      userId: session.userId
    },
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true
            }
          }
        }
      },
    }
  })

  return playlists
}

export async function updatePlaylist(playlistId: string, songId: string) {
  const exists = await prisma.playlist.findFirst({
    where: {
      id: playlistId,
      songIds: {
        has: songId
      }
    }
  })

  if (exists) return

  const playlist = await prisma.playlist.update({
    where: {
      id: playlistId,
    },
    data: {
      songIds: {
        push: songId
      }
    }
  })

  if (playlist?.category === 'Album') {
    // TODO: one album only per song
    await prisma.song.update({
      where: {
        id: songId,
      },
      data: {
        playlistIds: { set: [playlist.id] }
      }
    })
  }

  revalidatePath(playlist?.category === 'Album' ? `/album/${playlist.id}` : `/playlist/${playlist.id}`)
}

export async function updatePlaylistDetails(userId: string, name: string, image?: string) {
  const playlist = await prisma.playlist.update({
    where: {
      id: userId,
    },
    data: {
      name,
      image,
    }
  })
  revalidatePath(`/playlist/${playlist.id}`)
}

export async function deletePlaylist(playlistId: string) {
  const session = await getSession()

  const exists = await prisma.playlist.findUnique({
    where: {
      userId: session.userId,
      id: playlistId
    }
  })

  if (!exists) return

  await prisma.playlist.delete({
    where: {
      userId: session.userId,
      id: playlistId
    }
  })

  redirect('/')
}

export async function deleteSongFromPlaylist(playlistId: string, songId: string) {
  const exists = await prisma.playlist.findUnique({
    where: {
      id: playlistId
    },
    select: {
      songIds: true
    }
  })

  if (!exists) return

  // const newSongs = exists.songs.filter(song => song.id !== songId)

  const playlist = await prisma.playlist.update({
    where: {
      id: playlistId,
    },
    data: {
      songIds: exists.songIds.filter(song => song !== songId)
    }
  })

  if (playlist.category === 'Album') {
    await prisma.song.update({
      where: {
        id: songId,
      },
      data: {
        playlistIds: { set: [] }
      }
    })
  }

  revalidatePath(`/playlist/${playlist.id}`)
}

export async function deleteSong(songId: string) {
  const session = await getSession()

  await prisma.song.delete({
    where: {
      artist: {
        id: session.userId
      },
      id: songId
    }
  })

  revalidatePath(`/artist/${session.userId}`)
}

export async function createAlbum(albumName: string, albumImage?: string) {
  const session = await getSession()

  const album = await prisma.playlist.create({
    data: {
      name: albumName,
      userId: session.userId,
      image: albumImage,
      category: 'Album',
    }
  })

  redirect(`/album/${album.id}`)
}