import { getSession } from "@/actions/auth";
import { getSongs } from "@/actions/song";
import CardGenre, { SongType } from "@/components/song/card";
import prisma from "@/lib/db";

type SongsByGenreType = [string, SongType[]][]

export default async function Home() {
  const session = await getSession()
  // const songs = await getSongs()
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
  // console.log(playlists)

  // group the songs by artist
  // const songsGenreObj = Object.groupBy(songs, ({ genre }) => genre)
  // const songsByGenre = Object.keys(songsGenreObj).map((key) => [key, songsGenreObj[key]]) as unknown as SongsByGenreType

  // console.log(songsByGenre)

  return (
    <section>
      <h2 className="font-bold text-2xl mb-4 ml-2">
        {session.active ? `Made for ${session.name}` : 'Popular playlists'}
      </h2>
      <ul className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
        {/* {songsByGenre.length > 0 && songsByGenre.map(songByGenre => (
          <CardGenre key={songByGenre[0]} songByGenre={songByGenre} active={session.active} />
        ))} */}
        {playlists?.map(playlist => (
          <CardGenre
            key={playlist.id}
            songs={playlist.songs}
            active={session.active}
            name={playlist.name ?? 'Default Name'}
            albumId={playlist.id}
            playlistImage={playlist.image}
          />
        ))}
      </ul>
    </section>
  );
}
