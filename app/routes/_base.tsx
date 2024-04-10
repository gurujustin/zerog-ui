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
      <div className="flex-1 mt-24 mb-24">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="flex justify-between w-full fixed lg:hidden bottom-0 px-4 bg-[#20232c]">
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
      </div>
    </div>
  )
}
