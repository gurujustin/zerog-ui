import { useState, useEffect } from 'react'
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWalletClient,
  useBalance,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { parseEther, parseAbi, formatEther } from 'viem'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { formatEth } from '~/utils/bigint'
import {
  contracts,
  assets,
  lrtOraclePriceMethod,
  Asset,
  hubChainId,
} from '~/utils/constants'
import { networks } from '~/utils/networks'
import { Modal } from '~/components/Modal'
import { TokenChooser } from '~/components/TokenChooser'
import { getReferrerId } from '~/utils/useReferrerTracker'

import metamask from '~/assets/metamask.svg'
import tokenImage from '~/assets/logo-mobile.png'

import {
  lrtOracleAbi,
  zgETHABI,
  lrtDepositPoolAbi,
  xZerogDepositAbi,
  LZZerogDepositAbi,
} from '~/utils/abis'
import { Tooltip } from '~/components/Tooltip'

export default function Index() {
  const chainId = useChainId()
  const [selectedChain, setSelectedChain] = useState(hubChainId) // mainnet 1
  const { switchChain } = useSwitchChain()
  const { openConnectModal } = useConnectModal()
  const [isTxModalOpened, setIsTxModalOpened] = useState(false)
  const [isTokenSelectModalOpened, setIsTokenSelectModalOpened] =
    useState(false)
  /* stores token + connected address approvals issued this session.
   * Required for showing a disabled approval button after the approve
   * transaction is done.
   */
  const walletClient = useWalletClient()
  const contractWrite = useWriteContract()
  const { isConnected, address } = useAccount()

  const [asset, setAsset] = useState(assets[0].symbol)
  const activeAsset = assets.find(
    (a) => a.symbol === asset && a.chain === selectedChain,
  ) as Asset
  const [inputAmount, setInputAmount] = useState('0')
  const connectedAddress =
    address || '0x1111111111111111111111111111111111111111'
  const { data, refetch } = useReadContracts({
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
        address: contracts.zgETH[selectedChain],
        functionName: 'balanceOf',
        args: [connectedAddress],
        chainId: selectedChain
      },
      {
        abi: lrtOracleAbi,
        address: contracts.lrtOracle,
        functionName: 'getAssetPrice',
        args: [
          activeAsset.address
            ? activeAsset.address
            : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        ],
        chainId: hubChainId,
      },
      {
        abi: zgETHABI,
        address: activeAsset.address
          ? activeAsset.address
          : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        functionName: 'allowance',
        args: [connectedAddress, contracts.lrtDepositPool[selectedChain]],
        chainId: selectedChain,
      },
      {
        abi: zgETHABI,
        address: activeAsset.address
          ? activeAsset.address
          : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        functionName: 'balanceOf',
        args: [connectedAddress],
        chainId: selectedChain,
      },
    ],
  })

  const { data: ethBalanceData, refetch: refetchEthBalanceData } = useBalance({
    address: connectedAddress,
    chainId: selectedChain,
  })

  const txReceipt = useWaitForTransactionReceipt({ hash: contractWrite.data })

  /* refetch data on any transaction succeeding. Important to refresh data
   * and to enable Stake button (Modal or in-page) after approve succeeds.
   */
  useEffect(() => {
    if (contractWrite.status === 'success' && txReceipt.data) {
      refetch()
      refetchEthBalanceData()
      /* It can happen that a wallet provider (say Metamask) will already
       * see a transaction processed and approval updated on a contract
       * while another provider (e.g. Infura) will still not have seen the
       * latest data. As a workaround to 2 more re-fetches 3 & 10 seconds later.
       */

      setTimeout(refetch, 3000)
      setTimeout(refetch, 10000)

      setTimeout(refetchEthBalanceData, 3000)
      setTimeout(refetchEthBalanceData, 10000)
    }
  }, [contractWrite.status, txReceipt.data, refetch, refetchEthBalanceData])

  useEffect(() => {
    if (contractWrite.status === 'pending') {
      setIsTxModalOpened(true)
    }
  }, [contractWrite.status, txReceipt.data, refetch, refetchEthBalanceData])

  let zgPriceInEth = 0,
    zgBalance = 0,
    assetPriceInEth = 0,
    assetAllowance = 0,
    assetBalance = 0,
    assetPriceInZg = 0,
    outputAmount = 0,
    amount = parseEther(inputAmount)

  if (data && ethBalanceData) {
    try {
      zgPriceInEth = Number(data[0]?.result || 10 ** 18)
      // if contract not connected balance is 0
      zgBalance = Number(data[1].result)
      assetPriceInEth = Number(data[2].result || 10 ** 18)
      assetAllowance = isConnected ? Number(data[3].result) : 0
      assetBalance = isConnected
        ? asset === 'ETH' || asset === 'frxETH'
          ? Number(ethBalanceData.value)
          : Number(data[4].result)
        : 0
      assetPriceInZg = (10 ** 18 * zgPriceInEth) / assetPriceInEth
      outputAmount = Math.trunc((zgPriceInEth * Number(amount)) / assetPriceInEth)
    } catch (e) {
      console.log(e)
    }
  }

  let canStake = true
  let isApproved = true
  let stakeButtonText = 'Stake'
  let approveButtonText = `${asset} approved`
  // show approve button if we can stake and asset has been approved this session
  if(selectedChain == 8453 || selectedChain == 10 || selectedChain == 252 || selectedChain == 34443) {
    canStake = false
    stakeButtonText = "Coming soon"
  } else if (!isConnected) {
    stakeButtonText = 'Connect wallet'
  } else if (Number(amount) <= 0) {
    stakeButtonText = 'Enter an amount'
    canStake = false
  } else if (Number(amount) > assetBalance) {
    stakeButtonText = 'Not enough balance'
    canStake = false
  } else if (chainId !== selectedChain) {
    stakeButtonText = `Switch Network`
    canStake = true
  } else if (Number(amount) > assetAllowance) {
    stakeButtonText = `Stake`
    approveButtonText = `Approve ${asset}`
    canStake = false
    isApproved = false
  }

  const handleStake = () => {
    if (!canStake) return

    if (!isConnected) {
      openConnectModal?.()
    } else if (chainId !== selectedChain) {
      switchChain({ chainId: selectedChain })
    } else if (asset === 'ETH') {
      // reset stake form
      setInputAmount('')
      if (chainId === hubChainId) {
        contractWrite.writeContract({
          abi: lrtDepositPoolAbi,
          address: contracts.lrtDepositPool[chainId],
          functionName: 'depositETH',
          args: [0, getReferrerId()],
          value: amount,
        })
      } else {
        const now = new Date()
        const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        contractWrite.writeContract({
          abi: xZerogDepositAbi,
          address: contracts.lrtDepositPool[chainId],
          functionName: 'depositETH',
          args: [0, Math.floor(deadline.getTime() / 1000), getReferrerId()],
          value: amount,
        })
      }
    } else if (asset === 'frxETH') {
      contractWrite.writeContract({
        abi: LZZerogDepositAbi,
        address: contracts.lrtDepositPool[chainId],
        functionName: 'deposit',
        args: [getReferrerId()],
        value: amount,
      })
    } else if (Number(amount) <= assetAllowance) {
      if (asset === 'stETH' || asset === 'mETH' || asset === 'sfrxETH' || asset === 'OETH') {
        contractWrite.writeContract({
          abi: lrtDepositPoolAbi,
          address: contracts.lrtDepositPool[chainId],
          functionName: 'depositAsset',
          args: [activeAsset.address, amount, 0, getReferrerId()],
        })
      } else {
        // reset stake form
        const now = new Date()
        const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        contractWrite.writeContract({
          abi: xZerogDepositAbi,
          address: contracts.lrtDepositPool[chainId],
          functionName: 'deposit',
          args: [
            amount,
            0,
            Math.floor(deadline.getTime() / 1000),
            getReferrerId(),
          ],
        })
      }
    }
  }

  let modalTitle = 'Transaction in process'
  let modalStatus = 'loading'
  let modalDescription = ''
  let modalButtonText = ''
  let modalButtonHref
  let modalButtonAction
  // button not disabled except if action is stake and stake is disabled
  const modalButtonDisabled = modalButtonAction ? !canStake : false
  if (contractWrite.status === 'pending') {
    modalTitle = 'Please check your wallet'
  } else if (contractWrite.status === 'success' && txReceipt.data) {
    modalTitle = 'Transaction successful'
    if (contractWrite.variables?.functionName == 'approve') {
      modalButtonText = 'Stake'
      modalButtonHref = undefined
      modalButtonAction = handleStake
    }
    // else depositAssets was called
    else {
      modalButtonText = 'Go to Dashboard'
      modalButtonHref = '/'
      modalButtonAction = undefined
    }
    modalStatus = 'success'
  } else if (contractWrite.error) {
    modalTitle = 'Transaction failed'
    modalStatus = 'error'
    modalDescription = contractWrite.error.message
  }

  return (
    <>
      <Modal
        status={modalStatus}
        description={modalDescription}
        txLink={
          contractWrite.data
            ? `${
                networks.find((network) => network.chain_id === chainId)
                  ?.explorer.url
              }/tx/${contractWrite.data}`
            : ''
        }
        title={modalTitle}
        buttonText={modalButtonText}
        buttonHref={modalButtonHref}
        isOpen={isTxModalOpened}
        setIsOpen={() => {
          setIsTxModalOpened(false)
          refetch()
          refetchEthBalanceData()
        }}
        modalButtonAction={modalButtonAction}
        modalButtonDisabled={modalButtonDisabled}
      />
      <TokenChooser
        isOpen={isTokenSelectModalOpened}
        onChange={(newAsset, newChain) => {
          setInputAmount('')
          setAsset(newAsset)
          setSelectedChain(newChain)
        }}
        setIsOpen={() => setIsTokenSelectModalOpened(false)}
        selectedChain={selectedChain}
        stake={false}
      />
      <div className="py-4 px-4 sm:py-6 sm:px-6 bg-[#00260d] border-2 border-[#0bff72]">
        <div className="flex flex-col">
          <div className="mt-2 flex flex-col gap-4 justify-between">
            <div className='flex flex-col'>              
              <label className="text-md font-medium text-white">Withdraw zgETH as</label>
              <div>
                {/* <span className='cursor-pointer' onMouseDown={() => setIsTokenSelectModalOpened(!isTokenSelectModalOpened)}> */}
                <button
                  className="w-full bg-[#001f0b] border border-[#45ff76] hover:bg-opacity-60 px-4 py-2 rounded-xl flex flex-row items-center justify-between"
                  type="button"
                  // onBlur={() => setIsTokenSelectModalOpened(false)}
                  onClick={() => setIsTokenSelectModalOpened(true)}
                >
                  <div className='flex flex-row items-center gap-2'>
                    <div className='relative'>
                      <img
                        src={activeAsset.src}
                        alt={asset}
                        className="w-[34px] h-[34px]"
                      />
                      <span className="flex items-center justify-center overflow-hidden border-background absolute bottom-0 right-0 rounded-full">
                        <img
                          src={activeAsset.chainlogo}
                          alt="Chain Logo"
                          className="h-4 size-full"
                        />
                      </span>
                    </div>
                    <span className='font-bold text-white'>{activeAsset.symbol}</span>
                  </div>
                  <svg fill="none" height="7" width="14" xmlns="http://www.w3.org/2000/svg">
                    <title>Dropdown</title>
                    <path d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001" stroke="#fff" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg"></path>
                  </svg>
                </button>
                {/* </span> */}
                {/* {isTokenSelectModalOpened && (
                  <ul 
                    className="w-[180px] focus:outline-none bg-gray-800 border border-gray-750 absolute z-50 mt-1 overflow-auto rounded-[12px] shadow"
                    aria-labelledby="headlessui-listbox-button-:r193:" aria-orientation="vertical"
                    id="headlessui-listbox-options-:r1c0:" role="listbox" tabIndex={0} data-headlessui-state="open"
                    aria-activedescendant="headlessui-listbox-option-:r1c1:"
                  >
                    {
                      assets.map((asset, id) => {
                        return (
                          <li className="cursor-pointer px-5 py-2" key={id} role="option" aria-selected="false" data-headlessui-state="" onMouseDown={() => closeDropdown(asset.symbol)} onMouseOver={(e) => {e.currentTarget.className += ' bg-gray-700'}} onMouseLeave={(e) => {e.currentTarget.className = 'cursor-pointer bg-opacity-100 px-5 py-2'}}>
                            <div className="flex items-center">
                              <img
                                src={asset.src}
                                alt={asset.symbol}
                                className="h-8"
                              />
                              <div className="ml-2 flex flex-col">
                                <p className="font-bold text-white">
                                  {asset.symbol}
                                </p>
                                <p className="text-xs text-white">{asset.name}</p>
                              </div>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                )} */}
              </div>
            </div>
            {!(activeAsset.symbol === 'ETH' || activeAsset.symbol === 'WETH') && <div className='flex flex-col'>
              <div className="flex flex-row justify-end text-sm font-medium text-white items-center">
                <span>Available:&nbsp;</span>
                <span className="text-xs">
                  <div>{`${formatEth(zgBalance)} zgETH`}</div>
                </span>
              </div>
              <div className="flex flex-col justify-center relative">
                <div className="flex flex-col justify-center ">
                  <input
                    placeholder="0"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.currentTarget.value)}
                    type="text"
                    className="bg-[#001f0b] border focus:ring-transparent focus:outline-0 focus:shadow-none focus:outline-none focus:border-[#45ff76] text-white h-12 border-[#45ff76] font-mono text-md font-medium text-left px-4 py-3 md:pr-5 rounded-lg md:rounded-xl"
                  />
                </div>
                <button
                  className="border border-[#45ff76] bg-[#00260d] hover:bg-opacity-80 text-style-sub text-[#6df791] absolute right-0 mr-2 md:mr-5 py-1.5 px-3 rounded-lg"
                  type="button"
                  onClick={() => {
                    if (zgBalance) {
                      setInputAmount(formatEther(BigInt(zgBalance)))
                    }
                  }}
                >
                  MAX
                </button>
              </div>
            </div>}
            {(activeAsset.symbol === 'ETH' || activeAsset.symbol === 'WETH') && <div className='flex flex-col'>
              <div className="flex flex-row justify-end text-sm font-medium text-white items-center">
                <span>Available:&nbsp;</span>
                <span className="text-xs">
                  <div>{`${formatEth(zgBalance)} zgETH`}</div>
                </span>
                <button className='ml-2 text-[#0bff72] font-bold hover:opacity-80' onClick={() => {
                  if (zgBalance) {
                    setInputAmount(formatEth(BigInt(Math.floor(zgBalance * assetPriceInZg / (32 * 10**36)) * 32 * 10**36 / assetPriceInZg)))
                  }
                }}>
                  Max
                </button>
              </div>
              <div className='flex flex-col gap-5 p-5 bg-[#001f0b] border border-[#0bff72] rounded-2xl'>
                <div className='flex items-center justify-center gap-5'>
                  <button 
                    className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#0bff72] h-8 w-8 shrink-0 rounded-full bg-[#00260d] hover:opacity-80'
                    onClick={() => {
                      setInputAmount(formatEth(BigInt(Number(parseEther(inputAmount)) - 32 * 10**36 / assetPriceInZg)))
                    }}
                    disabled={Math.round(Number(parseEther(inputAmount)) * assetPriceInZg / (32 * 10**36) * 10000) / 10000 === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus h-4 w-4"><path d="M5 12h14"></path></svg>
                    <span className="sr-only">Decrease</span>
                  </button>
                  <div className="w-48 flex flex-col items-center">
                    <input className="flex w-full rounded-md border border-input ring-offset-background file:border-0 file:bg-transparent text-white file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-auto p-0 text-5xl font-bold text-center border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none"
                        placeholder="validatorsToRedeem" pattern="\d{1,2}" maxLength={2} autoComplete="off" readOnly value={Math.round(Number(parseEther(inputAmount)) * assetPriceInZg / (32 * 10**36) * 10000) / 10000}
                        name="validatorsToRedeem" />
                    <div className="text-xs uppercase text-muted-foreground text-white">Validators</div>
                  </div>
                  <button 
                    className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#0bff72] h-8 w-8 shrink-0 rounded-full bg-[#00260d] hover:opacity-80'
                    onClick={() => {
                      setInputAmount(formatEth(BigInt(Number(parseEther(inputAmount)) + 32 * 10**36 / assetPriceInZg)))
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    <span className="sr-only">Inrease</span>
                  </button>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
      <div className="py-4 px-4 sm:py-6 sm:px-6 bg-[#00260d] border-2 border-[#0bff72] border-t-0 flex flex flex-col gap-4  rounded-b-2xl">
        <div className="flex justify-between items-center">
          <div className="text-white text-sm">You will receive:</div>
          <div className="text-white font-semibold text-sm">
            {Number(formatEther(BigInt(outputAmount))).toFixed(4)}
            &nbsp;{activeAsset.symbol}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-white text-sm">Exchange Rate:</div>
          <div className="text-white font-semibold text-sm">
            {`${Number(formatEther(BigInt(assetPriceInZg))).toFixed(4)} ${asset} = 1 zgETH`}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-white text-sm flex items-center gap-2">
            Referral Bonus
            <Tooltip className="p-2 text-sm text-gray-900">
              You were referred by {getReferrerId()}
            </Tooltip>
          </div>
          <div className="text-white font-semibold text-sm">10%</div>
        </div>
        {!isApproved && (
          <button
            className={`btn-glow bg-[#57ff85] text-white text-2xl font-semibold px-3 py-4 self-center w-full mt-2 px-6 py-3 md:py-4 rounded-2xl`}
            onClick={() => {
              if (isApproved) {
                return
              }
              if (chainId !== selectedChain) {
                switchChain({ chainId: selectedChain })
              }
              if (Number(amount) > assetAllowance) {
                contractWrite.writeContract({
                  abi: zgETHABI,
                  address: activeAsset.address,
                  functionName: 'approve',
                  args: [contracts.lrtDepositPool[chainId], amount],
                })
              }
            }}
          >
            {approveButtonText}
          </button>
        )}
        <button
          className={`${
            canStake ? 'hover:opacity-90' : 'opacity-60'
          } bg-[#57ff85] text-white text-2xl font-semibold px-3 py-4 self-center w-full mt-2 px-6 py-3 md:py-4 rounded-2xl btn-glow`}
          onClick={() => handleStake()}
        >
          {/* {stakeButtonText} */}
          Coming Soon
        </button>
      </div>
    </>
  )
}
