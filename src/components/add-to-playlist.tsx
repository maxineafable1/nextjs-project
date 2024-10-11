import React from 'react'

type AddToPlaylistModalProps = {
  dialogRef: React.RefObject<HTMLDialogElement>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  playlistName: string | undefined
  clickedPlaylistId: string
}

export default function AddToPlaylistModal({ 
  dialogRef, 
  setIsOpen, 
  playlistName,
  clickedPlaylistId,
}: AddToPlaylistModalProps) {
  return (
    <dialog
      ref={dialogRef}
      className='bg-white text-sm p-6 text-start text-black rounded-lg shadow'
    >
      <p className='font-extrabold mb-2'>Already added</p>
      <p>This is already in your '{playlistName}' playlist.</p>
      <div className='mt-6 flex items-center text-base font-bold'>
        <button 
          onClick={() => alert(clickedPlaylistId)}
          className='text-neutral-400 px-8 py-3 rounded-full bg-inherit hover:text-neutral-950'>
          Add anyway
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className='bg-green-500 px-8 py-3 rounded-full hover:bg-green-400 hover:scale-105'
        >
          Don't add
        </button>
      </div>
    </dialog>
  )
}
