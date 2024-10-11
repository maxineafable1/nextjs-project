import { getSession } from "@/actions/auth";
import PlaylistContainer from "@/components/playlist/playlist-container";
import PlaylistForm from "@/components/playlist/playlist-form";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { id }
}: { params: { id: string } }): Promise<Metadata> {
  const playlistName = await prisma.playlist.findUnique({
    where: {
      id,
      category: { equals: 'Playlist' },
    },
    select: {
      name: true,
    },
  })
  return {
    title: `${playlistName ? playlistName.name : 'Page not found'} | Spotify`
  }
}

export default async function page({ params: { id } }: { params: { id: string } }) {
  const session = await getSession()
  const playlistSongs = await prisma.playlist.findUnique({
    where: {
      id,
      category: { equals: 'Playlist' },
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

  if (!playlistSongs) {
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
        playlistSongs={playlistSongs}
        active={session.active}
        category={playlistSongs?.category}
        currUserId={session.userId}
        isInLibrary={isInLibrary}
        likedSongIds={likedSongs?.songIds}
        userPlaylists={userPlaylists}
      />
      {(
        (session.active && playlistSongs?.userId === session.userId)
        && playlistSongs.name !== 'Liked Songs')
        && (
          <PlaylistForm
            category={playlistSongs.category}
          />
        )}
    </div>
  )
}
