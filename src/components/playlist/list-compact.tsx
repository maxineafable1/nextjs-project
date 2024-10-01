import { useEffect, useRef, useState } from "react";
import { FaList, FaBars } from "react-icons/fa";

type ListCompactProps = {
  viewAs: 'List' | 'Compact'
  setViewAs: React.Dispatch<React.SetStateAction<'List' | 'Compact'>>
}

const viewAsArray = [
  {
    label: 'Compact',
    icon: <FaBars />,
  },
  {
    label: 'List',
    icon: <FaList />
  },
]

export default function ListCompact({ viewAs, setViewAs }: ListCompactProps) {
  const [isOpen, setIsOpen] = useState(false)

  const divRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!divRef.current?.contains(e.target as Node)
        && !btnRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className='ml-auto relative'>
      <button
        ref={btnRef}
        className={`
          flex items-center gap-3 text-neutral-400 hover:text-white
          font-medium text-sm
        `}
        onClick={() => setIsOpen(true)}
      >
        {viewAs === "List" ? (
          <>
            List <FaList />
          </>
        ) : (
          <>
            Compact <FaBars />
          </>
        )}

      </button>
      <div
        ref={divRef}
        className={`
          absolute bg-neutral-800 rounded shadow w-40 p-2
          ${!isOpen && 'hidden'} overflow-hidden text-sm right-0
        `}
      >
        <p className="text-xs p-2">View as</p>
        {viewAsArray.map(view => (
          <button
            key={view.label}
            onClick={() => setViewAs(view.label as ('List' | 'Compact'))}
            className={`
              flex items-center gap-2 p-2 hover:bg-neutral-700 w-full
              ${view.label === viewAs && 'text-green-400'}
            `}
          >
            {view.icon} {view.label}
          </button>
        ))}
      </div>
    </div>
  )
}
