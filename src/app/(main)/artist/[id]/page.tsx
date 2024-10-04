import { getSession } from "@/actions/auth"
import ArtistSongCard from "@/components/artist/artistsong-card"
import ArtistHeader from "@/components/artist/header"
import CardGenre from "@/components/song/card"
import prisma from "@/lib/db"

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
          }
        }
      }
    }
  })

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
        songs={artistSongs?.Song}
        active={session.active}
        image={artistSongs?.image}
        urlId={id}
        currUserId={session.userId}
        name={artistSongs?.name}
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
