import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useState } from 'react'
import { Hash, formatEther } from 'viem'
import moment from 'moment'
import {
  useAccount,
  useBlockNumber,
  useChainId,
  usePublicClient,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'
import { contracts, hubChainId } from '~/utils/constants'
import useWithdrawals from '~/utils/hooks/useWithdrawals'
import { Tooltip } from './Tooltip'
import { Spinner } from './Icons'
import { withdrawalManagerAbi } from '~/utils/abis'
import WarningIcon from '~/assets/warning.svg'

const initialCurrentWithdraw = {
  asset: '',
  nonce: 0n,
}

export default function Withdraw() {
  const { data: blockNumber } = useBlockNumber({
    query: { refetchInterval: 10_000 },
  })
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const [currentWithdraw, setCurrentWithdraw] = useState(initialCurrentWithdraw)
  const { switchChain } = useSwitchChain()
  const { openConnectModal } = useConnectModal()
  const isWithdrawSupported = chainId == hubChainId

  const {
    userWithdrawals,
    isFetching,
    firstAvailableWithdrawalNonce,
    refetchWithdrawals,
  } = useWithdrawals()

  const publicClient = usePublicClient()
  const { writeContract } = useWriteContract()

  const toFixedWithoutRounding = (value: string, decimals: number) =>
    (value.match(new RegExp(`^-?\\d+(?:.\\d{0,${decimals}})?`)) as string[])[0]

  const handleClick = useCallback(
    (amount: number, asset: Hash, nonce: bigint) => {
      if (!isWithdrawSupported) {
        switchChain({ chainId: hubChainId })
      } else {
        setCurrentWithdraw({ asset, nonce })

        try {
          writeContract(
            {
              address: contracts.withdrawalManager,
              abi: withdrawalManagerAbi,
              functionName: 'completeWithdrawal',
              args: [asset],
              chainId: hubChainId,
            },
            {
              onError: (error: any) => {
                console.log(error)
                setCurrentWithdraw(initialCurrentWithdraw)
                refetchWithdrawals()

                // handleErrror(
                //   error?.error || error?.message,
                //   isErrorRejectedByUser(error)
                // );
              },
              onSuccess: (hash) => {
                const txDetails = {
                  hash,
                  wait: () => publicClient?.waitForTransactionReceipt({ hash }),
                }

                // updateTransactionDetails(
                //   txDetails as any,
                //   TXN_TYPES.CLAIM,
                //   amount,
                //   config.xtoken.symbol
                // );
                setCurrentWithdraw(initialCurrentWithdraw)
                refetchWithdrawals()
              },
            },
          )
        } catch (error) {
          console.log(error)
        }
      }
    },
    [isWithdrawSupported, switchChain],
  )

  return (
    <div className="bg-[#00260d] border-2 border-[#0bff72] text-center text-white rounded-b-2xl py-8 px-4 text-xl font-medium">
      <div className="flex flex-col">
        <div className="px-3 py-2 bg-[#ccb142] rounded-xl flex flex-row items-center">
          <img src={WarningIcon} className="w-6 h-6 flex-shrink-0" />
          <div className="text-sm text-[#00260d]">
            Unstake requests are processed within 7-10 days, subject to exit
            queue on beacon chain and delays imposed by EigenLayer
          </div>
        </div>
        <div className="flex flex-col mt-8">
          {userWithdrawals.length ? (
            <>
              <div className="text-xl font-bold text-left mb-2">Amount</div>
              {userWithdrawals
                .sort((a, b) => a.startTime - b.startTime)
                .map((withdrawal) => {
                  const isClaimable = withdrawal.isUnlocked

                  const finalDuration =
                    (withdrawal.unlockedOnBlockNumber - Number(blockNumber)) *
                    12
                  const initialDuration =
                    (withdrawal.initialUnlockDay - Number(blockNumber)) * 12

                  const finalDurationText = moment.duration(
                    finalDuration,
                    'seconds',
                  )
                  const initialDurationText = moment.duration(
                    initialDuration,
                    'seconds',
                  )

                  const isDisabled =
                    firstAvailableWithdrawalNonce[withdrawal.asset] !==
                    withdrawal.nonce

                  const beingWithdrawn =
                    currentWithdraw.asset === withdrawal.asset &&
                    currentWithdraw.nonce === withdrawal.nonce

                  return (
                    <div
                      className="flex justify-between items-center mb-2"
                      key={`${withdrawal.asset}-${withdrawal.startTime}`}
                    >
                      <div className="text-base">
                        {
                          +toFixedWithoutRounding(
                            formatEther(withdrawal.expectedAssetAmount),
                            6,
                          )
                        }{' '}
                        {withdrawal.symbol}
                      </div>
                      {isClaimable && initialDurationText.days() <= 0 && (
                        <button
                          className={`${
                            isDisabled || beingWithdrawn
                              ? 'opacity-60'
                              : 'hover:opacity-90'
                          } bg-[#57ff85] flex text-base px-4 py-1 rounded btn-glow`}
                          disabled={isDisabled || beingWithdrawn}
                          onClick={() =>
                            !isDisabled
                              ? handleClick(
                                  +toFixedWithoutRounding(
                                    formatEther(withdrawal.expectedAssetAmount),
                                    6,
                                  ),
                                  withdrawal.asset,
                                  withdrawal.nonce,
                                )
                              : {}
                          }
                        >
                          {beingWithdrawn ? (
                            <>
                              <Spinner size={14} /> &nbsp; Claim
                            </>
                          ) : (
                            <div className="flex items-center">
                              Claim
                              {isDisabled && (
                                <>
                                  {' '}
                                  &nbsp;
                                  <Tooltip>
                                    Please withdraw the available claim for{' '}
                                    {withdrawal.symbol} above first.
                                  </Tooltip>
                                </>
                              )}
                            </div>
                          )}
                        </button>
                      )}
                      {!(isClaimable && initialDurationText.days() <= 0) && (
                        <div className="text-base">
                          {finalDurationText.days() <= 0
                            ? 'awaiting unlock'
                            : `~in${' '}
                      ${
                        finalDurationText.days() > 1
                          ? `${
                              initialDurationText.days() <= 0
                                ? 1
                                : initialDurationText.days()
                            } -`
                          : ''
                      }
                      ${finalDurationText.days()} day${
                                finalDurationText.days() > 1 ? 's' : ''
                              }`}
                        </div>
                      )}
                    </div>
                  )
                })}
            </>
          ) : isConnected ? (
            <>
              <div className="text-xl font-bold mb-4">
                No unstake requests found
              </div>
              <div className="text-base">
                You will be able to withdraw after the Unstake request has been
                processed. In order to Unstake go to Unstake tab.
              </div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold mb-4">Connect your wallet</div>
              <div className="text-base">
                {' '}
                You will be able to claim your tokens after you connect your
                wallet
              </div>
            </>
          )}
        </div>
        {!isWithdrawSupported && isConnected && (
          <button
            className="btn-glow bg-[#57ff85] text-white text-2xl font-semibold px-3 py-4 self-center w-full mt-6 px-6 py-3 md:py-4 rounded-2xl"
            onClick={() => switchChain({ chainId: hubChainId })}
          >
            Switch to Ethereum
          </button>
        )}
        {!isConnected && (
          <button
            className="btn-glow bg-[#57ff85] text-white text-2xl font-semibold px-3 py-4 self-center w-full mt-6 px-6 py-3 md:py-4 rounded-2xl"
            onClick={openConnectModal}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  )
}
