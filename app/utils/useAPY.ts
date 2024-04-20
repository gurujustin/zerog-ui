import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

import { contracts, hubChainId } from './constants'
import { lrtOracleAbi } from './abis'

export function useAPY(): number {
  const from = new Date(Date.UTC(2024, 3, 25, 18, 0))
  const to = getPrevious735AMUTC()
  const startPrice = 1001168149686353000n

  const { data: zgETHPrice } = useReadContract({
    abi: lrtOracleAbi,
    address: contracts.lrtOracle,
    functionName: 'zgETHPrice',
    chainId: hubChainId
  }) as { data: bigint }

  if (!zgETHPrice) {
    return 0
  }

  const apy = calculateAPY(from, to, startPrice, zgETHPrice)
  return apy * 100
}

const calculateAPY = (
  from: Date,
  to: Date,
  fromAmount: bigint,
  toAmount: bigint,
) => {
  if (fromAmount === 0n || toAmount === 0n) {
    return 0
  }

  const diffTime = to.getTime() - from.getTime()
  const dayDiff = diffTime / (1000 * 60 * 60 * 24)

  const apr =
    (Number(formatEther(toAmount)) / Number(formatEther(fromAmount)) - 1) *
    (365.25 / dayDiff)
  const periods_per_year = 365.25 / Number(dayDiff)
  const apy = (1 + apr / periods_per_year) ** periods_per_year - 1
  // console.log('debug', dayDiff, to, from)

  return apy || 0
}

function getPrevious735AMUTC(): Date {
  const now = new Date()
  // Set the time to 7:35 AM UTC
  now.setUTCHours(7, 35, 0, 0)
  // If the current UTC time is after 7:35 AM today, subtract a day to get the previous occurrence
  if (now > new Date()) {
    now.setUTCDate(now.getUTCDate() - 1)
  }
  return now
}
