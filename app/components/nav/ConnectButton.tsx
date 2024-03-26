import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { ProfileIcon } from '~/components/Icons'
import { truncateAddress } from '~/utils/string'

export const ConnectButton = () => {
  const { isConnected, address, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  return (
    <>
      {isConnected ? (
        <button
          className="w-fit outline-0 hover:opacity-90 bg-[#20232c] text-white px-4 py-3 rounded-2xl whitespace-nowrap"
          onClick={openAccountModal}
        >
          <div className='flex flex-row items-center'>
            {truncateAddress(address)}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
      ) : (
        <button className="w-fit outline-0 hover:opacity-90 bg-[#83FFD9] text-[#050707] font-bold font-heading px-4 py-3 rounded-2xl whitespace-nowrap" onClick={openConnectModal}>
          Connect Wallet
        </button>
      )}
    </>
  )
}
