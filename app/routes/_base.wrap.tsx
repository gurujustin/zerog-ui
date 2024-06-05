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
import bg from '~/assets/background3.jpg'
import RestakeIcon from '~/assets/Restake.svg'
import DefiIcon from '~/assets/defi.svg'
import PortfolioIcon from '~/assets/portfolio.svg'
import { DropdownContent } from '~/components/DropdownContent'
import { Link } from '@remix-run/react'

import { TopNav } from '~/components/nav/TopNav'

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
      <label className="text-lg font-medium text-[#7ffda0]">{id}</label>
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
            className="bg-[#001f0b] border focus:ring-transparent focus:outline-0 focus:shadow-none focus:outline-none focus:border-[#45ff76] h-20  border-[#0bff72] font-mono text-2xl font-medium text-left px-4 py-3 md:pr-5 rounded-lg md:rounded-xl text-white"
          />
        </div>
        <div className="flex flex-col text-right absolute right-0 mr-2 md:mr-5 gap-1">
          <div className="flex items-center gap-2">
            <img src={Logo} className="h-6 w-6 size-full" />
            <span className="text-lg font-medium text-[#7ffda0]">{symbol}</span>
          </div>
          <span className="text-xs font-medium text-[#7ffda0]">
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
  const [loading, setLoading] = useState(true);

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
    const img = new Image();
    img.src = bg;
    img.onload = () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (independentField == 'INPUT') {
      setOutputAmount(inputValue)
    } else {
      setInputAmount(outputValue)
    }
  }, [independentField, inputValue, outputValue])

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
              <div className="flex flex-col max-w-screen-sm rounded-2xl mx-auto px-4 sm:px-8 pt-12 pb-16 bg-[#00260d] border-2 border-[#0bff72]">
                {/* Header */}
                <div className="flex justify-between">
                  <h1 className="text-4xl font-bold text-[#48ff7b]">
                    {inputCurrency == contracts.oftZgEth[fraxtalChainId]
                      ? 'Wrap'
                      : 'Unwrap'}
                  </h1>
                  <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300 h-[18px]">
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
                      className="bg-[#001f0b] border border-[#45ff76] hover:opacity-90"
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
                      className="btn-glow w-full outline-0 bg-[#57ff85] text-white text-2xl font-semibold font-heading px-6 py-4 rounded-2xl whitespace-nowrap"
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </button>
                  ) : chainId != fraxtalChainId ? (
                    <button
                      className="btn-glow w-full outline-0 bg-[#57ff85] text-white text-2xl font-semibold font-heading px-6 py-4 rounded-2xl whitespace-nowrap"
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
                      className="btn-glow w-full outline-0 bg-[#57ff85] text-white text-2xl font-semibold font-heading px-6 py-4 rounded-2xl whitespace-nowrap"
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      disabled={status == 'pending'}
                      className="btn-glow w-full outline-0 bg-[#57ff85] text-white text-2xl font-semibold font-heading px-6 py-4 rounded-2xl whitespace-nowrap"
                      onClick={handleBridge}
                    >
                      {inputCurrency == contracts.oftZgEth[fraxtalChainId]
                        ? 'Wrap'
                        : 'Unwrap'}
                    </button>
                  )}
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
