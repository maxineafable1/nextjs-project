import { getSession } from "@/actions/auth";
import PlaylistContainer from "@/components/playlist/playlist-container";
import PlaylistForm from "@/components/playlist/playlist-form";
import prisma from "@/lib/db";

export default async function page({ params: { id } }: { params: { id: string }}) {
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

  return (
    <div>
      <PlaylistContainer 
        playlistSongs={playlistSongs}
        active={session.active}
        category={playlistSongs?.category}
        currUserId={session.userId}
      />
      {(session.active && playlistSongs?.userId === session.userId) && (
        <PlaylistForm 
          category={playlistSongs.category}
        />
      )}
    </div>
  )
}
