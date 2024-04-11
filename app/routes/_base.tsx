import { Outlet } from '@remix-run/react'
import { redirect } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

import { TopNav } from '~/components/nav/TopNav'
import { SideNav } from '~/components/nav/SideNav'

import type { MetaFunction } from '@remix-run/cloudflare'
import { useReadContracts } from 'wagmi'
import { parseAbi } from 'viem'

import { zgETHABI, oracleAbi, lrtDepositPoolAbi } from '~/utils/abis'
import { contracts, assets, lrtOraclePriceMethod } from '~/utils/constants'
import { formatEth, formatUSD } from '~/utils/bigint'

import { StatBox, StatBoxItem } from '~/components/StatBox'
import { Tooltip } from '~/components/Tooltip'
import { useAPY } from '~/utils/useAPY'
import Logo from '~/assets/logo.png'
import { DropdownContent } from '~/components/DropdownContent'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* Navigation Bar */}
      <TopNav />

      {/* Body */}
      <div className="flex-1 mt-32 mb-24">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="flex justify-between w-full fixed lg:hidden bottom-0 px-4 sm:px-8 bg-[#20232c]">
        <Link to="/restake">
          <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
            <img
              src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b7c4049ee7d1ecfd_crypto-01.svg"
              className="w-h h-5"
            />
            <span className="mt-2 text-white">Restake</span>
          </div>
        </Link>
        <Link to="/defi">
          <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
            <img
              src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b243f88e65f5b99b_coin-stacked-05.svg"
              className="w-h h-5"
            />
            <span className="mt-2 text-white">DeFi</span>
          </div>
        </Link>
        <Link to="/portfolio">
          <div className="flex flex-col items-center text-xs font-medium px-2 py-4">
            <img
              src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b243f88e65f5b99b_coin-stacked-05.svg"
              className="w-h h-5"
            />
            <span className="mt-2 text-white">Portfolio</span>
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
              fill="white"
            >
              <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="w-52 z-[1] menu shadow rounded-box mb-6 p-2 dropdown-content bg-[#20232c] text-white"
          >
            <DropdownContent />
          </ul>
        </div>
      </div>
    </div>
  )
}
