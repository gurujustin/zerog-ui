import { Link, NavLink } from '@remix-run/react'

import Logo from '~/assets/logo.svg'
import PortfolioIcon from '~/assets/portfolio.svg'
import WrapIcon from '~/assets/wrap.svg'
import RestakeIcon from '~/assets/Restake.svg'
import DefiIcon from '~/assets/defi.svg'
import LogoMobile from '~/assets/logo-mobile.png'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu } from '@headlessui/react'
import { DropdownContent } from '../DropdownContent'

export const TopNav = () => {
  return (
    <div className="w-full fixed z-30 py-4 bg-main">
      <DesktopMenu />
    </div>
  )
}

const DesktopMenu = () => {
  return (
    <>
      <div className="flex justify-between max-w-screen-xl mx-auto px-4 sm:px-8">
        {/* Left Side */}
        <div className="flex items-center text-style-sub">
          {/* Logo */}
          <Link to="/">
            <img src={Logo} alt="logo" className="hidden lg:block w-[160px]" />
            <img src={LogoMobile} alt="logo" className="lg:hidden w-[50px]" />
          </Link>

          {/* Menu */}
          <div className="hidden lg:flex">
            <NavLink
              to="/restake"
              className={({ isActive }) =>
                isActive ? 'text-shadow-green' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-4 px-2">
                <img
                  src={RestakeIcon}
                  className="w-10 h-10"
                />
                <span className="text-[#45ff76] ml-2">Restake</span>
              </div>
            </NavLink>
            <NavLink
              to="/defi"
              className={({ isActive }) =>
                isActive ? 'text-shadow-green' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-2 px-2">
                <img
                  src={DefiIcon}
                  className="w-10 h-10"
                />
                <span className="text-[#45ff76] ml-2">DeFi</span>
              </div>
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                isActive ? 'text-shadow-green' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-2 px-2">
                <img
                  src={PortfolioIcon}
                  height={20}
                  width={20}
                  className="w-10 h-10"
                />
                <span className="text-[#45ff76] ml-2">Portfolio</span>
              </div>
            </NavLink>
            <NavLink
              to="/wrap"
              className={({ isActive }) =>
                isActive ? 'text-shadow-green' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-2 px-2">
                <img
                  src={WrapIcon}
                  height={20}
                  width={20}
                  className="w-10 h-10"
                />
                <span className="text-[#45ff76] ml-2">Wrap</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex">
          <ConnectButton showBalance={false} />
          <div className="hidden lg:block h-full rounded-2xl ml-2 dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="content-center h-full rounded-2xl px-[15px] py-[6px] bg-[#001f0b] border border-[#45ff76]"
            >
              <svg
                viewBox="0 0 24 24"
                color="textSubtle"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
              >
                <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content w-52 z-[1] menu mt-2 p-2 shadow rounded-box bg-[#001f0b] border border-[#45ff76] text-white"
            >
              <DropdownContent />
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
