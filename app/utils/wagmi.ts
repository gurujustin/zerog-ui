import { http } from 'wagmi'
import { mainnet, sepolia, arbitrumSepolia, optimism, arbitrum, base, optimismSepolia, baseSepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// export const config = createConfig({
//   chains: [mainnet],
//   transports: {
//     [mainnet.id]: http()
//   }
// })

export const config = getDefaultConfig({
  appName: 'Zerog Finance',
  projectId: 'b6187205b37dc9d704772f16dca5b71e',
  chains: [
    mainnet,
    // optimism,
    // arbitrum,
    // base,
    sepolia,
    optimismSepolia,
    // arbitrumSepolia,
    // baseSepolia
  ],

  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/EP6A_NXNsgvvMTKyz2DWegRdJTliwLT_'),
    // [optimism.id]: http('https://optimism-rpc.publicnode.com'),
    // [arbitrum.id]: http('https://endpoints.omniatech.io/v1/arbitrum/one/public'),
    // [base.id]: http('https://endpoints.omniatech.io/v1/base/mainnet/public'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [optimismSepolia.id]: http('https://optimism-sepolia.blockpi.network/v1/rpc/public'),
    // [arbitrumSepolia.id]: http('https://arbitrum-sepolia.blockpi.network/v1/rpc/public'),
    // [baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com')
  },
  ssr: true,
})
