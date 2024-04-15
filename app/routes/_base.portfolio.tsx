import type { MetaFunction } from '@remix-run/cloudflare'
import { Outlet } from '@remix-run/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Tooltip } from '~/components/Tooltip'
import { formatNumber } from '~/utils/formatNumber'
import { graphqlClient } from '~/utils/graphql'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | Portfolio' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  // const { address } = useAccount()
  const address = '0xcdd8111b06d32fa89d4a111f15fe17bd38410926'

  const chains = {
    1: 'ethereum',
    42161: 'arbitrum',
    8453: 'base',
    10: 'optimism',
  }
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalElPoints, setTotalElPoints] = useState(0)
  const { isLoading: isSubsquidLoading, data: subsquid } = useQuery({
    queryKey: ['accounts'],
    queryFn: address
      ? graphqlClient<
          {
            accounts: {
              balance: number
              chainId: number
              elPoints: number
              points: number
              referralPoints: number
            }[]
          },
          { address: string }
        >(
          `
        query ($address: String!){
          accounts(where: {address_eq: $address}){
            balance
            chainId
            elPoints
            points
            referralPoints
          }
        }
        `,
          { address: address.toLowerCase() },
        )
      : () => {
          return { accounts: [] }
        },
  })

  useEffect(() => {
    if (!isSubsquidLoading && subsquid) {
      let points = 0,
        elPoints = 0
      for (let i = 0; i < subsquid.accounts.length; i++) {
        points += Number(subsquid.accounts[i].points)
        elPoints += Number(subsquid.accounts[i].elPoints)
      }
      setTotalPoints(points / 10 ** 18)
      setTotalElPoints(elPoints / 10 ** 18)
    }
  }, [isSubsquidLoading, subsquid])

  return (
    <>
      <div className="flex flex-col max-w-screen-xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(120deg,_#ffffff_-0.35%,_#37e29a_50%)]">
            Portfolio
          </h1>
          <p className="text-md font-normal text-gray-500 mt-2">
            Your rewards from restaking, referral and DeFi
          </p>
        </div>

        {/* Overview */}
        <div className="flex flex-col md:flex-row w-full md:space-x-4 space-y-4 md:space-y-0 mt-12">
          <div className="flex flex-col w-full rounded-2xl shadow-sm px-2 p-4 md:p-8 text-gray-400 bg-gray-500 bg-opacity-10">
            <div className="text-md font-medium">EigenLayer Points Earned</div>
            <div className="text-sm text-neutral-500 mt-1">
              <span>Points will start accruing 24 hours after deposit</span>
            </div>
            <div className="flex gap-2 text-4xl text-white mt-6">
              {formatNumber(Number(totalElPoints), 0)}
              <span className="text-xl self-end">Pts</span>
            </div>
          </div>
          <div className="flex flex-col w-full rounded-2xl shadow-sm px-2 p-4 md:p-8 text-gray-400 bg-gray-500 bg-opacity-10">
            <div className="text-md font-medium">
              Zero-G Points &nbsp;
              <Tooltip>
                {!isSubsquidLoading &&
                  subsquid &&
                  subsquid.accounts.map((account) => {
                    return (
                      <div>
                        {`${chains[account.chainId]} : ${formatNumber(
                          account.points / 10 ** 18,
                          0,
                        )} pts`}
                      </div>
                    )
                  })}
              </Tooltip>
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              <span>Earn when you deposit ETH and refer your friends</span>
            </div>
            <div className="flex gap-2 text-4xl text-white mt-6">
              {formatNumber(Number(totalPoints), 0)}
              <span className="text-xl self-end">Pts</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex flex-col gap-0.5 mt-4">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-5 rounded-xl gap-4 mb-0.5 px-6 py-4 bg-gray-500 bg-opacity-10 text-gray-400">
            <span className="col-span-2">Protocol</span>
            <span>Assets</span>
            <span>Zero-G Points</span>
            <span>EigenLayer Points</span>
          </div>

          {/* Table Body */}
          <Outlet />
        </div>
      </div>
    </>
  )
}
