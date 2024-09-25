import { useEffect, useRef, useState } from "react"

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen) {
      dialog?.showModal()
    }

    function closeModal(e: MouseEvent) {
      if (!dialog) return
      const dialogDimensions = dialog.getBoundingClientRect()
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialog.close()
        setIsOpen(false)
      }
    }

    dialog?.addEventListener("click", closeModal)
    return () => {
      dialog?.removeEventListener('click', closeModal)
    }
  }, [isOpen])

  return { dialogRef, setIsOpen, isOpen }
}