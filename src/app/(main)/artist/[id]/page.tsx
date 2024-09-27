import { getSession } from "@/actions/auth"
import ArtistSongCard from "@/components/artist/artistsong-card"
import ArtistHeader from "@/components/artist/header"
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
          }
        }
      }
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
      />
    </div>
  )
}
