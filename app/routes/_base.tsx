import { Outlet } from '@remix-run/react'
import { redirect } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

import { TopNav } from '~/components/nav/TopNav'
import { SideNav } from '~/components/nav/SideNav'

import type { MetaFunction } from '@remix-run/cloudflare'
import { useReadContracts } from 'wagmi'
import { parseAbi } from 'viem'
import { calculateAPY } from '~/utils/calculateAPY'

import { zgETHABI, oracleAbi, lrtDepositPoolAbi } from '~/utils/abis'
import { contracts, assets, lrtOraclePriceMethod } from '~/utils/constants'
import { formatEth, formatUSD } from '~/utils/bigint'

import { StatBox, StatBoxItem } from '~/components/StatBox'
import { Tooltip } from '~/components/Tooltip'
import { useAPY } from '~/utils/useAPY'
import Logo from '~/assets/logo.png'
import AuditIcon from '~/assets/audit.svg'
import { redirect } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}
// export async function loader() {
//   return redirect('/restake')
// }

export default function Index() {
  // const { data } = useReadContracts({
  //   contracts: [
  //     {
  //       abi: parseAbi([
  //         `function ${lrtOraclePriceMethod}() view returns (uint256)`,
  //       ]),
  //       address: contracts.lrtOracle,
  //       functionName: lrtOraclePriceMethod,
  //     },
  //     {
  //       abi: zgETHABI,
  //       address: contracts.zgETH,
  //       functionName: 'totalSupply',
  //     },
  //     {
  //       abi: oracleAbi,
  //       address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  //       functionName: 'latestAnswer',
  //     },
  //   ],
  // })

  // const apy = useAPY()

  // const pointSummary = useQuery({
  //   queryKey: ['prime-eth-point-summary'],
  //   queryFn: graphqlClient<{
  //     lrtSummaries: [{ elPoints: string; points: string }]
  //   }>(`
  //     query PointSummary {
  //       lrtSummaries(limit: 1, orderBy: id_DESC) {
  //         points
  //         elPoints
  //       }
  //     }
  //   `),
  // })

  // if (!data) return null
  // // on goerli
  // data[2].result = 354600000000n;

  // let rsETHPrice = 0n
  // let tvl = 0n
  // let tvlUsd = 0n

  // try {
  //   rsETHPrice = data[0].result
  //   tvl = (rsETHPrice * data[1].result) / 10n ** 18n
  //   tvlUsd = (tvl * data[2].result) / 10n ** 8n
  // } catch (e) {
  //   /* Ignore */
  // }

  // const formatPointEL = (val?: string) =>
  //   val ? formatPoints(val) : pointSummary.isLoading ? '...' : '-'
  //
  // const formatPointXP = (val?: string) =>
  //   val ? formatPoints(BigInt(val)) : pointSummary.isLoading ? '...' : '-'

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <TopNav />
      <div className="mb-auto mt-20 md:mt-24 flex-1">
        <Outlet />
        {/* <div className="hidden md:block w-full max-w-[250px]">
          <SideNav />
        </div> */}
        {/* <div className="w-full sm:w-[250px] flex flex-col gap-6 pb-12">
          <StatBox title="Global Stats" cols={1}>
            <div className="px-2">
              <div className="text-gray-500 text-sm flex items-center gap-1 leading-relaxed">
                TVL
                <Tooltip size={16} className="p-2 text-xs">
                  Total Value Locked
                </Tooltip>
              </div>
              <div className="mt-1 text-xl">
                {`${formatEth(tvl, true)} ETH`}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {`$${formatUSD(tvlUsd, 0)}`}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-1 leading-relaxed mt-6">
                APY
                <Tooltip size={16} className="p-2 text-xs">
                  The yield from the underlying LSTs, calculated daily.
                </Tooltip>
              </div>
              <div className="mt-1 text-xl">
                {`${apy.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}%`}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                <div>+ EigenLayer Points</div>
                <div>+ zgETH XP</div>
              </div>
            </div>
          </StatBox>
          <StatBox title="Assets Deposited" cols={2}>
            {assets.map(({ name, symbol, src }, i) => (
              <StatBoxItem
                key={i}
                label={symbol}
                logo={src}
                value={formatEth(data[i + 3].result, true)}
                tooltip={name}
              />
            ))}
          </StatBox>
        </div> */}
      </div>
      <div className="flex flex-col bg-main items-start pt-8 md:pt-12 text-white">
        <div className="mx-auto container px-8 md:pb-0 pb-16">
          <div className="flex flex-row justify-between items-center">
            <img alt="Zerog Logo" src={Logo} width="146" height="32" />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col md:flex-row mt-8 type-base-medium">
              <a
                href="https://twitter.com/zerogfinance"
                target="_blank"
                rel="noreferrer"
                className="mr-10"
              >
                Twitter
              </a>
              <a
                href="https://discord.gg/zerogfinance"
                target="_blank"
                rel="noreferrer"
                className="mr-10"
              >
                Discord
              </a>
              <a
                href="https://mirror.xyz/zerogfi.eth"
                target="_blank"
                rel="noreferrer"
                className="mr-10"
              >
                Mirror
              </a>
            </div>
            <div className="flex flex-col md:flex-row md:justify-end type-base-semibold text-gray-200 relative md:-top-8 mt-8 md:mt-0">
              <a
                className="mr-10"
                href="https://github.com/zero-g-fi"
                target="_blank"
              >
                Github
              </a>
              <a
                href="https://docs.zerog.finance/"
                target="_blank"
                rel="noreferrer"
                className="mr-10"
              >
                Docs
              </a>
              <a
                href="https://docs.zerog.finance/security/audits"
                target="_blank"
                rel="noreferrer"
              >
                Audit
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center my-5 sm:mt-10 text-frenchGray text-sm">
            <div className="">Copyright © 2024 Zero-G Finance</div>
          </div>
        </div>
        <div className="fixed md:hidden bottom-0 w-full p-1">
          <div className="flex flex-row bg-[#20232c] w-full place-content-center py-1">
            <Link to="/restake">
              <div className="flex flex-col md:flex-row items-center rounded-xl px-2.5 py-3 outline-none md:w-full text-xs font-medium md:type-sm-caption w-[74px]">
                <img
                  src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b7c4049ee7d1ecfd_crypto-01.svg"
                  className="w-h h-5"
                />
                <span className="mt-2 ml-0 md:mt-0 md:ml-2.5 text-white">
                  Restake
                </span>
              </div>
            </Link>
            <Link to="/defi">
              <div className="flex flex-col md:flex-row items-center rounded-xl px-2.5 py-3 outline-none md:w-full text-xs font-medium md:type-sm-caption w-[74px]">
                <img
                  src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659d3701b243f88e65f5b99b_coin-stacked-05.svg"
                  className="w-h h-5"
                />
                <span className="mt-2 ml-0 md:mt-0 md:ml-2.5 text-white">
                  DeFi
                </span>
              </div>
            </Link>
            <Link
              to="https://docs.zerog.finance/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex flex-col md:flex-row items-center rounded-xl px-2.5 py-3 outline-none md:w-full text-xs font-medium md:type-sm-caption w-[74px]">
                <img src={AuditIcon} className="w-h h-5" />
                <span className="mt-2 ml-0 md:mt-0 md:ml-2.5 text-white">
                  Audits
                </span>
              </div>
            </Link>
            <Link
              to="https://docs.zerog.finance/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex flex-col md:flex-row items-center rounded-xl px-2.5 py-3 outline-none md:w-full text-xs font-medium md:type-sm-caption w-[74px]">
                <img
                  src="https://assets-global.website-files.com/63c8d82f64b86c5899397e13/659bf1256102d36e4215f0fa_Docs.svg"
                  className="w-h h-5"
                />
                <span className="mt-2 ml-0 md:mt-0 md:ml-2.5 text-white">
                  Docs
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
