import { Link, NavLink } from '@remix-run/react'

import Logo from '~/assets/logo.png'
import PortfolioIcon from '~/assets/portfolio.svg'
import WrapIcon from '~/assets/wrap.svg'
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
                isActive ? 'text-white' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-4 px-2">
                <img
                  src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b7c4049ee7d1ecfd_crypto-01.svg"
                  className="w-5 h-5"
                />
                <span className="text-white ml-2">Restake</span>
              </div>
            </NavLink>
            <NavLink
              to="/defi"
              className={({ isActive }) =>
                isActive ? 'text-white' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-2 px-2">
                <img
                  src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b243f88e65f5b99b_coin-stacked-05.svg"
                  className="w-5 h-5"
                />
                <span className="text-white ml-2">DeFi</span>
              </div>
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                isActive ? 'text-white' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-2 px-2">
                <img
                  src={PortfolioIcon}
                  height={20}
                  width={20}
                  className="w-5 h-5"
                />
                <span className="text-white ml-2">Portfolio</span>
              </div>
            </NavLink>
            <NavLink
              to="/wrap"
              className={({ isActive }) =>
                isActive ? 'text-white' : 'text-gray-200'
              }
            >
              <div className="flex items-center h-full text-md font-medium ml-2 px-2">
                <img
                  src={WrapIcon}
                  height={20}
                  width={20}
                  className="w-5 h-5"
                />
                <span className="text-white ml-2">Wrap</span>
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
              className="content-center h-full rounded-2xl px-[15px] py-[6px] bg-[#20232c]"
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
              className="dropdown-content w-52 z-[1] menu mt-2 p-2 shadow rounded-box bg-[#20232c] text-white"
            >
              <DropdownContent />
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
