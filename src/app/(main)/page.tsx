import { getSession } from "@/actions/auth";
import CardGenre from "@/components/song/card";
import prisma from "@/lib/db";
import { Fragment } from "react";

export default async function Home() {
  const session = await getSession()
  const playlists = await prisma.playlist.findMany({
    where: {
      category: { equals: 'Playlist' }
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

  const albums = await prisma.playlist.findMany({
    where: {
      category: { equals: 'Album' }
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

  const cardLists = [
    {
      label: 'artist',
      array: artistSongs.map(({ Song, ...artist }) => ({
        ...artist,
        songs: Song
      })),
      rounded: true,
    },
    {
      label: 'playlist',
      array: playlists,
      rounded: false,
    },
    {
      label: 'album',
      array: albums,
      rounded: false,
    },
  ]

  return (
    <section>
      {cardLists.map((card, index) => (
        <Fragment key={index}>
          {card.array.length > 0 && (
            <h2 className="font-bold text-2xl mb-4 ml-2">
              Popular {card.label}s
            </h2>
          )}
          <ul className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mb-4">
            {card.array?.map(cardDetail => (
              <CardGenre
                key={cardDetail.id}
                songs={cardDetail.songs}
                active={session.active}
                name={cardDetail.name}
                playlistImage={cardDetail.image}
                isArtistIcon={card.rounded}
                roundedCard={card.rounded}
                href={`/${card.label}/${cardDetail.id}`}
              />
            ))}
          </ul>
        </Fragment>
      ))}
    </section>
  );
}
