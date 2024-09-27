import { createPlaylist, getPlaylist } from '@/actions/song'
import { IoIosAdd } from 'react-icons/io'
import PlaylistCard from './playlist/card'
import { getSession } from '@/actions/auth'
import prisma from '@/lib/db'
import SidebarButton from './sidebar-btn'

export default async function Sidebar() {
  const session = await getSession()

  const playlists = await prisma.playlist.findMany({
    where: {
      userId: session.userId
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
    <div className="bg-neutral-900 rounded-lg p-4 mb-4 lg:mb-0">
      <SidebarButton
        action={createPlaylist}
        active={session.active}
      />
      {session.active && (
        <ul>
          {playlists?.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              songs={playlist.songs}
              albumName={playlist.name}
              playlistImage={playlist.image}
              albumId={playlist.id}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
