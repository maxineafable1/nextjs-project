'use client'

import { SongType } from "@/components/song/card"
import React, { createContext, SetStateAction, useContext, useState } from "react"

type SongContextStateType = {
  currentSong: SongType | null
  setCurrentSong: React.Dispatch<SetStateAction<SongType | null>>
  currentAlbum: SongType[]
  setCurrentAlbum: React.Dispatch<SetStateAction<SongType[]>>
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
  const [currentSong, setCurrentSong] = useState<SongType | null>(null)
  const [currentAlbum, setCurrentAlbum] = useState<SongType[]>([])

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