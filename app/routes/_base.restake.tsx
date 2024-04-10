import { Outlet } from '@remix-run/react'
import { Toggle } from '~/components/Toggle'
import React from 'react'
import { useReadContracts } from 'wagmi'
import { CopyReferrerLink } from '~/components/CopyReferrerLink'
import type { MetaFunction } from '@remix-run/cloudflare'
import {
  contracts,
  assets,
  lrtOraclePriceMethod,
  hubChainId,
} from '~/utils/constants'
import { networks } from '~/utils/networks'
import { zgETHABI, oracleAbi } from '~/utils/abis'
import { useAPY } from '~/utils/useAPY'
import { parseAbi } from 'viem'
import diagram from '~/assets/how-it-work.png'
import { formatEth, formatUSD, formatPoints } from '~/utils/bigint'
import { useUserStats } from '~/utils/useUserStats'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | Restake' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  const { data } = useReadContracts({
    contracts: [
      {
        abi: parseAbi([
          `function ${lrtOraclePriceMethod}() view returns (uint256)`,
        ]),
        address: contracts.lrtOracle,
        functionName: lrtOraclePriceMethod,
        chainId: hubChainId,
      },
      {
        abi: zgETHABI,
        address: contracts.zgETH[1],
        functionName: 'balanceOf',
        args: [contracts.lockbox],
        chainId: hubChainId,
      },
      {
        abi: oracleAbi,
        address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
        functionName: 'latestAnswer',
        chainId: 1,
      },
      ...networks.map(({ chain_id }) => ({
        abi: zgETHABI,
        address: contracts.zgETH[chain_id],
        functionName: 'totalSupply',
        chainId: chain_id,
      })),
    ],
  })

  const apy = useAPY()

  let rsETHPrice = 0n
  let ethValue = 0n
  let tvl = 0n
  let tvlUsd = 0n

  try {
    rsETHPrice = data[0].result
    for (let i = 0; i < networks.length; i++) {
      ethValue += data[i + 3].result
    }
    tvl = (rsETHPrice * (ethValue - data[1].result)) / 10n ** 18n
    tvlUsd = (tvl * data[2].result) / 10n ** 8n
  } catch (e) {
    /* Ignore */
  }

  const [isOpen, setIsOpen] = React.useState(false)

  const { lrtPointRecipientStats, isLoading } = useUserStats()

  const formatDashboardPoints = (val?: bigint | string | undefined) =>
    val ? formatPoints(val) : isLoading ? '...' : '-'

  return (
    <>
      <div className="flex flex-col max-w-screen-xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(120deg,_#ffffff_-0.35%,_#37e29a_50%)]">
            Restaking
          </h1>
          <p className="text-md font-normal text-gray-500 mt-2">
            Stake now to earn EigenLayer Points and Zero-G Points!{' '}
          </p>
        </div>

        {/* Overview */}
        <div className="flex flex-col md:flex-row w-full md:space-x-4 space-y-4 md:space-y-0 mt-12">
          <div className="flex flex-col items-center w-full rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-gray-500 bg-opacity-10">
            <div className="text-4xl">{`$${formatUSD(tvlUsd, 0)}`}</div>
            <div className="text-md mt-4">Total Value Locked</div>
          </div>
          <div className="flex flex-col w-full items-center rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-gray-500 bg-opacity-10">
            <div className="text-4xl">TBD</div>
            <div className="text-md mt-4">EigenLayer Points</div>
          </div>
          <div className="flex flex-col w-full items-center rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-gray-500 bg-opacity-10">
            <div className="text-4xl">
              {formatDashboardPoints(
                lrtPointRecipientStats
                  ? BigInt(lrtPointRecipientStats.points)
                  : undefined,
              )}
            </div>
            <div className="text-md mt-4">Zero-G Points</div>
          </div>
        </div>

        {/* Main */}
        <div className="flex flex-col-reverse md:flex-row md:space-x-8 space-y-8 md:space-y-0 gap-x-8 gap-y-8 mt-12">
          {/* Description */}
          <div className="flex flex-col w-full">
            <h2 className="text-3xl text-white font-semibold">Overview</h2>
            <div className="text-lg mt-1 text-white">
              Users can restake from any L2 without the need to leave the
              ecosystem and bridge back to mainnet. Zero-G offers new
              opportunities to users with advantages such as One-Click
              Restaking, Ultra-Low Fee, and Liquidity Retention.
            </div>
            <h2 className="text-2xl text-white font-semibold mt-8">
              How it works
            </h2>
            <div className="w-fit h-fit rounded-2xl mt-4 p-2 bg-gray-500 bg-opacity-10">
              <img src={diagram} />
            </div>
            <h3 className="text-xl font-semibold text-[#83FFD9] mt-8">
              Stake
            </h3>
            <ol className="list-decimal text-base text-white font-medium pl-4 mt-2">
              <li>Select an asset to stake and deposit.</li>
              <li>Stake without bridging assets from L2s.</li>
              <li>Receive zgETH in your wallet.</li>
            </ol>
            <h3 className="text-xl font-semibold text-[#83FFD9] mt-8">
              Unstake & Withdraw
            </h3>
            <div className="text-base text-white font-medium mt-2">
              Coming Soon
            </div>
            <h3 className="text-xl font-semibold text-[#83FFD9] mt-8">
              Fee Structure
            </h3>
            <div className="text-base text-white font-medium mt-2">
              The fee structure consists of a 0% stake fee and a 10% reward fee.
            </div>
          </div>

          {/* Panel */}
          <div className="flex flex-col w-full md:max-w-[440px] gap-0.5">
            <div className="flex justify-between items-center rounded-t-2xl rounded-b p-4 bg-gray-500 bg-opacity-10">
              <div className="type-lg-semibold text-white">APY</div>
              <div className="type-lg-semibold text-white font-medium">
                {`${apy.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}%`}
              </div>
            </div>
            <div className="flex justify-evenly gap-0.5">
              <Toggle
                tabs={[
                  { label: 'Stake', href: '/restake' },
                  { label: 'Unstake', href: '/restake/unstake' },
                  { label: 'Withdraw', href: '/restake/withdraw' },
                ]}
              />
            </div>
            <Outlet />
            <div className="flex flex-col w-full rounded-t-2xl mt-2 p-4 bg-gray-500 bg-opacity-10">
              <div className="flex justify-between">
                <span className="type-lg-semibold text-white">
                  Referral Program
                </span>
                <button onClick={() => setIsOpen(!isOpen)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6 text-white"
                  >
                    {!isOpen && <line x1="12" y1="5" x2="12" y2="19"></line>}
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="flex flex-col text-sm text-gray-200 p-4 bg-gray-500 bg-opacity-10">
                <div className="type-base-medium">
                  You earn 10% of the points your friends make.
                </div>
                <div className="flex justify-between mt-4">
                  <div className="type-base-medium text-white">
                    Referral Points
                  </div>
                  <div className="type-base-semibold text-white font-mono">
                    {formatDashboardPoints(
                      lrtPointRecipientStats
                        ? BigInt(lrtPointRecipientStats.referralPoints)
                        : undefined,
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-b-2xl p-4 bg-gray-500 bg-opacity-10">
              <CopyReferrerLink />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
