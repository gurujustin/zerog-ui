import React from 'react'
import { type Protocol, protocols } from '~/utils/constants'

export default function Index() {
  return <>{protocols.map((protocol) => row(protocol))}</>
}

const row = (protocol: Protocol) => {
  const ref = React.useRef(null)
  const [mousePosition, setMousePosition] = React.useState({ x: null, y: null })

  React.useEffect(() => {
    if (!ref.current) return

    const updateMousePosition = (ev: MouseEvent) => {
      const { x, y } = ref.current.getBoundingClientRect()

      setMousePosition({ x: ev.clientX - x, y: ev.clientY - y })
    }

    const refValue = ref.current
    refValue.addEventListener('mousemove', updateMousePosition)

    return () => {
      refValue.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-5 rounded-2xl text-white group relative overflow-hidden gap-4 p-6 bg-[#00260d] border-2 border-[#0bff72] cursor-pointer transition-transform ease-in-out hover:scale-[1.01]"
      ref={ref}
      key={protocol.name}
    >
      {/* Name */}
      <div className="col-span-2">
        <div className="flex items-center gap-2 font-bold">
          <img src={protocol.logo} className="h-10 w-10" />
          <a
            href={protocol.link}
            className="inline-flex text-[#48ff7b] items-center gap-x-1 disabled"
            target="_blank"
          >
            {protocol.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M15 3h6v6"></path>
              <path d="M10 14 21 3"></path>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Assets */}
      <div className="flex flex-col md:flex-row md:items-center text-[#48ff7b]">
        <span className="md:hidden text-sm text-[#6a9863]">Assets</span>
        {protocol.assets}
      </div>

      <div className="flex flex-col md:flex-row md:items-center text-[#48ff7b]">
        <span className="md:hidden text-sm text-[#6a9863]">Zero-G Points</span>
        0 Pts
      </div>

      <div className="flex flex-col md:flex-row md:items-center text-[#48ff7b]">
        <span className="md:hidden text-sm text-[#6a9863]">
          EigenLayer Points
        </span>
        0 Pts
      </div>

      {/* Radial Gradient Animation */}
      <div
        className="absolute pointer-events-none -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(70, 100, 70, 0.65), transparent 80%)`,
        }}
      ></div>
    </div>
  )
}
