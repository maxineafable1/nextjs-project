import React from 'react'

type DeleteModalProps = {
  deleteDialogRef: React.RefObject<HTMLDialogElement>
  nameToDelete: string | null | undefined
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
  action: () => Promise<void>
  category: string | undefined
}

export default function DeleteModal({
  deleteDialogRef,
  nameToDelete,
  setIsDeleteOpen,
  action,
  category,
}: DeleteModalProps) {
  return (
    <dialog
      ref={deleteDialogRef}
      className='bg-white p-6 rounded-lg overflow-hidden w-full max-w-md'
    >
      <div className='flex flex-col gap-2 w-full'>
        <h2 className='font-bold text-2xl self-start'>Delete {category === 'Artist' ? 'this track' : 'from Your Library'}?</h2>
        <p className='text-sm self-start'>
          This will delete
          <span className='font-bold mx-1'>
            {nameToDelete}
          </span>
          {category === 'Artist' ? 'from your songs.' : (<>from <span className='font-bold'>Your Library</span> </>)}
        </p>
        <div className='flex items-center mt-4 gap-6 self-end'>
          <button
            onClick={() => {
              deleteDialogRef.current?.close()
              setIsDeleteOpen(false)
            }}
            className='font-bold hover:scale-105'
          >
            Cancel
          </button>
          <form action={action}>
            <button
              className='bg-green-500 hover:bg-green-400 hover:scale-105 px-6 py-3 rounded-full font-bold'
              type='submit'
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
