import { useEffect, useMemo, useState } from 'react'
import { Address, erc20Abi, getAddress, parseEther } from 'viem'
import {
  useAccount,
  useBalance,
  useContractRead,
  useReadContracts,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'
import { contracts } from '~/utils/constants'
import Logo from '~/assets/zgeth.png'
import WrapIcon from '~/assets/wrap.svg'
import { ZgETHTokenWrapperAbi } from '~/utils/abis'
import { switchNetwork } from 'wagmi/actions'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { title: 'Zero-G | Wrap' },
    { name: 'description', content: 'Welcome to Zero-G!' },
  ]
}

const fraxtalChainId = 252

function CurrencyInput({
  currency,
  value,
  onUserInput,
  chainId,
  id,
}: {
  currency: string
  value: string
  onUserInput: (input: string) => void
  chainId: number
  id: string
}) {
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: getAddress(currency),
    chainId: chainId,
  })
  const symbol =
    currency === contracts.zgETH[fraxtalChainId] ? 'wzgETH' : 'zgETH'

  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-medium text-gray-400">{id}</label>
      <div className="flex flex-col justify-center relative">
        <div className="flex flex-col justify-center">
          <input
            value={value}
            placeholder="0.0"
            onChange={(e) => onUserInput(e.currentTarget.value)}
            inputMode="decimal"
            pattern="^\d*(\.\d*)?$"
            spellCheck="false"
            type="number"
            className="border focus:ring-transparent focus:outline-0 focus:shadow-none focus:outline-none focus:border-primary text-[#bdbfc7] h-20 bg-gray-800 border-gray-750 font-mono text-2xl font-medium text-left px-4 py-3 md:pr-5 rounded-lg md:rounded-xl"
          />
        </div>
        <div className="flex flex-col text-right absolute right-0 mr-2 md:mr-5 gap-1">
          <div className="flex items-center gap-2">
            <img src={Logo} className="h-6 w-6 size-full" />
            <span className="text-lg font-medium text-gray-400">{symbol}</span>
          </div>
          <span className="text-xs font-medium text-gray-400">
            Balance: {Number(data?.formatted || 0).toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Index() {
  const { address, chainId, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const [inputCurrency, setInputCurrency] = useState<string>(
    contracts.zgETH[fraxtalChainId],
  )
  const [outputCurrency, setOutputCurrency] = useState<string>(
    contracts.oftZgEth[fraxtalChainId],
  )
  const [typedValue, setTypedValue] = useState('')
  const [independentField, setIndependentField] = useState('INPUT')
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const isTypingInput = independentField === 'INPUT'
  const inputValue = useMemo(
    () => typedValue && (isTypingInput ? typedValue : inputAmount || ''),
    [typedValue, isTypingInput, inputAmount],
  )
  const outputValue = useMemo(
    () => typedValue && (isTypingInput ? outputAmount || '' : typedValue),
    [typedValue, isTypingInput, outputAmount],
  )
  const {
    data: allowance,
    refetch,
    isRefetching,
  } = useContractRead({
    address: contracts.oftZgEth[fraxtalChainId],
    chainId: fraxtalChainId,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as Address, contracts.zgETH[fraxtalChainId]],
  })
  const { writeContract, status } = useWriteContract()

  const handleType = (field: string, value: string) => {
    setIndependentField(field)
    setTypedValue(value)
    console.log(field, value)
  }

  const handleSwitchCurrency = () => {
    setInputCurrency(outputCurrency)
    setOutputCurrency(inputCurrency)
    setIndependentField(independentField == 'INPUT' ? 'OUTPUT' : 'INPUT')
  }

  const handleApprove = () => {
    writeContract({
      abi: erc20Abi,
      address: contracts.oftZgEth[fraxtalChainId],
      chainId: fraxtalChainId,
      functionName: 'approve',
      args: [contracts.zgETH[fraxtalChainId], parseEther(inputValue)],
    })
  }

  const handleBridge = () => {
    console.log(
      'bridge',
      inputCurrency == contracts.zgETH[fraxtalChainId] ? 'deposit' : 'withdraw',
      parseEther(inputValue),
    )
    writeContract({
      abi: ZgETHTokenWrapperAbi,
      address: contracts.zgETH[fraxtalChainId],
      functionName:
        inputCurrency == contracts.zgETH[fraxtalChainId]
          ? 'withdraw'
          : 'deposit',
      args: [contracts.oftZgEth[fraxtalChainId], parseEther(inputValue)],
    })
  }

  useEffect(() => {
    if (independentField == 'INPUT') {
      setOutputAmount(inputValue)
    } else {
      setInputAmount(outputValue)
    }
  }, [independentField, inputValue, outputValue])

  return (
    <div className="flex flex-col max-w-screen-sm rounded-lg mx-auto px-4 sm:px-8 pt-12 pb-16 bg-gray-500 bg-opacity-10">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(120deg,_#ffffff_-0.35%,_#37e29a_50%)]">
          {inputCurrency == contracts.oftZgEth[fraxtalChainId]
            ? 'Wrap'
            : 'Unwrap'}
        </h1>
        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 h-[22px]">
          1 wzgETH = 1 zgETH
        </span>
      </div>
      <div className="flex flex-col gap-8 mt-8">
        <CurrencyInput
          id="From"
          chainId={fraxtalChainId}
          currency={inputCurrency}
          onUserInput={(value) => handleType('INPUT', value)}
          value={inputValue}
        />
        <div className="flex items-center justify-center">
          <div
            className="bg-gray-800"
            style={{
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transform: 'rotate(180deg) translateZ(0px)',
            }}
            onClick={() => handleSwitchCurrency()}
          >
            <img
              alt="swap"
              loading="eager"
              width="24"
              height="24"
              decoding="async"
              data-nimg="1"
              src={WrapIcon}
              style={{ color: 'transparent', rotate: '90deg' }}
            />
          </div>
        </div>
        <CurrencyInput
          id="To"
          chainId={fraxtalChainId}
          currency={outputCurrency}
          onUserInput={(value) => handleType('OUTPUT', value)}
          value={outputValue}
        />

        {!isConnected ? (
          <button
            className="w-full outline-0 hover:opacity-90 bg-[#83FFD9] text-[#050707] font-bold font-heading px-4 py-3 rounded-2xl whitespace-nowrap"
            onClick={openConnectModal}
          >
            Connect Wallet
          </button>
        ) : chainId != fraxtalChainId ? (
          <button
            className="w-full outline-0 hover:opacity-90 bg-[#83FFD9] text-[#050707] font-bold font-heading px-4 py-3 rounded-2xl whitespace-nowrap"
            onClick={() => {
              switchChain({ chainId: fraxtalChainId })
            }}
          >
            Switch to Fraxtal network
          </button>
        ) : (allowance || 0n) < parseEther(inputValue) &&
          inputCurrency == contracts.oftZgEth[fraxtalChainId] ? (
          <button
            disabled={status == 'pending'}
            className="w-full outline-0 hover:opacity-90 bg-[#83FFD9] text-[#050707] font-bold font-heading px-4 py-3 rounded-2xl whitespace-nowrap"
            onClick={handleApprove}
          >
            Approve
          </button>
        ) : (
          <button
            disabled={status == 'pending'}
            className="w-full outline-0 hover:opacity-90 bg-[#83FFD9] text-[#050707] font-bold font-heading px-4 py-3 rounded-2xl whitespace-nowrap"
            onClick={handleBridge}
          >
            {inputCurrency == contracts.oftZgEth[fraxtalChainId]
              ? 'Wrap'
              : 'Unwrap'}
          </button>
        )}
      </div>
    </div>
  )
}
