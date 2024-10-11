'use server'

import { getSession } from "./auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PlaylistFormData } from "@/components/playlist/playlist-form";
import { s3Client } from "@/app/api/s3-upload/route";
import { DeleteObjectCommand, waitUntilObjectNotExists } from "@aws-sdk/client-s3";

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
      },
      include: {
        artist: {
          select: {
            name: true
          }
        }
      }
    })
    return songs
  }

  // only one album per song
  const session = await getSession()
  const songs = await prisma.song.findMany({
    where: {
      artistId: session.userId,
      title: {
        contains: value
      },
      playlists: { none: { category: 'Album' } }
    },
    include: {
      artist: {
        select: {
          name: true
        }
      }
    }
  })
  return songs
}

export async function createPlaylist() {
  const session = await getSession()

  const playlistCount = await prisma.playlist.count({
    where: {
      userId: session.userId,
      AND: [
        {
          category: { equals: 'Playlist' },
          NOT: {
            name: { equals: 'Liked Songs' }
          }
        }
      ]
    }
  })

  const playlist = await prisma.playlist.create({
    data: {
      name: `My Playlist #${playlistCount < 1 ? 1 : playlistCount + 1}`,
      userId: session.userId,
      category: 'Playlist'
    }
  })

  // automatically add playlist to library
  await prisma.library.update({
    where: {
      userId: session.userId,
    },
    data: {
      playlistIds: { push: playlist.id }
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
  const session = await getSession()

  const exists = await prisma.playlist.findUnique({
    where: {
      userId: session.userId,
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
      },
    }
  })

  await prisma.playlistSong.create({
    data: {
      playlistId,
      songId,
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

export async function updatePlaylistDetails(playlistId: string, name: string, image?: string) {
  const session = await getSession()

  const exists = await prisma.playlist.findUnique({
    where: {
      userId: session.userId,
      id: playlistId
    }
  })

  if (!exists) return

  if (image) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${exists.image}`,
      })
    )
  }

  const playlist = await prisma.playlist.update({
    where: {
      id: playlistId,
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

  if (exists.image) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${exists.image}`,
      })
    )
  }

  const libraryPlaylist = await prisma.library.findFirst({
    where: {
      userId: session.userId,
      playlistIds: { has: playlistId }
    },
    select: {
      playlistIds: true
    }
  })

  // remove the playlist from library
  await prisma.library.update({
    where: {
      userId: session.userId,
    },
    data: {
      playlistIds: libraryPlaylist?.playlistIds.filter(playlist => playlist !== playlistId)
    }
  })

  // to delete all instance of songs in this playlist
  await prisma.playlistSong.deleteMany({
    where: {
      playlistId
    }
  })

  await prisma.playlist.delete({
    where: {
      userId: session.userId,
      id: playlistId
    }
  })

  redirect('/')
}

export async function deleteSongFromPlaylist(playlistId: string, songId: string, playlistSongId: string) {
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

  await prisma.playlistSong.delete({
    where: {
      playlistId,
      id: playlistSongId
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

export async function deleteSong(songId: string, playlistSongsIds: { id: string; }[]) {
  const session = await getSession()

  const exists = await prisma.song.findUnique({
    where: { id: songId, artistId: session.userId }
  })

  if (!exists) return

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `images/${exists.image}`,
    })
  )

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `songs/${exists.song}`,
    })
  )

  if (playlistSongsIds.length > 0) {
    await prisma.playlistSong.deleteMany({
      where: {
        id: { in: playlistSongsIds.map(p => p.id) }
      }
    })
  }

  await prisma.song.delete({
    where: {
      artistId: session.userId,
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

  // automatically add album to library
  await prisma.library.update({
    where: {
      userId: session.userId,
    },
    data: {
      playlistIds: { push: album.id }
    }
  })

  redirect(`/album/${album.id}`)
}

export async function addOtherUserPlaylist(playlistId: string, category: string) {
  const session = await getSession()

  const exists = await prisma.library.findFirst({
    where: {
      userId: session.userId,
      playlistIds: { has: playlistId }
    }
  })

  if (exists) return

  await prisma.library.update({
    where: {
      userId: session.userId,
    },
    data: {
      playlistIds: { push: playlistId }
    }
  })

  revalidatePath(category === 'Album' ? `/album/${playlistId}` : `/playlist/${playlistId}`)
}

export async function deleteFromLibrary(playlistId: string, category: string) {
  const session = await getSession()

  const libraryPlaylist = await prisma.library.findFirst({
    where: {
      userId: session.userId,
      playlistIds: { has: playlistId }
    }
  })

  if (!libraryPlaylist) return

  // remove from library when playlist is deleted
  await prisma.library.update({
    where: {
      userId: session.userId,
    },
    data: {
      playlistIds: libraryPlaylist?.playlistIds.filter(playlist => playlist !== playlistId)
    }
  })

  revalidatePath(category === 'Album' ? `/album/${playlistId}` : `/playlist/${playlistId}`)
}

export async function saveToLikedSongs(songId: string) {
  const session = await getSession()

  const likedSongsId = await prisma.playlist.findFirst({
    where: {
      AND: [
        {
          userId: session.userId,
          name: { equals: 'Liked Songs' }
        }
      ]
    },
    select: {
      id: true
    }
  })

  if (!likedSongsId) return

  const likedSongs = await prisma.playlist.update({
    where: {
      id: likedSongsId.id,
      userId: session.userId,
      name: { equals: 'Liked Songs' },
    },
    data: {
      songIds: { push: songId }
    }
  })

  await prisma.playlistSong.create({
    data: {
      playlistId: likedSongsId.id,
      songId,
    }
  })

  revalidatePath(`/playlist/${likedSongs.id}`)
}

export async function removeFromLikedSongs(songId: string, playlistSongId: string) {
  const session = await getSession()
  const exists = await prisma.playlist.findFirst({
    where: {
      AND: [
        {
          userId: session.userId,
          name: { equals: 'Liked Songs' },
          songIds: { has: songId }
        }
      ]
    },
    select: {
      id: true,
      songIds: true
    }
  })

  if (!exists) return

  const playlist = await prisma.playlist.update({
    where: {
      userId: session.userId,
      id: exists.id,
    },
    data: {
      songIds: exists.songIds.filter(song => song !== songId)
    }
  })

  await prisma.playlistSong.delete({
    where: {
      id: playlistSongId,
      playlistId: playlist.id,
    }
  })

  revalidatePath(`/playlist/${playlist.id}`)
}

export async function createPlaylistWithSong(songId: string) {
  const session = await getSession()

  const songTitle = await prisma.song.findUnique({
    where: { id: songId },
    select: { title: true }
  })

  if (!songTitle) return

  const playlist = await prisma.playlist.create({
    data: {
      name: songTitle.title,
      userId: session.userId,
      category: 'Playlist',
      songIds: { set: [songId] },
    }
  })

  await prisma.playlistSong.create({
    data: {
      playlistId: playlist.id,
      songId,
    }
  })

  // automatically add playlist to library
  await prisma.library.update({
    where: {
      userId: session.userId,
    },
    data: {
      playlistIds: { push: playlist.id }
    }
  })

  revalidatePath('/')
}