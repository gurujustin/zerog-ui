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
      className="text-white rounded-2xl p-6 text-gray-500 bg-gray-500 bg-opacity-10 group relative overflow-hidden grid md:grid-cols-6 grid-cols-2 gap-4 cursor-pointer transition-transform ease-in-out hover:scale-[1.01]"
      ref={ref}
      key={protocol.name}
    >
      <div className="col-span-2">
        <div className="flex items-center gap-2 font-bold">
          <img src={protocol.logo} className="h-10 w-10" />
          <a
            href={protocol.link}
            className="inline-flex items-center gap-x-1 disabled"
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
      <div className="flex md:flex-row flex-col md:items-center font-medium text-purple-gray-600">
        <span className="text-gray-400 md:hidden text-sm">Chain</span>
        <span className="flex items-center gap-x-1">
          <span className="relative flex items-center justify-center overflow-hidden">
            <img
              alt="Ethereum icon"
              className="size-full rounded-full w-5 h-5"
              src={protocol.chainlogo}
            />
          </span>
          {protocol.chain}
        </span>
      </div>
      <div className="flex md:flex-row flex-col md:items-center">
        <span className="text-gray-400 md:hidden text-sm">Assets</span>
        {protocol.assets}
      </div>
      <div className="flex md:flex-row flex-col md:items-center bg-clip-text text-transparent bg-[linear-gradient(120deg,_#72afef_0%,_#37e29a_100%)]">
        <span className="text-gray-400 md:hidden text-sm">TVL</span>
        <span className="font-bold">{protocol.tvl}</span>
      </div>
      <div className="flex md:flex-row flex-col md:items-center">
        <span className="text-gray-400 md:hidden text-sm">Boost</span>
        {protocol.boost}
      </div>
      <div
        className="rounded-[12px] pointer-events-none absolute -inset-px -z-10 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(48, 53, 74, 0.65), transparent 80%)`,
        }}
      ></div>
    </div>
  )
}
