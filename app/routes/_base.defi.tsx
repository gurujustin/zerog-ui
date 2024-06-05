import { useState, useEffect } from 'react'
import type { MetaFunction } from '@remix-run/cloudflare'
import { Outlet } from '@remix-run/react'
import bg from '~/assets/background1.jpg'
import WrapIcon from '~/assets/wrap.svg'
import RestakeIcon from '~/assets/Restake.svg'
import DefiIcon from '~/assets/defi.svg'
import PortfolioIcon from '~/assets/portfolio.svg'
import { DropdownContent } from '~/components/DropdownContent'
import { Link } from '@remix-run/react'

import { TopNav } from '~/components/nav/TopNav'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | DeFi' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = bg;
    img.onload = () => {
      setLoading(false);
    };
  }, []);
  return (
    <>
      {
        loading ? (
          <div className="flex flex-col justify-between min-h-screen bg-cover" >
            {/* Navigation Bar */}
            <TopNav />
            <div className='flex justify-center items-center h-screen'>
              <div id="loading-spinner" className="spinner"></div>
            </div>
    
            {/* Footer */}
            <div className="flex justify-between w-full fixed lg:hidden bottom-0 px-4 sm:px-8 bg-[#001f0b] border-t-2 border-[#0bff72]">
              <Link to="/restake">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img
                    src={RestakeIcon}
                    className="w-8 h-8"
                  />
                  <span className="text-[#45ff76]">Restake</span>
                </div>
              </Link>
              <Link to="/defi">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img
                    src={DefiIcon}
                    className="w-8 h-8"
                  />
                  <span className="text-[#45ff76]">DeFi</span>
                </div>
              </Link>
              <Link to="/portfolio">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img
                    src={PortfolioIcon}
                    className="w-8 h-8"
                  />
                  <span className="text-[#45ff76]">Portfolio</span>
                </div>
              </Link>
              <Link to="/wrap">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img src={WrapIcon} className="w-8 h-8" />
                  <span className="text-[#45ff76]">Wrap</span>
                </div>
              </Link>
              <div className="self-center h-full rounded-2xl ml-2 dropdown dropdown-top dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="h-full rounded-2xl px-[15px] py-[6px]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    color="textSubtle"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#45ff76"
                  >
                    <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="w-52 z-[1] menu shadow rounded-box mb-6 p-2 dropdown-content bg-[#001f0b] border border-[#45ff76]"
                >
                  <DropdownContent />
                </ul>
              </div>
            </div>
          </div>
        ) : (    
          <div className="flex flex-col justify-between min-h-screen bg-cover"  style={{backgroundImage: `url(${bg})`}}>
            {/* Navigation Bar */}
            <TopNav />

            {/* Body */}
            <div className="flex-1 mt-32 mb-24">
              <div className="flex flex-col max-w-screen-xl mx-auto px-4 sm:px-8">
                {/* Header */}
                <div className="flex flex-col md:w-1/2 bg-[#00260d] border-2 border-[#0bff72] p-4 rounded-xl">
                  <h1 className="text-4xl font-bold text-[#48ff7b]">
                    DeFi
                  </h1>
                  <p className="text-md font-normal text-[#7ffda0] mt-2">
                    Take advantage of DeFi opportunities to earn additional profits
                    using zgETH!
                  </p>
                </div>

                {/* Main */}
                <div className="flex flex-col gap-0.5 mt-12">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-6 rounded-xl gap-4 mb-0.5 px-6 py-4 bg-[#00260d] border-2 border-[#0bff72] text-[#3ce068]">
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
            </div>

            {/* Footer */}
            <div className="flex justify-between w-full fixed lg:hidden bottom-0 px-4 sm:px-8 bg-[#001f0b] border-t-2 border-[#0bff72]">
              <Link to="/restake">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img
                    src={RestakeIcon}
                    className="w-8 h-8"
                  />
                  <span className="text-[#45ff76]">Restake</span>
                </div>
              </Link>
              <Link to="/defi">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img
                    src={DefiIcon}
                    className="w-8 h-8"
                  />
                  <span className="text-[#45ff76]">DeFi</span>
                </div>
              </Link>
              <Link to="/portfolio">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img
                    src={PortfolioIcon}
                    className="w-8 h-8"
                  />
                  <span className="text-[#45ff76]">Portfolio</span>
                </div>
              </Link>
              <Link to="/wrap">
                <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
                  <img src={WrapIcon} className="w-8 h-8" />
                  <span className="text-[#45ff76]">Wrap</span>
                </div>
              </Link>
              <div className="self-center h-full rounded-2xl ml-2 dropdown dropdown-top dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="h-full rounded-2xl px-[15px] py-[6px]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    color="textSubtle"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#45ff76"
                  >
                    <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="w-52 z-[1] menu shadow rounded-box mb-6 p-2 dropdown-content bg-[#001f0b] border border-[#45ff76]"
                >
                  <DropdownContent />
                </ul>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}
