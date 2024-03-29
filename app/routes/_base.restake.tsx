import { Outlet } from '@remix-run/react'
import { Toggle } from '~/components/Toggle'
import React from 'react'
import { useReadContracts } from 'wagmi'
import { CopyReferrerLink } from '~/components/CopyReferrerLink'
import type { MetaFunction } from '@remix-run/cloudflare'
import { contracts, assets, lrtOraclePriceMethod, hubChainId } from '~/utils/constants'
import { networks } from '~/utils/networks'
import { zgETHABI, oracleAbi, lrtDepositPoolAbi } from '~/utils/abis'
import { useAPY } from '~/utils/useAPY'
import { parseAbi } from 'viem'
import diagram from '~/assets/how-it-work.png'
import { formatEth, formatUSD } from '~/utils/bigint'

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
        chainId: hubChainId
      },
      {
        abi: zgETHABI,
        address: contracts.xzgETH,
        functionName: 'totalSupply',
        chainId: hubChainId
      },
      {
        abi: oracleAbi,
        address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
        functionName: 'latestAnswer',
        chainId: 1
      },
      ...networks.map(({ chain_id }) => ({
        abi: zgETHABI,
        address: contracts.zgETH[chain_id],
        functionName: 'totalSupply',
        chainId: chain_id
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
  return (
    <>
      <div className='flex flex-col'>
        <div className='bg-main'>
          <div className='mx-auto container px-5 py-4 md:px-8 md:py-6'>
            <div className='flex flex-col space-y-1'>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold xl:leading-[68px] bg-clip-text text-transparent bg-[linear-gradient(120deg,_#ffffff_-0.35%,_#37e29a_50%)]">Liquid Restaking</h1>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400 m-0 text-left">Stake now to earn EigenLayer Points and 3x Zero-G Points! </p>
            </div>
          </div>
          <div className='mx-auto container flex flex-col md:flex-col items-center px-5 py-4 md:px-8 md:py-6 '>
            <div className="flex flex-row w-full justify-between text-sm gap md:gap-8">
              <div
                className="w-4/12 flex flex-col justify-between px-2 py-4 md:p-6 text-gray-400 bg-gray-500 bg-opacity-10 shadow-sm md:rounded-2xl rounded-l-2xl">
                <div className="text-center space-y-2">
                  <div className='flex flex-col'>
                    <div className="text-xl lg:text-3xl font-semibold text-white">{`$${formatUSD(tvlUsd, 0)}`}</div>
                  </div>
                  <div className="text-xs uppercase opacity-70">Total Value Locked</div>
                </div>
              </div>
              <div
                className="w-4/12 flex flex-col justify-between px-2 py-4 md:p-6 text-gray-400 bg-gray-500 bg-opacity-10 shadow-sm md:rounded-2xl ">
                <div className="text-center space-y-2">
                  <div className="text-xl lg:text-3xl font-semibold text-white">TBD</div>
                  <div className="text-xs uppercase opacity-70">EigenLayer Points</div>
                </div>
              </div>
              <div
                className="w-4/12 flex flex-col justify-between px-2 py-4 md:p-6 text-gray-400 bg-gray-500 bg-opacity-10 shadow-sm md:rounded-2xl rounded-r-2xl">
                <div className="text-center space-y-2">
                  <div className="text-xl lg:text-3xl font-semibold text-white">TBD</div>
                  <div className="text-xs uppercase opacity-70">Zero-G Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mx-auto flex flex-row container px-5 py-8 md:px-8 md:py-12'>
          <div className='flex flex-col w-full lg:mt-0'>
            <div className='flex flex-row container flex-wrap lg:flex-nowrap flex-row-reverse'>
              <div className='flex flex-col box-content md:ml-20 w-full md:max-w-[440px]'>
                <div className="flex flex-col gap-0.5 w-full h-fit">
                  <div className='flex flex-row justify-between items-center rounded-t-2xl rounded-b bg-gray-500 bg-opacity-10 py-4 px-5'>
                    <div className='flex flex-row justify-between w-full items-center'>
                      <div className="type-lg-semibold text-white">APY</div>
                      <div className="flex flex-row justify-between items-center">
                        <div className="type-lg-semibold text-white font-medium">
                          {`${apy.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-0.5 w-full flex justify-evenly">
                    <Toggle
                      tabs={[
                        { label: 'Stake', href: '/restake' },
                        { label: 'Unstake', href: '/restake/unstake' },
                        { label: 'Withdraw', href: '/restake/withdraw' },
                      ]}
                    />
                  </div>
                  <Outlet />
                </div>
                <div className="w-full mt-3">
                  <div className="flex flex-col w-full rounded-t-2xl bg-gray-500 bg-opacity-10 p-5">
                    <div className="flex flex-row w-full justify-between">
                      <span className="type-lg-semibold text-white">
                        Referral Program
                      </span>
                      <button id="headlessui-disclosure-button-:r3d:" type="button" onClick={() => setIsOpen(!isOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round" className="h-6 w-6 text-white">
                          {!isOpen && <line x1="12" y1="5" x2="12" y2="19"></line>}
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {isOpen && <div className="pt-0.5 text-sm text-gray-200" id="headlessui-disclosure-panel-:r3e:" data-headlessui-state="open">
                    <div className="flex flex-col bg-gray-500 bg-opacity-10 py-4 px-5">
                      <div className="type-base-medium">
                        You earn 10% of the points your friends make.
                      </div>
                      <div className="flex flex-row justify-between mt-4">
                        <div className="type-base-medium text-white">Referral Points</div>
                        <div className="type-base-semibold text-white font-mono">Coming Soon</div>
                      </div>
                    </div>
                  </div>}
                  <div className="rounded-b-2xl bg-gray-500 bg-opacity-10 p-5 pt-4 mt-0.5">
                    <CopyReferrerLink />
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full mt-8 md:mt-0'>
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-semibold text-white">Overview</h2>
                    <div className="text-lg mt-6 text-white">
                      Users can restake from any L2 without the need to leave the ecosystem and bridge back to mainnet. Zero-G offers new opportunities to users with advantages such as One-Click Restaking, Ultra-Low Fee, and Liquidity Retention.
                    </div>
                  </div>
                </div>
                <div className='pt-10'>
                  <h2 className="text-2xl font-semibold text-white">How it works</h2>
                  <div className='w-fit h-fit mt-6'>
                    <div className='p-2 rounded-2xl bg-gray-500 bg-opacity-10'>
                      <img src={diagram} className='' />
                    </div>
                  </div>
                  <div className="flex flex-col flex-wrap">
                    <div className="w-full mt-12 lg:mt-8">
                      <h3 className="text-xl font-semibold text-[#83FFD9]">Stake</h3>
                      <ol className="text-base font-medium text-white list-decimal pl-5 border-base mt-3 pr-8 leading-5">
                        <li>Select an asset to stake and deposit.</li>
                        <li>Stake without bridging assets from L2s.</li>
                        <li>Receive zgETH in your wallet.</li>
                      </ol>
                    </div>
                    <div className="w-full mt-12 lg:mt-8">
                      <h3 className="text-xl font-semibold text-[#83FFD9]">Unstake & Withdraw</h3>
                      <div className="text-base font-medium text-white">Coming Soon</div>
                    </div>
                    <div className="w-full mt-12 lg:mt-8">
                      <h3 className="text-xl font-semibold text-[#83FFD9]">Fee Structure</h3>
                      <div className="text-base font-medium text-white border-base mt-3 leading-5">The fee structure consists of a 0% stake fee
                        and a 10% reward fee.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
