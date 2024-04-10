import { Link, NavLink } from '@remix-run/react'

import Logo from '~/assets/logo.png'
import PortfolioIcon from '~/assets/portfolio.svg'
import LogoMobile from '~/assets/logo-mobile.png'

import { ConnectButton } from '@rainbow-me/rainbowkit'

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
            <img src={Logo} alt="logo" className="hidden lg:block w-[140px]" />
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
          </div>
        </div>

        {/* Right Side */}
        <ConnectButton />
      </div>
    </>
  )
}
