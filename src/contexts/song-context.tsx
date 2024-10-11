'use client'

import { SampleTypeForPlaylist, SongType } from "@/components/song/card"
import React, { createContext, SetStateAction, useContext, useState } from "react"

type SongContextStateType = {
  currentSong: SampleTypeForPlaylist | null
  setCurrentSong: React.Dispatch<SetStateAction<SampleTypeForPlaylist | null>>
  currentAlbum: SampleTypeForPlaylist[]
  setCurrentAlbum: React.Dispatch<SetStateAction<SampleTypeForPlaylist[]>>
}

const initSongContextState: SongContextStateType = {
  currentSong: null,
  setCurrentSong: () => { },
  currentAlbum: [],
  setCurrentAlbum: () => { },
}

const SongContext = createContext(initSongContextState)

type SongProviderProps = {
  children: React.ReactNode
}

export function SongProvider({ children }: SongProviderProps) {
  const [currentSong, setCurrentSong] = useState<SampleTypeForPlaylist | null>(null)
  const [currentAlbum, setCurrentAlbum] = useState<SampleTypeForPlaylist[]>([])

  const contextValue = {
    currentSong,
    setCurrentSong,
    currentAlbum,
    setCurrentAlbum,
  }

  return (
    <SongContext.Provider value={contextValue}>
      {children}
    </SongContext.Provider>
  )
}

export function useSongContext() {
  const song = useContext(SongContext)
  if (!song)
    throw new Error('useSongContext must be used within SongProvider')

  return song
}