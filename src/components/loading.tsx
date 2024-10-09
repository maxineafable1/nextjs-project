import React from 'react'

export default function Loading({ text }: { text: string }) {
  return (
    <div className='flex items-center justify-center min-h-screen gap-2'>
      <span className='sr-only'>{text}</span>
      <div className='w-4 h-4 rounded-full bg-neutral-300 animate-bounce [animation-delay:-0.3s]'></div>
      <div className='w-4 h-4 rounded-full bg-neutral-300 animate-bounce [animation-delay:-0.15s]'></div>
      <div className='w-4 h-4 rounded-full bg-neutral-300 animate-bounce '></div>
    </div>
  )
}
