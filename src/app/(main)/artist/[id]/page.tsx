import { getSession } from "@/actions/auth"
import ArtistSongCard from "@/components/artist/artistsong-card"
import ArtistHeader from "@/components/artist/header"
import CardGenre from "@/components/song/card"
import prisma from "@/lib/db"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export async function generateMetadata({
  params: { id }
}: { params: { id: string } }): Promise<Metadata> {
  const artistName = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  })
  return {
    title: `${artistName ? artistName.name : 'Page not found'} | Spotify`
  }
}

export default async function page({ params: { id } }: { params: { id: string } }) {
  const session = await getSession()
  const artistSongs = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      Song: {
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
          },
          playlistSongs: {
            select: { id: true }
          }
        }
      },
    }
  })

  if (!artistSongs) {
    notFound()
  }

  const artistAlbums = await prisma.playlist.findMany({
    where: {
      userId: id,
      category: 'Album',
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

  const likedSongs = await prisma.playlist.findFirst({
    where: {
      AND: [
        {
          userId: session.userId,
          name: { equals: 'Liked Songs' }
        }
      ]
    },
    select: {
      songIds: true,
      playlistSongs: { select: { id: true, songId: true } }
    }
  })

  const artistPlaylist = await prisma.playlist.findMany({
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
      <ArtistHeader
        active={session.active}
        image={artistSongs?.image}
        name={artistSongs?.name}
        urlId={id}
        currUserId={session.userId}
      />
      <ArtistSongCard
        songs={artistSongs.Song}
        active={session.active}
        image={artistSongs?.image}
        urlId={id}
        currUserId={session.userId}
        name={artistSongs?.name}
        artistPlaylist={artistPlaylist}
        likedSongIds={likedSongs?.songIds}
        likedPlaylistSongIds={likedSongs?.playlistSongs}
      />
      {artistAlbums.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          <ul className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 mb-4">
            {artistAlbums.map(album => (
              <CardGenre
                key={album.id}
                songs={album.songs}
                active={session.active}
                name={album.name}
                playlistImage={album.image}
                isArtistIcon={false}
                roundedCard={false}
                href={`/${album.category.toLowerCase()}/${album.id}`}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
