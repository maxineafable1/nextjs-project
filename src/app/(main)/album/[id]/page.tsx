import { getSession } from '@/actions/auth'
import PlaylistContainer from '@/components/playlist/playlist-container'
import PlaylistForm from '@/components/playlist/playlist-form'
import prisma from '@/lib/db'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata({
  params: { id }
}: { params: { id: string } }): Promise<Metadata> {
  const playlistName = await prisma.playlist.findUnique({
    where: {
      id,
      category: { equals: 'Album' },
    },
    select: {
      name: true,
    },
  })
  return {
    title: `${playlistName?.name} | Spotify`
  }
}

export default async function page({ params: { id } }: { params: { id: string } }) {
  const session = await getSession()
  const albumSongs = await prisma.playlist.findUnique({
    where: {
      id,
      category: { equals: 'Album' },
    },
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true
            }
          },
          playlists: {
            select: {
              name: true
            },
          }
        }
      },
      user: {
        select: {
          name: true
        }
      }
    }
  })

  const isInLibrary = await prisma.library.findFirst({
    where: {
      userId: session.userId,
      playlistIds: { has: id }
    },
    select: {
      id: true
    }
  })

  const likedSongs = await prisma.playlist.findFirst({
    where: {
      AND: [
        {
          userId: session.userId,
          name: { equals: 'Liked Songs' }
        }
      ]
    }
  })

  return (
    <div>
      <PlaylistContainer
        playlistSongs={albumSongs}
        active={session.active}
        category={albumSongs?.category}
        currUserId={session.userId}
        isInLibrary={isInLibrary}
        likedSongIds={likedSongs?.songIds}
      />
      {(session.active && albumSongs?.userId === session.userId) && (
        <PlaylistForm category={albumSongs.category} />
      )}
    </div>
  )
}
