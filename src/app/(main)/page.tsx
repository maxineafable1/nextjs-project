import { getSongs } from "@/actions/song";
import Card from "@/components/song/card";
import Player from "@/components/song/player";

// import i from '../../../uploads/'

export default async function Home() {
  const songs = await getSongs()

  return (
    <section>
      <h1 className="font-bold text-2xl mb-4">Made for you</h1>
      <ul className="grid grid-cols-4">
        {songs.map(song => (
          <Card key={song.id} song={song} />
        ))}
      </ul>
    </section>
  );
}
