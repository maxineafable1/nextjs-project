'use client'

import { useSongContext } from "@/contexts/song-context";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";

export default function Player() {
  const { currentSong } = useSongContext()
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)

  function numToTime(value: number) {
    const minutes = Math.floor(value / 60)
    const seconds = value - minutes * 60
    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`
  }

  // console.log(currentSong)
  useEffect(() => {
    if (playing) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [playing])

  useEffect(() => {
    if (!audioRef.current) return
    const song = audioRef.current
    // TODO volume toggle mute
    setVolume(prev => isMuted ? 0 : prev)

    song.volume = volume
  }, [isMuted, volume])

  return (
    <div className="bg-black fixed w-full p-4 bottom-0 h-20 flex items-center">
      {currentSong && (
        <div className="flex items-center gap-2">
          <img
            src={currentSong?.image}
            alt=""
            className="block aspect-square object-cover max-w-14 rounded-md"
          />
          <div className="text-sm">
            <p>{currentSong.title}</p>
            <p>Artist Name</p>
          </div>
        </div>
      )}
      {currentSong && (
        <audio
          ref={audioRef}
          onTimeUpdate={e => {
            // make the bar move
            const newTime = Math.trunc(e.currentTarget.currentTime)
            setCurrentTime(newTime)
          }}
        >
          <source src={currentSong.song} type="audio/mpeg" />
        </audio>
      )}
      <div className="flex flex-col gap-2 items-center justify-center mx-auto">
        <button
          disabled={!currentSong}
          onClick={() => {
            console.log('click')
            setPlaying(prev => !prev)
          }}
          className="bg-white rounded-full p-2 text-center hover:scale-105 hover:bg-neutral-200"
        >
          {playing ? <FaPause fill="black" /> : <FaPlay fill="black" />}
        </button>
        <div className="flex items-center gap-2">
          <p className="text-xs">{numToTime(currentTime)}</p>
          <input
            type="range"
            min={0}
            value={currentTime}
            max={audioRef.current?.duration}
            disabled={!currentSong}
            onChange={e => {
              // you can move the bar
              if (!audioRef.current) return
              const song = audioRef.current
              song.currentTime = e.target.valueAsNumber
              setCurrentTime(e.target.valueAsNumber)
            }}
            className="song-slider"
          />
          <p className="text-xs">{audioRef.current ? numToTime(audioRef.current?.duration) : '0:00'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsMuted(prev => !prev)
          }}
        >
          {isMuted ? <CiVolumeMute /> : <CiVolumeHigh />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          disabled={!currentSong}
          onChange={e => {
            setIsMuted(false)
            setVolume(e.target.valueAsNumber)
          }}
          className="song-slider w-32"
        />
      </div>

    </div >

  )
}
