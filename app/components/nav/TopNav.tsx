import { useEffect, useState } from 'react'
import { Link, NavLink } from '@remix-run/react'

import Logo from '~/assets/logo.png'
import MenuIcon from '~/assets/menu.svg'
import LogoMobile from '~/assets/logo-mobile.png'

import primeTokenSrc from '~/assets/prime-eth-token-full.svg'
import eigenPointsSrc from '~/assets/eigen-points.svg'
import primePointsSrc from '~/assets/prime-points.svg'

// import { ConnectButton as ConnectButton1 } from './ConnectButton'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DocsLink } from './DocsLink'
import { Tabs } from '~/components/Tabs'
import { ArrowUpRight } from '~/components/Icons'

import { useLocation } from 'react-router-dom'
import { useUserStats } from '~/utils/useUserStats'
import { formatEth, formatPoints } from '~/utils/bigint'

export const TopNav = () => {
  return (
    <div className="bg-main max-h-20 md:max-h-24 py-4 md:py-6 fixed top-0 right-0 left-0 z-30">
      <DesktopMenu />
    </div>
  )
}

const DesktopMenu = () => {
  const { assetBalance, lrtPointRecipientStats, isLoading } = useUserStats()
  return (
    <>
      <div className='mx-auto flex flex-row justify-between items-center container px-5 md:px-8'>
        <div className='flex flex-row text-style-sub items-center justify-start'>
          <Link to="/">
            <img
              src={Logo}
              alt="logo"
              className='hidden md:block w-[140px]'
            />
            <img src={LogoMobile} alt="logo" className="md:hidden w-[50px]" />
          </Link>
          <div className="flex flex-row hidden md:flex ml-8">
            <NavLink
              to="/restake"
              className={({ isActive }) => (isActive ? 'text-white' : 'text-gray-200')}
            >
              <div className='flex flex-col md:flex-row items-center rounded-xl px-2.5 py-3 outline-none md:w-full text-md font-medium md:type-sm-caption ml-2'>
                <img src='https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b7c4049ee7d1ecfd_crypto-01.svg' height={20} width={20} className='w-5 h-5' />
                <span className='mt-2 ml-0 md:mt-0 md:ml-2.5 text-white'>Restake</span>
              </div>
            </NavLink>
            <NavLink
              to="/defi"
              className={({ isActive }) => (isActive ? 'text-white' : 'text-gray-200')}
            >
              <div className='flex flex-col md:flex-row items-center rounded-xl px-2.5 py-3 outline-none md:w-full text-md font-medium md:type-sm-caption ml-2'>
                <img src='https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b243f88e65f5b99b_coin-stacked-05.svg' height={20} width={20} className='w-5 h-5' />
                <span className='mt-2 ml-0 md:mt-0 md:ml-2.5 text-white'>Defi</span>
              </div>
            </NavLink>
            <a
              href="https://docs.zerog.finance"
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2`}
            >
              <div className='flex flex-col md:flex-row items-center rounded-xl px-2.5 py-3 outline-none md:w-full text-md font-medium md:type-sm-caption ml-2'>
                <img src='https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659bf1256102d36e4215f0fa_Docs.svg' height={20} width={20} className='w-5 h-5' />
                <span className='mt-2 ml-0 md:mt-0 md:ml-2.5 text-white'>Docs</span>
                <ArrowUpRight size={11} />
              </div>
            </a>
          </div>
        </div>
        {/* <div className="hidden md:flex items-center justify-between gap-8 ml-auto">
          <div className="flex items-center gap-2">
            <img className="w-7 h-7" src={primeTokenSrc} alt="Prime ETH" />
            <div className="text-gray-500 text-sm font-medium">
              {formatEth(assetBalance, true)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img className="w-7 h-7" src={primePointsSrc} alt="Prime ETH" />
            <div className="text-gray-500 text-sm font-medium">
              {isLoading ? '0' : formatPoints(lrtPointRecipientStats?.points)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img className="w-7 h-7" src={eigenPointsSrc} alt="Prime ETH" />
            <div className="text-gray-500 text-sm font-medium">
              {isLoading ? '0' : formatPoints(lrtPointRecipientStats?.elPoints)}
            </div>
          </div>
        </div> */}
        <ConnectButton />
        {/* <ConnectButton1 /> */}
      </div>
    </>
  )
}
