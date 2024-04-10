import type { MetaFunction } from '@remix-run/cloudflare'
import { Outlet } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | DeFi' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  return (
    <>
      <div className="flex flex-col max-w-screen-xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(120deg,_#ffffff_-0.35%,_#37e29a_50%)]">
            DeFi
          </h1>
          <p className="text-md font-normal text-gray-500 mt-2">
            Take advantage of DeFi opportunities to earn additional profits
            using zgETH!
          </p>
        </div>

        {/* Main */}
        <div className="flex flex-col gap-0.5 mt-12">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-6 gap-4 text-gray-400 mb-2">
            <span className="col-span-2">Protocol</span>
            <span>Chain</span>
            <span>Assets</span>
            <span>TVL</span>
            <span>Boost</span>
          </div>

          {/* Table Body */}
          <Outlet />
        </div>
      </div>
    </>
  )
}
