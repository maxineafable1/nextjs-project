'use client'

import React, { useState } from 'react'
import Header from './header';
import SonglistCard from './songlist-card';
import { SampleTypeForPlaylist } from '../song/card';

type PlaylistContainerProps = {
  // playlistSongs: ({
  //   user: {
  //     name: string | null;
  //   };
  //   songs: SampleTypeForPlaylist[];
  // } & {
  //   image: string | null | undefined
  //   name: string | undefined
  //   userId: string
  // }) | null
  playlist: {
    // playlistSongs: {
    //   id: string,
    //   songId: string,
    //   playlistId: string,
    //   addedAt: Date,
    //   song: SampleTypeForPlaylist[]
    // }[]
    // songs: SampleTypeForPlaylist[];
    playlistSongs: {
      id: string,
      songId: string,
      playlistId: string,
      addedAt: Date,
      song: SampleTypeForPlaylist
    }[]
    user: {
      name: string | null;
    };
    image: string | null | undefined
    name: string | undefined
    userId: string
  }

  active: boolean
  category: string | undefined
  currUserId: string
  isInLibrary: { id: string } | null
  likedSongIds: string[] | undefined

  userPlaylists: {
    id: string;
    name: string;
    songIds: string[];
  }[]
}

export default function PlaylistContainer({
  playlist,
  active,
  category,
  currUserId,
  isInLibrary,
  likedSongIds,
  userPlaylists,
}: PlaylistContainerProps) {
  const [totalDuration, setTotalDuration] = useState<number | undefined>(undefined)

  return (
    <>
      <Header
        image={playlist.image}
        name={playlist.name}
        user={playlist.user.name}
        count={playlist.playlistSongs.length}
        userId={playlist.userId}

        // image={playlistSongs?.image}
        // name={playlistSongs?.name}
        // user={playlistSongs?.user.name}
        // count={playlistSongs?.songs.length}
        totalDuration={totalDuration}
        active={active}
        // userId={playlistSongs?.userId}
        currUserId={currUserId}
        category={category}
      />
      <SonglistCard
        playlistSongs={playlist.playlistSongs}
        image={playlist.image}
        playlistName={playlist.name}
        playlistUserId={playlist.userId}

        // songs={playlistSongs?.songs}
        active={active}
        // image={playlistSongs?.image}
        // playlistName={playlistSongs?.name}

        // totalDuration={totalDuration}
        
        setTotalDuration={setTotalDuration}
        category={category}
        // playlistUserId={playlistSongs?.userId}
        currUserId={currUserId}
        isInLibrary={isInLibrary}
        likedSongIds={likedSongIds}
        userPlaylists={userPlaylists}
      />
    </>
  )
}
