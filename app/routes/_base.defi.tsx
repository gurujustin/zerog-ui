import type { MetaFunction } from '@remix-run/cloudflare'
import { Outlet } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | Defi' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {

  return (
    <>
      <div className='flex flex-col'>
        <div className='bg-main'>
          <div className='mx-auto container px-5 py-4 md:px-8 md:py-6'>
            <div className='flex flex-col space-y-1'>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold xl:leading-[68px] bg-clip-text text-transparent bg-[linear-gradient(120deg,_#ffffff_-0.35%,_#37e29a_50%)]">Defi Integrations</h1>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400 m-0 text-left">Take advantage of DeFi opportunities to earn additional profits using zgETH! </p>
            </div>
          </div>
        </div>
        <div className='mx-auto flex flex-col gap-0.5 container px-5 py-8 md:px-8 md:py-12'>
          <div className="md:grid grid-cols-6 gap-4 px-4 text-gray-400 hidden mb-3">
            <span className='col-span-2'>Protocol</span>
            <span>Chain</span>
            <span>Assets</span>
            <span>TVL</span>
            <span>Boost</span>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}
