import { getSession } from "@/actions/auth";
import CardGenre from "@/components/song/card";
import prisma from "@/lib/db";

export default async function Home() {
  const session = await getSession()
  const playlists = await prisma.playlist.findMany({
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

  const artistSongs = await prisma.user.findMany({
    where: {
      NOT: {
        Song: {
          none: {}
        }
      }
    },
    include: {
      Song: {
        include: {
          artist: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  // console.log(artistSongs)

  return (
    <section>
      <h2 className="font-bold text-2xl mb-4 ml-2">
        Popular artists
      </h2>
      <ul className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mb-4">
        {artistSongs?.map(artist => (
          <CardGenre
            key={artist.id}
            songs={artist.Song}
            active={session.active}
            name={artist.name}
            artistId={artist.id}
            playlistImage={artist.image}
            roundedCard
          />
        ))}
      </ul>
      <h2 className="font-bold text-2xl mb-4 ml-2">
        {session.active ? `Made for ${session.name}` : 'Popular playlists'}
      </h2>
      <ul className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
        {playlists?.map(playlist => (
          <CardGenre
            key={playlist.id}
            songs={playlist.songs}
            active={session.active}
            name={playlist.name}
            albumId={playlist.id}
            playlistImage={playlist.image}
          />
        ))}
      </ul>
    </section>
  );
}
