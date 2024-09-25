import { createPlaylist, getPlaylist } from '@/actions/song'
import { IoIosAdd } from 'react-icons/io'
import PlaylistCard from './playlist/card'
import { getSession } from '@/actions/auth'

export default async function Sidebar() {
  const playlists = await getPlaylist()
  const session = await getSession()

  console.log(playlists)

  return (
    <div className="bg-neutral-900 rounded-lg p-4 mb-4 lg:mb-0">
      <div className="flex items-start justify-between">
        <h2 className="text-neutral-300 font-semibold">Your library</h2>
        {session.active && (
          <form action={createPlaylist}>
            <button>
              <IoIosAdd fontSize='2rem' />
            </button>
          </form>
        )}
      </div>
      <div>
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
      </div>
    </div>
  )
}
