import { http } from 'wagmi'
import {
  mainnet,
  sepolia,
  arbitrumSepolia,
  optimism,
  arbitrum,
  base,
  linea,
  scroll,
  mantle,
  optimismSepolia,
  baseSepolia,
  holesky,
} from 'wagmi/chains'
import { Chain, connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  okxWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

// export const config = createConfig({
//   chains: [mainnet],
//   transports: {
//     [mainnet.id]: http()
//   }
// })

const fraxtal = {
  id: 252,
  name: 'Fraxtal',
  iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_fraxtal?w=48&h=48',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Frax Ether', symbol: 'frxETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.frax.com'] },
  },
  blockExplorers: {
    default: { name: 'Fraxscan', url: 'https://fraxscan.com' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 2_358_171,
    },
  },
} as const satisfies Chain;

const mode = {
  id: 34443,
  name: 'Mode',
  iconUrl: 'https://explorer.mode.network/assets/network_logo.jpg',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.mode.network'] },
  },
  blockExplorers: {
    default: { name: 'Mode Explorer', url: 'https://explorer.mode.network' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 2_465_882,
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'Zero-G Finance',
  projectId: 'b6187205b37dc9d704772f16dca5b71e',
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, walletConnectWallet, okxWallet],
    },
  ],
  chains: [
    mainnet,
    optimism,
    arbitrum,
    base,
    fraxtal,
    mode,
    holesky,
    // mantle,
    // scroll,
    // linea
    // sepolia,
    // optimismSepolia,
    // arbitrumSepolia,
    // baseSepolia
  ],

  transports: {
    [mainnet.id]: http('https://eth-mainnet.public.blastapi.io'),
    [optimism.id]: http('https://optimism-rpc.publicnode.com'),
    [arbitrum.id]: http(
      'https://endpoints.omniatech.io/v1/arbitrum/one/public',
    ),
    [base.id]: http('https://endpoints.omniatech.io/v1/base/mainnet/public'),
    [fraxtal.id]: http('https://rpc.frax.com'),
    [mode.id]: http('https://mainnet.mode.network'),
    [holesky.id]: http('https://rpc.holesky.ethpandaops.io'),
    // [mantle.id]: http('https://rpc.mantle.xyz'),
    // [scroll.id]: http('https://scroll-mainnet.chainstacklabs.com'),
    // [linea.id]: http('https://linea.blockpi.network/v1/rpc/public'),
    // [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    // [optimismSepolia.id]: http('https://optimism-sepolia.blockpi.network/v1/rpc/public'),
    // [arbitrumSepolia.id]: http('https://arbitrum-sepolia.blockpi.network/v1/rpc/public'),
    // [baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com')
  },
  ssr: true,
})
