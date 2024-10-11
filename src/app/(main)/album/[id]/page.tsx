import { getSession } from '@/actions/auth'
import PlaylistContainer from '@/components/playlist/playlist-container'
import PlaylistForm from '@/components/playlist/playlist-form'
import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

export async function generateMetadata({
  params: { id }
}: { params: { id: string } }): Promise<Metadata> {
  const albumName = await prisma.playlist.findUnique({
    where: {
      id,
      category: { equals: 'Album' },
    },
    select: {
      name: true,
    },
  })
  return {
    title: `${albumName ? albumName.name : 'Page not found'} | Spotify`
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
      // songs: {
      //   include: {
      //     artist: {
      //       select: {
      //         name: true
      //       }
      //     },
      //     playlists: {
      //       select: {
      //         name: true
      //       },
      //     }
      //   }
      // },
      playlistSongs: {
        include: {
          song: {
            include: {
              artist: {
                select: { name: true }
              },
              playlists: {
                select: { name: true }
              }
            }
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

  if (!albumSongs) {
    notFound()
  }

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

  const userPlaylists = await prisma.playlist.findMany({
    where: {
      userId: session.userId,
      AND: [
        {
          NOT: {
            name: { equals: 'Liked Songs' }
          },
          category: 'Playlist',
        }
      ]
    },
    select: {
      id: true,
      name: true,
      songIds: true,
    }
  })

  return (
    <div>
      <PlaylistContainer
        playlist={albumSongs}
        active={session.active}
        category={albumSongs?.category}
        currUserId={session.userId}
        isInLibrary={isInLibrary}
        likedSongIds={likedSongs?.songIds}
        userPlaylists={userPlaylists}
      />
      {(session.active && albumSongs?.userId === session.userId) && (
        <PlaylistForm category={albumSongs.category} />
      )}
    </div>
  )
}
