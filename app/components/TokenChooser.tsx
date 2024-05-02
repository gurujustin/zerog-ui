import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useAccount, useBalance, useReadContracts } from 'wagmi'
import { zeroAddress } from 'viem'

import { zgETHABI } from '~/utils/abis'
import { contracts, assets } from '~/utils/constants'
import { formatEth } from '~/utils/bigint'

import { Tags } from '~/components/Tags'
import { Close } from './Icons'
import { networks } from '~/utils/networks'
import { Tooltip } from './Tooltip'

export function TokenChooser({
  isOpen,
  setIsOpen,
  onChange,
  selectedChain,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onChange: (asset: string, chain: number) => void
  selectedChain: number
}) {
  const [chainId, setChainId] = useState(selectedChain)

  const { isConnected, address } = useAccount()
  let balancesData = []

  assets.map((asset) => {
    if (asset.address) {
      let { data } = useBalance({
        address,
        chainId,
        token: asset.address,
        unit: 'ether',
      })
      balancesData.push(data?.value)
    } else {
      let { data } = useBalance({
        address,
        chainId,
        unit: 'ether',
      })
      balancesData.push(data?.value)
    }
  })

  const findIndex = (symbol: string, chain: number) => {
    let index
    assets.map((asset, i) => {
      if (asset.symbol === symbol && asset.chain === chainId) index = i
    })
    return index
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden bg-[#1d2029] text-left align-middle shadow-xl transition-all rounded-2xl">
                <button
                  className="absolute top-4 right-6 text-white hover:text-black"
                  onClick={() => setIsOpen(false)}
                >
                  <Close />
                </button>
                <div className="flex flex-col">
                  <Dialog.Title
                    as="h3"
                    className="px-6 py-5 text-md font-medium text-white"
                  >
                    Select a token
                  </Dialog.Title>
                  <div className="flex flex-wrap gap-3 justify-center bg-gray-500 bg-opacity-10 p-2">
                    {networks.map((network) => (
                      <div className="" key={network.chain_id}>
                        <button
                          onClick={() => setChainId(network.chain_id)}
                          className={`rounded-lg p-1.5 hover:bg-gray-600 ${
                            chainId === network.chain_id
                              ? 'bg-gray-600'
                              : 'bg-gray-900 bg-opacity-40'
                          }`}
                        >
                          <img src={network.image} className="h-8 w-8" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 text-sm flex flex-col gap-4 min-h-[216px]">
                    <div className="flex flex-col">
                      {assets
                        .filter((asset) => asset.chain === chainId)
                        .map((asset, i) => {
                          return (
                            <button
                              key={asset.symbol}
                              className="flex items-center gap-3 hover:bg-gray-700 rounded-lg p-2 cursor-pointer"
                              onClick={() => {
                                onChange(asset.symbol, asset.chain)
                                setIsOpen(false)
                              }}
                            >
                              <div className="flex relative items-center">
                                <img
                                  src={asset.src}
                                  alt={asset.symbol}
                                  width={48}
                                  height={48}
                                />
                                <span className="flex items-center justify-center overflow-hidden border-background absolute bottom-0 right-0 rounded-full">
                                  <img
                                    src={asset.chainlogo}
                                    alt="Chain Logo"
                                    className="h-4 w-4 size-full"
                                  />
                                </span>
                              </div>
                              <div className="flex flex-row justify-between w-full">
                                <div className="flex flex-col items-start">
                                  <div className="text-gray-200">
                                    {asset.symbol}
                                  </div>
                                  <div className="text-white font-medium">
                                    {asset.name}
                                  </div>
                                </div>
                                {asset.symbol === 'OETH' && (
                                  <div className="absolute right-[84px]">
                                    <Tooltip
                                      refElement={
                                        <span className="bg-green-100 text-green-800 text-base font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                          1.5x Boost
                                        </span>
                                      }
                                    >
                                      Users will be rewarded with 1.5x Zero-G
                                      Points when restaking this asset
                                    </Tooltip>
                                  </div>
                                )}
                                <div className="flex flex-col items-start">
                                  <div className="text-gray-500 font-medium">
                                    {isConnected
                                      ? formatEth(
                                          balancesData[
                                            findIndex(asset.symbol, asset.chain)
                                          ],
                                        )
                                      : 0}
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
