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
import { TopNav } from '~/components/nav/TopNav'
import bg from '~/assets/background.jpg'
import WrapIcon from '~/assets/wrap.svg'
import RestakeIcon from '~/assets/Restake.svg'
import DefiIcon from '~/assets/defi.svg'
import PortfolioIcon from '~/assets/portfolio.svg'
import { DropdownContent } from '~/components/DropdownContent'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | Restake' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

export default function Index() {
  const apy = useAPY()

  const [zgEthPrice, setZgEthPrice] = useState(0)
  const [loading, setLoading] = useState(true);
  const [lockedValues, setLockedValues] = useState({
    ethereum: 0,
    optimism: 0,
    arbitrum: 0,
    base: 0,
  })
  const [totalValueLocked, setTotalValueLocked] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalElPoints, setTotalElPoints] = useState(0)

  const enableNetworks = networks.filter(network => network.stakeEnable)

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
      ...enableNetworks
      .map(({ chain_id }) => ({
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
    const img = new Image();
    img.src = bg;
    img.onload = () => {
      setLoading(false);
    };
  }, []);

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
      for (let i = 0; i < enableNetworks.length; i++) {
        value += Number(data[i + 3].result ?? 0)
      }
      setTotalValueLocked((value - Number(data[1].result ?? 0)) / 10 ** 18)
    }
  }, [data])

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
                {/* <div className="flex flex-col">
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(120deg,_#ffffff_-0.35%,_#37e29a_50%)]">
                    Restaking
                  </h1>
                  <p className="text-md font-normal text-gray-500 mt-2">
                    Stake now to earn EigenLayer Points and Zero-G Points!{' '}
                  </p>
                </div> */}

                {/* Overview */}
                <div className="flex flex-col md:flex-row w-full md:space-x-4 space-y-4 md:space-y-0 mt-12">
                  <div className="flex flex-col items-center w-full rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-[#001f0b] border-2 border-[#0bff72]">
                    <div className="text-4xl text-[#45ff76]">
                      ${formatNumber(Number(totalValueLocked * zgEthPrice), 0)}
                    </div>
                    <div className="flex items-center text-md mt-4 text-[#7dfa9e]">
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
                  <div className="flex flex-col w-full items-center rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-[#001f0b] border-2 border-[#0bff72]">
                    <div className="text-4xl text-[#45ff76]">
                      {formatNumber(Number(totalElPoints), 0)}
                    </div>
                    <div className="text-md mt-4 text-[#7dfa9e]">Total EigenLayer Points</div>
                  </div>
                  <div className="flex flex-col w-full items-center rounded-2xl shadow-sm p-4 md:p-8 text-gray-400 bg-[#001f0b] border-2 border-[#0bff72]">
                    <div className="text-4xl text-[#45ff76]">
                      {' '}
                      {formatNumber(Number(totalPoints), 0)}
                    </div>
                    <div className="flex items-center text-md mt-4 text-[#7dfa9e]">
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
                    <h2 className="text-4xl text-white font-semibold">Overview</h2>
                    <div className="text-lg mt-4 bg-[#060a078a] text-white rounded-2xl px-3 py-2">
                      Users can restake from any L2 without the need to leave the
                      ecosystem and bridge back to mainnet. Zero-G offers new
                      opportunities to users with advantages such as One-Click
                      Restaking, Ultra-Low Fee, and Liquidity Retention.
                    </div>
                    <h2 className="text-4xl text-white font-semibold mt-8">
                      How it works
                    </h2>
                    <div className="w-fit mt-4">
                      <img src={diagram} />
                    </div>
                    <h3 className="text-4xl font-semibold text-white mt-8">Stake</h3>
                    <ol className="list-decimal bg-[#060a078a] px-8 py-2 rounded-2xl text-base text-white font-medium mt-4">
                      <li>Select an asset to stake and deposit.</li>
                      <li>Stake without bridging assets from L2s.</li>
                      <li>Receive zgETH in your wallet.</li>
                    </ol>
                    <h3 className="text-4xl font-semibold text-white mt-8">
                      Fee Structure
                    </h3>
                    <div className="flex flex-col bg-[#060a078a] px-3 py-2 rounded-2xl text-base text-white font-medium mt-4">
                      <span>0% Stake fee</span>
                      <span>10% Reward fee</span>
                    </div>
                  </div>

                  {/* Panel */}
                  <div className="flex flex-col w-full md:max-w-[440px]">
                    <div className="flex justify-between items-center rounded-t-2xl p-4 bg-[#00260d] border-2 border-[#0bff72]">
                      <div className="type-lg-semibold text-white">APY</div>
                      <div className='text-xl text-[#54f591]' style={{textShadow: "0px 0px 20px #0bff72"}}>
                        {Intl.NumberFormat('en-US', {
                          maximumFractionDigits: 2,
                        }).format(apy)}
                        %
                      </div>
                    </div>
                    <div className="flex justify-evenly gap-1 border-2 border-[#0bff72] border-t-0 border-b-0 p-1">
                      <Toggle
                        tabs={[
                          { label: 'Stake', href: '/restake' },
                          { label: 'Unstake', href: '/restake/unstake' },
                          { label: 'Withdraw', href: '/restake/withdraw' },
                        ]}
                      />
                    </div>
                    <Outlet />
                    <div className="flex flex-col w-full rounded-t-2xl mt-2 p-4 bg-[#00260d] border-2 border-[#0bff72]">
                      <div className="flex justify-between">
                        <span className="type-lg-semibold text-white">
                          Referral Bonus
                        </span>
                        <span className='text-xl text-[#54f591]' style={{textShadow: "0px 0px 20px #0bff72"}}>10%</span>
                      </div>
                      <div className="type-base-medium text-white">
                        You earn 10% of the points your friends make.
                      </div>
                    </div>
                    <div className="rounded-b-2xl p-4 bg-[#00260d]  text-center border-2 border-[#0bff72] border-t-0">
                      <CopyReferrerLink />
                    </div>
                    <h3 className="text-4xl font-semibold text-white mt-8">
                      Unstake & Withdraw
                    </h3>
                    <div className="bg-[#060a078a] px-3 py-2 rounded-2xl text-base text-white font-medium mt-4">
                      For native ETH, users may unstake in multiple of 32ETH. When you unstake, you exit a created validator.<br/>
                      Unstake requests are processed within 7-10 days, subject to exit queue on beacon chain and delays imposed by EigenLayer.
                    </div>
                  </div>
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
