import { getSession } from "@/actions/auth";
import { getSongs } from "@/actions/song";
import CardGenre, { SongType } from "@/components/song/card";

type SongsByGenreType = [string, SongType[]][]

export default async function Home() {
  const session = await getSession()
  const songs = await getSongs()

  // group the songs by genre
  const songsGenreObj = Object.groupBy(songs, ({ genre }) => genre)
  const songsByGenre = Object.keys(songsGenreObj).map((key) => [key, songsGenreObj[key]]) as unknown as SongsByGenreType

  return (
    <section>
      <h2 className="font-bold text-2xl mb-4 ml-2">
        {session.active ? 'Made for you' : 'Popular Genre'}
      </h2>
      <ul className="grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-3">
        {songsByGenre.map(songByGenre => (
          <CardGenre key={songByGenre[0]} songByGenre={songByGenre} />
        ))}
      </ul>
    </section>
  );
}
