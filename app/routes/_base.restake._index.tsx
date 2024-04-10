import { useState, useEffect } from 'react'
import { useTime } from 'react-time-sync'
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWalletClient,
  useBalance,
  useChainId,
  useSwitchChain
} from 'wagmi'
import { parseEther, parseAbi, formatEther } from 'viem'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { bigintToFloat, formatEth } from '~/utils/bigint'
import {
  contracts,
  assets,
  lrtOraclePriceMethod,
  Asset,
  hubChainId
} from '~/utils/constants'
import { networks } from '~/utils/networks'
import { CaretDown } from '~/components/Icons'
import { Modal } from '~/components/Modal'
import { TokenChooser } from '~/components/TokenChooser'
import { Tags } from '~/components/Tags'
import { getReferrerId } from '~/utils/useReferrerTracker'

import metamask from '~/assets/metamask.svg'
import tokenImage from '~/assets/logo-mobile.png'

import {
  lrtOracleAbi,
  zgETHABI,
  lrtDepositPoolAbi,
  lrtConfigAbi,
  xZerogDepositAbi
} from '~/utils/abis'
import { Tooltip } from '~/components/Tooltip'

export default function Index() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const { openConnectModal } = useConnectModal()
  const [isOpen, setIsOpen] = useState(false)
  const [tokenChooserIsOpen, setTokenChooserIsOpen] = useState(false)
  const [selectedChain, setSelectedChain] = useState(hubChainId) // mainnet 1
  /* stores token + connected address approvals issued this session.
   * Required for showing a disabled approval button after the approve
   * transaction is done.
   */
  const [approves, setApproves] = useState([])
  const contractWrite = useWriteContract()
  const walletClient = useWalletClient()
  const { isConnected, address } = useAccount()

  const [asset, setAsset] = useState<keyof typeof contracts>(assets[0].symbol)
  const activeAsset = assets.find((a) => (a.symbol === asset && a.chain === selectedChain)) as Asset
  const [depositAmount, setDepositAmount] = useState('')
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
        chainId: hubChainId
      },
      {
        abi: zgETHABI,
        address: contracts.zgETH[chainId],
        functionName: 'balanceOf',
        args: [connectedAddress],
      },
      {
        abi: lrtOracleAbi,
        address: contracts.lrtOracle,
        functionName: 'getAssetPrice',
        args: [activeAsset.address ? activeAsset.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'],
        chainId: hubChainId
      },
      {
        abi: zgETHABI,
        address: activeAsset.address ? activeAsset.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        functionName: 'allowance',
        args: [connectedAddress, contracts.lrtDepositPool[selectedChain]],
        chainId: selectedChain
      },
      {
        abi: zgETHABI,
        address: activeAsset.address ? activeAsset.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        functionName: 'balanceOf',
        args: [connectedAddress],
        chainId: selectedChain
      },
    ],
  })

  const { data: data1, refetch: refetch1 } = useBalance({
    address: connectedAddress,
    chainId: selectedChain
  })

  const txReceipt = useWaitForTransactionReceipt({ hash: contractWrite.data })

  /* refetch data on any transaction succeeding. Important to refresh data
   * and to enable Stake button (Modal or in-page) after approve succeeds.
   */
  useEffect(() => {
    if (contractWrite.status === 'success' && txReceipt.data) {
      refetch()
      refetch1()
      /* It can happen that a wallet provider (say Metamask) will already
       * see a transaction processed and approval updated on a contract
       * while another provider (e.g. Infura) will still not have seen the
       * latest data. As a workaround to 2 more re-fetches 3 & 10 seconds later.
       */

      setTimeout(refetch, 3000)
      setTimeout(refetch, 10000)

      setTimeout(refetch1, 3000)
      setTimeout(refetch1, 10000)
    }
  }, [contractWrite.status, txReceipt.data, refetch, refetch1])

  useEffect(() => {
    if (contractWrite.status === 'pending') {
      setIsOpen(true)
    }
  }, [contractWrite.status, txReceipt.data, refetch, refetch1])

  let rsETHPrice = 0n
  let lrtBalance = 0n
  let rawAssetPrice = 0n
  let assetAllowance = 0n
  let assetBalance = 0n
  let assetPrice = 0n
  let depositAmountBI = 0n
  let youWillGet = 0n

  if (data && data1) {
    try {
      rsETHPrice = data[0]?.result || 10n ** 18n
      // if contract not connected balance is 0
      lrtBalance = data[1].result
      rawAssetPrice = data[2].result || 10n ** 18n
      assetAllowance = isConnected ? data[3].result : 0n
      assetBalance = isConnected ? asset === "ETH" ? data1.value : data[4].result : 0n
      assetPrice = (10n ** 18n * rsETHPrice) / rawAssetPrice
    } catch (e) {
      /* Ignore */
    }
    try {
      // remove commas from input
      depositAmountBI = parseEther(depositAmount.replaceAll(',', ''))
      youWillGet = (rawAssetPrice * depositAmountBI) / rsETHPrice
    } catch (e) {
      console.log(e)
      /* Ignore */
    }
  }

  const assetApprovedThisSession = approves.includes(`${address}:${asset}`)

  let stakeBtnDisabled = false
  let approveBtnDisabled = true
  let stakeBtnText = 'Stake'
  let approveBtnText = `${asset} approved`
  // show approve button if we can stake and asset has been approved this session
  let approveBtnShow = assetApprovedThisSession
  if (asset === 'stETH' || asset === 'rETH') {
    stakeBtnText = 'Deposits are currently closed'
    stakeBtnDisabled = true
    approveBtnShow = false
  } else if (!isConnected) {
    stakeBtnText = 'Connect wallet'
    approveBtnShow = false
  } else if (!depositAmountBI || depositAmountBI <= 0n) {
    stakeBtnText = 'Enter an amount'
    stakeBtnDisabled = true
    approveBtnShow = false
  } else if (depositAmountBI > assetBalance) {
    stakeBtnText = 'Not enough balance'
    stakeBtnDisabled = true
    approveBtnShow = false
  } else if (chainId !== selectedChain) {
    stakeBtnText = `Switch Network`
    stakeBtnDisabled = false
    approveBtnShow = false
  } else if (depositAmountBI > assetAllowance) {
    stakeBtnText = `Stake`
    approveBtnText = `Approve ${asset}`
    stakeBtnDisabled = true
    approveBtnDisabled = false
    approveBtnShow = true
  }

  const doStake = () => {
    if (stakeBtnDisabled) {
      return
    }
    if (!isConnected) {
      openConnectModal?.()
    } else if (chainId !== selectedChain) {
      switchChain({ chainId: selectedChain })
    } else if (asset === 'ETH') {
      // reset stake form
      setDepositAmount('')
      if (chainId === hubChainId) {
        contractWrite.writeContract({
          abi: lrtDepositPoolAbi,
          address: contracts.lrtDepositPool[chainId],
          functionName: 'depositETH',
          args: [
            0n,
            getReferrerId()
          ],
          value: parseEther(depositAmount)
        })
      } else {
        const now = new Date()
        const deadline = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))
        contractWrite.writeContract({
          abi: xZerogDepositAbi,
          address: contracts.lrtDepositPool[chainId],
          functionName: 'depositETH',
          args: [
            0n,
            Math.floor(deadline.getTime() / 1000),
            getReferrerId()
          ],
          value: parseEther(depositAmount)
        })
      }
    } else if (depositAmountBI <= assetAllowance) {
      // reset stake form
      const now = new Date()
      const deadline = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))
      contractWrite.writeContract({
        abi: xZerogDepositAbi,
        address: contracts.lrtDepositPool[chainId],
        functionName: 'deposit',
        args: [
          parseEther(depositAmount),
          0n,
          Math.floor(deadline.getTime() / 1000),
          getReferrerId(),
        ],
      })
    }
  }

  let modalTitle = 'Transaction in process'
  let modalStatus = 'loading'
  let modalDescription
  let modalButtonText
  let modalButtonHref
  let modalButtonAction
  // button not disabled except if action is stake and stake is disabled
  const modalButtonDisabled = modalButtonAction ? stakeBtnDisabled : false
  if (contractWrite.status === 'pending') {
    modalTitle = 'Please check your wallet'
  } else if (contractWrite.status === 'success' && txReceipt.data) {
    modalTitle = 'Transaction successful'
    if (contractWrite.variables.functionName == 'approve') {
      modalButtonText = 'Stake'
      modalButtonHref = null
      modalButtonAction = doStake
    }
    // else depositAssets was called
    else {
      modalButtonText = 'View Dashboard'
      modalButtonHref = '/defi'
      modalButtonAction = null
    }
    modalStatus = 'success'
  } else if (contractWrite.error) {
    modalTitle = 'Transaction failed'
    modalStatus = 'error'

    modalDescription =
      contractWrite.error.shortMessage || contractWrite.error.message
  }

  const closeDropdown = (newAsset: string) => {
    setDepositAmount('')
    setAsset(newAsset)
  }

  return (
    <>
      <Modal
        status={modalStatus}
        description={modalDescription}
        txLink={
          contractWrite.data
            ? `${networks.find(network => network.chain_id === chainId)?.explorer.url}/tx/${contractWrite.data}`
            : ''
        }
        title={modalTitle}
        buttonText={modalButtonText}
        buttonHref={modalButtonHref}
        isOpen={isOpen}
        setIsOpen={() => {
          setIsOpen(false)
          refetch()
          refetch1()
        }}
        modalButtonAction={modalButtonAction}
        modalButtonDisabled={modalButtonDisabled}
      />
      <TokenChooser
        isOpen={tokenChooserIsOpen}
        onChange={(newAsset, newChain) => {
          setDepositAmount('')
          setAsset(newAsset)
          setSelectedChain(newChain)
        }}
        setIsOpen={() => setTokenChooserIsOpen(false)}
        selectedChain={selectedChain}
      />
      <div className="py-4 px-4 sm:py-6 sm:px-6 bg-gray-500 bg-opacity-10">
        <div className='flex flex-col'>
          <div className="flex flex-row justify-between items-baseline">
            <label className="text-md font-medium text-gray-400">Asset</label>
            <div className="flex flex-row text-sm font-medium text-gray-400 items-center">
              <span>Available:&nbsp;</span>
              <span className="text-xs">
                <div>{`${formatEth(assetBalance)} ${asset}`}</div>
              </span>
            </div>
          </div>
          <div className='mt-2 flex flex-row gap-4 justify-between'>
            <div className='relative'>
              {/* <span className='cursor-pointer' onMouseDown={() => setTokenChooserIsOpen(!tokenChooserIsOpen)}> */}
                <button
                  className="bg-gray-800 border border-gray-750 hover:bg-opacity-60 px-4 py-2 rounded-xl flex items-center"
                  type='button'
                  // onBlur={() => setTokenChooserIsOpen(false)}
                  onClick={() => setTokenChooserIsOpen(true)}
                >
                  <img
                    src={activeAsset.src}
                    alt={asset}
                    className="w-[34px] h-[34px]"
                  />
                  <span className='flex items-center justify-center overflow-hidden border-background absolute bottom-1 right-3 rounded-full'>
                    <img
                      src={activeAsset.chainlogo}
                      alt='Chain Logo'
                      className="h-4 size-full"
                    />
                  </span>
                </button>
              {/* </span> */}
              {/* {tokenChooserIsOpen && (
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
            <div className="w-9/12 flex flex-col justify-center relative">
              <div className="flex flex-col justify-center ">
                <input 
                  placeholder='0'
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.currentTarget.value)}
                  type="text" 
                  className="border focus:ring-transparent focus:outline-0 focus:shadow-none focus:outline-none focus:border-primary text-[#bdbfc7] h-12 bg-gray-800 border-gray-750 font-mono text-md font-medium text-left px-4 py-3 md:pr-5 rounded-lg md:rounded-xl" 
                />
              </div>
              <button 
                className="bg-opacity-60 bg-gray-400 hover:bg-opacity-80 text-style-sub absolute right-0 mr-2 md:mr-5 py-1.5 px-3 rounded-lg" 
                type="button"
                onClick={() => {
                  if (assetBalance) {
                    setDepositAmount(formatEther(assetBalance))
                  }
                }}
              >
                MAX
              </button>
            </div>
          </div>
          <div className="flex justify-end items-center text-sm text-gray-400 mt-2">
            {`Your zgETH: ${formatEth(lrtBalance)}`}
            <button
              className="rounded-xl border border-gray-border text-xs p-2 ml-3 hover:bg-gray-800 hover:border-gray-500 hover:text-white"
              onClick={() => {
                walletClient?.data?.watchAsset({
                  type: 'ERC20',
                  options: {
                    address: contracts.zgETH[chainId],
                    decimals: 18,
                    symbol: 'zgETH',
                    image: tokenImage
                  },
                })
              }}
            >
              <img className="w-5 h-5" aria-hidden="true" src={metamask} />
            </button>
          </div>
        </div>
      </div>
      <div className="py-4 px-4 sm:py-6 sm:px-6 bg-gray-500 bg-opacity-10 flex flex-col gap-4  rounded-b-2xl">
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">You will receive:</div>
          <div className="text-gray-400 font-semibold text-sm">
            {formatEth(youWillGet || '0')}
            &nbsp;zgETH
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm">Exchange Rate:</div>
          <div className="text-gray-400 font-semibold text-sm">
            {`${formatEth(assetPrice)} ${asset} = 1 zgETH`}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-400 text-sm flex items-center gap-2">
            Referral Bonus
            <Tooltip className="p-2 text-sm text-gray-900">
              You were referred by {getReferrerId()}
            </Tooltip>
          </div>
          <div className="text-gray-400 font-semibold text-sm">10%</div>
        </div>
        {approveBtnShow && (
          <button
            className={`${approveBtnDisabled ? 'opacity-60' : 'hover:opacity-90 '
              } bg-[#83FFD9] text-[#050707] text-md font-semibold px-3 py-4 self-center w-full mt-2 px-6 py-3 md:py-4 rounded-2xl`}
            onClick={() => {
              if (approveBtnDisabled) {
                return
              }
              if (chainId !== selectedChain) {
                switchChain({ chainId: selectedChain })
              }
              if (depositAmountBI > assetAllowance) {
                contractWrite.writeContract({
                  abi: zgETHABI,
                  address: activeAsset.address,
                  functionName: 'approve',
                  args: [contracts.lrtDepositPool[chainId], depositAmountBI],
                })
                setApproves([...approves, `${address}:${asset}`])
              }
            }}
          >
            {approveBtnText}
          </button>
        )}
        <button
          className={`${stakeBtnDisabled ? 'opacity-60' : 'hover:opacity-90 '
            } bg-[#83FFD9] text-[#050707] text-md font-semibold px-3 py-4 self-center w-full mt-2 px-6 py-3 md:py-4 rounded-2xl`}
          onClick={() => doStake()}
        >
          {stakeBtnText}
        </button>
      </div>
    </>
  )
}
