'use client'

import { useSongContext } from "@/contexts/song-context";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import { IoPlaySkipForward, IoPlaySkipBackSharp } from "react-icons/io5";

export default function Player() {
  const { currentSong, setCurrentSong, currentAlbum } = useSongContext()
  const [playing, setPlaying] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)

  const audioRef = useRef<HTMLAudioElement>(null)

  function numToTime(value: number) {
    const minutes = Math.floor(value / 60)
    const seconds = Math.trunc(value - minutes * 60)
    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`
  }

  useEffect(() => {
    if (playing) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [playing, currentSong?.song])

  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current

    function getCurrSongDuration() {
      console.log(audio.duration)
      setDuration(audio.duration)
    }

    audio.addEventListener('loadedmetadata', getCurrSongDuration)
    return () => {
      audio.removeEventListener('loadedmetadata', getCurrSongDuration)
    }
  }, [currentSong?.song])

  useEffect(() => {
    if (!audioRef.current) return
    const song = audioRef.current
    // TODO volume toggle mute
    if (isMuted) {
      song.muted = true
    } else {
      song.muted = false
    }

    song.volume = volume
  }, [isMuted, volume, currentSong?.song])

  return (
    <div className="bg-black fixed w-full p-4 bottom-0 h-20 flex items-center gap-8">
      {currentSong && (
        <div className="flex items-center gap-3 w-1/4 lg:w-fit">
          <img
            src={currentSong?.image}
            alt=""
            className="block aspect-square object-cover max-w-14 rounded-md"
          />
          <div>
            <p className="font-semibold">{currentSong.title}</p>
            <p className="text-sm text-neutral-300">{currentSong.artist.name}</p>
          </div>
        </div>
      )}
      {currentSong && (
        <audio
          key={currentSong.song}
          ref={audioRef}
          onTimeUpdate={e => {
            // make the bar move
            const newTime = Math.trunc(e.currentTarget.currentTime)
            setCurrentTime(newTime)
          }}
          preload="metadata"
        >
          <source src={currentSong.song} type="audio/mpeg" />
        </audio>
      )}
      <div className="flex flex-col gap-2 items-center justify-center mx-auto w-1/3 md:w-1/2 lg:w-2/3 max-w-2xl">
        <div className="flex items-center gap-4">
          <button
            title="Previous"
            onClick={() => {
              const currentIndex = currentAlbum.findIndex(songs => songs.id === currentSong?.id)
              if (currentIndex > 0)
                setCurrentSong(currentAlbum[currentIndex - 1])
            }}
            className="text-neutral-300 hover:text-neutral-200 hover:scale-105"
          >
            <IoPlaySkipBackSharp fontSize='1.5rem' />
          </button>
          <button
            disabled={!currentSong}
            title={playing ? 'Pause': 'Play'}
            onClick={() => {
              setPlaying(prev => !prev)
            }}
            className="bg-white rounded-full p-2 text-center hover:scale-105 hover:bg-neutral-200"
          >
            {playing ? <FaPause fill="black" /> : <FaPlay fill="black" />}
          </button>
          <button
            title="Next"
            onClick={() => {
              const currentIndex = currentAlbum.findIndex(songs => songs.id === currentSong?.id)
              if (currentIndex < currentAlbum.length - 1)
                setCurrentSong(currentAlbum[currentIndex + 1])
            }}
            className="text-neutral-300 hover:text-neutral-200 hover:scale-105"
          >
            <IoPlaySkipForward fontSize='1.5rem' />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <p className="text-xs">
            {numToTime(currentTime)}
          </p>
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
            className="song-slider w-full"
          />
          <p className="text-xs">
            {numToTime(duration)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsMuted(prev => !prev)
          }}
          className="text-xl text-neutral-300 hover:text-neutral-200 hover:scale-105"
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
            const newVol = e.target.valueAsNumber
            setIsMuted(false)
            setVolume(() => {
              if (newVol === 0) {
                setIsMuted(true)
              }
              return newVol
            })
          }}
          className={`song-slider w-32 ${isMuted && 'muted'}`}
        />
      </div>
    </div>
  )
}
