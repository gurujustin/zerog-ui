import { Outlet } from '@remix-run/react'
import { Toggle } from '~/components/Toggle'
import React, { useEffect, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { CopyReferrerLink } from '~/components/CopyReferrerLink'
import type { MetaFunction } from '@remix-run/cloudflare'
import {
  contracts,
  assets,
  lrtOraclePriceMethod,
  hubChainId,
  CHAINS,
} from '~/utils/constants'
import { networks } from '~/utils/networks'
import { zgETHABI, oracleAbi } from '~/utils/abis'
import { useAPY } from '~/utils/useAPY'
import { Abi, parseAbi } from 'viem'
import diagram from '~/assets/how-it-work.png'
import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '~/utils/graphql'
import { Tooltip } from '~/components/Tooltip'
import { formatNumber } from '~/utils/formatNumber'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | Restake' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  const apy = useAPY()

  const [zgEthPrice, setZgEthPrice] = useState(0)
  const [lockedValues, setLockedValues] = useState({
    ethereum: 0,
    optimism: 0,
    arbitrum: 0,
    base: 0,
  })
  const [totalValueLocked, setTotalValueLocked] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalElPoints, setTotalElPoints] = useState(0)

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
        abi: zgETHABI as Abi,
        address: contracts.zgETH[1],
        functionName: 'balanceOf',
        args: [contracts.lockbox],
        chainId: hubChainId,
      },
      {
        abi: oracleAbi as Abi,
        address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
        functionName: 'latestAnswer',
        chainId: 1,
      },
      ...networks.map(({ chain_id }) => ({
        abi: zgETHABI as Abi,
        address: contracts.zgETH[chain_id],
        functionName: 'totalSupply',
        chainId: chain_id,
      })),
    ],
  })

  const { isLoading: isSubsquidLoading, data: subsquid } = useQuery({
    queryKey: ['summaries'],
    queryFn: graphqlClient<{
      summaries: {
        balance: string
        chainId: number
        elPoints: number
        points: number
      }[]
    }>(
      `
        query {
            summaries {
                balance
                chainId
                elPoints
                points
              }
        }
        `,
    ),
  })

  useEffect(() => {
    if (!isSubsquidLoading && subsquid) {
      console.log(isSubsquidLoading, subsquid)
      let points = 0,
        elPoints = 0
      for (let i = 0; i < subsquid.summaries.length; i++) {
        points += subsquid.summaries[i].points / 10 ** 18
        elPoints += subsquid.summaries[i].elPoints / 10 ** 18
      }
      setTotalPoints(points)
      setTotalElPoints(elPoints)
    }
  }, [isSubsquidLoading, subsquid])

  useEffect(() => {
    if (data) {
      let value = 0
      setZgEthPrice(
        (Number(data[0].result ?? 0) * Number(data[2].result ?? 0)) / 10 ** 26,
      )
      setLockedValues({
        ethereum: Number(data[3].result ?? 0) - Number(data[1].result ?? 0),
        optimism: Number(data[4].result ?? 0),
        arbitrum: Number(data[5].result ?? 0),
        base: Number(data[6].result ?? 0),
      })
      for (let i = 0; i < networks.length; i++) {
        value += Number(data[i + 3].result ?? 0)
      }
      setTotalValueLocked((value - Number(data[1].result ?? 0)) / 10 ** 18)
    }
  }, [data])

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
            <div className="text-4xl">
              ${formatNumber(Number(totalValueLocked * zgEthPrice), 0)}
            </div>
            <div className="flex items-center text-md mt-4">
              Total Value Locked &nbsp;
              <Tooltip>
                {Object.entries(lockedValues).map(([key, value]) => {
                  return (
                    <div key={key}>
                      {`${key} : $${formatNumber(
                        Number((value * zgEthPrice) / 10 ** 18),
                        0,
                      )}`}
                    </div>
                  )
                })}
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col w-full items-center rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-gray-500 bg-opacity-10">
            <div className="text-4xl">
              {formatNumber(Number(totalElPoints), 0)}
            </div>
            <div className="text-md mt-4">Total EigenLayer Points</div>
          </div>
          <div className="flex flex-col w-full items-center rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-gray-500 bg-opacity-10">
            <div className="text-4xl">
              {' '}
              {formatNumber(Number(totalPoints), 0)}
            </div>
            <div className="flex items-center text-md mt-4">
              Total Zero-G Points &nbsp;
              <Tooltip>
                {!isSubsquidLoading &&
                  subsquid &&
                  subsquid.summaries.map((summary) => {
                    return (
                      <div key={summary.chainId}>
                        {`${CHAINS[summary.chainId]} : ${formatNumber(
                          summary.points / 10 ** 18,
                          0,
                        )} pts`}
                      </div>
                    )
                  })}
              </Tooltip>
            </div>
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
            <h3 className="text-xl font-semibold text-[#83FFD9] mt-8">Stake</h3>
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
                {Intl.NumberFormat('en-US', {
                  maximumFractionDigits: 2,
                }).format(apy)}
                %
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
              </div>
            </div>
            <div className="flex flex-col text-sm text-gray-200 p-4 bg-gray-500 bg-opacity-10">
              <div className="type-base-medium">
                You earn 10% of the points your friends make.
              </div>
            </div>
            <div className="rounded-b-2xl p-4 bg-gray-500 bg-opacity-10">
              <CopyReferrerLink />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
