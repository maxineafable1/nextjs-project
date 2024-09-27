import { getSession } from "@/actions/auth";
import PlaylistContainer from "@/components/playlist/playlist-container";
import PlaylistForm from "@/components/playlist/playlist-form";
import prisma from "@/lib/db";

export default async function page({ params: { id } }: { params: { id: string }}) {
  const session = await getSession()
  const playlistSongs = await prisma.playlist.findUnique({
    where: {
      id
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
      <PlaylistContainer 
        playlistSongs={playlistSongs}
        active={session.active}
      />
      {(session.active && playlistSongs?.userId === session.userId) && (
        <PlaylistForm />
      )}
    </div>
  )
}
