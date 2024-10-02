import { getSession } from '@/actions/auth'
import PlaylistContainer from '@/components/playlist/playlist-container'
import PlaylistForm from '@/components/playlist/playlist-form'
import prisma from '@/lib/db'
import React from 'react'

export default async function page({ params: { id } }: { params: { id: string }}) {
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

  console.log(albumSongs)

  return (
    <div>
      <PlaylistContainer
        playlistSongs={albumSongs}
        active={session.active}
        category={albumSongs?.category}
      />
      {(session.active && albumSongs?.userId === session.userId) && (
        <PlaylistForm category={albumSongs.category} />
      )}
    </div>
  )
}
