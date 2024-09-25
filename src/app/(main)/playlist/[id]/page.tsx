import { getSession } from "@/actions/auth";
import Header from "@/components/playlist/header";
import PlaylistForm from "@/components/playlist/playlist-form";
import prisma from "@/lib/db";
import Image from "next/image";

export default async function page({ params: { id } }: { params: { id: string } }) {
  const session = await getSession()
  const playlistSongs = await prisma.playlist.findUnique({
    where: {
      id
    },
    include: {
      songs: true,
      user: {
        select: {
          name: true
        }
      }
    }
  })
  console.log(playlistSongs)

  return (
    <div>
      <Header 
        image={playlistSongs?.image}
        name={playlistSongs?.name}
        user={playlistSongs?.user.name}
      />
      <ul>
        {playlistSongs?.songs?.map(song => (
          <li
            key={song.id}
            className="flex items-center gap-2 hover:bg-neutral-800 p-2 rounded"
          >
            <Image
              src={`/${song.image}`}
              alt=""
              width={500}
              height={500}
              className="aspect-square max-w-10 object-cover block rounded-md"
            />
            <div>
              <p>{song.title}</p>
              <p className="text-neutral-400 text-sm">Artist name</p>
            </div>
          </li>
        ))}
      </ul>
      {(session.active && playlistSongs?.userId === session.userId) && (
        <PlaylistForm />
      )}
    </div>
  )
}
