'use client'

import React, { useState } from 'react'
import Header from './header';
import SonglistCard from './songlist-card';
import { SampleTypeForPlaylist } from '../song/card';

type PlaylistContainerProps = {
  playlistSongs: ({
    user: {
      name: string | null;
    };
    songs: SampleTypeForPlaylist[];
  } & {
    image: string | null | undefined
    name: string | undefined
    userId: string
  }) | null
  active: boolean
}

export default function PlaylistContainer({ playlistSongs, active }: PlaylistContainerProps) {
  const [totalDuration, setTotalDuration] = useState<number | undefined>(undefined)

  return (
    <>
      <Header
        image={playlistSongs?.image}
        name={playlistSongs?.name}
        user={playlistSongs?.user.name}
        count={playlistSongs?.songs.length}
        totalDuration={totalDuration}
        active={active}
        userId={playlistSongs?.userId}
        
      />
      <SonglistCard
        songs={playlistSongs?.songs}
        active={active}
        image={playlistSongs?.image}
        playlistName={playlistSongs?.name}
        // totalDuration={totalDuration}
        setTotalDuration={setTotalDuration}
      />
    </>
  )
}
