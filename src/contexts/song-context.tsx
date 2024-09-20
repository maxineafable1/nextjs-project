'use client'

import { Song } from "@/components/song/card"
import React, { createContext, SetStateAction, useContext, useState } from "react"

type SongContextStateType = {
  currentSong: Song | null
  setCurrentSong: React.Dispatch<SetStateAction<Song | null>>
}

const initSongContextState: SongContextStateType = {
  currentSong: null,
  setCurrentSong: () => { }
}

const SongContext = createContext(initSongContextState)

type SongProviderProps = {
  children: React.ReactNode
}

export function SongProvider({ children }: SongProviderProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)

  const contextValue = {
    currentSong,
    setCurrentSong
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