import pendle from '~/assets/pendle.png'
import zircuit from '~/assets/zircuit.svg'
import stEthSrc from '~/assets/stETH.svg'
import mEthSrc from '~/assets/mEth.png'
import sfrxEthSrc from '~/assets/sfrxEth.svg'
import oethSrc from '~/assets/oeth.png'
import curve from '~/assets/curve.webp'
import camelot from '~/assets/camelot.svg'
import sushiswap from '~/assets/sushiswap.svg'
import aerodrome from '~/assets/aerodrome.svg'
import velodrome from '~/assets/velodrome.svg'
import rethSrc from '~/assets/rETH.svg'
import ethSrc from '~/assets/ETH.svg'
import wethSrc from '~/assets/weth.png'
import modeSrc from '~/assets/network/mode.jpg'
import ethereumSrc from '~/assets/network/ETH.svg'
import arbitrumSrc from '~/assets/network/arbitrum.png'
import optimismSrc from '~/assets/network/optimism.png'
import baseSrc from '~/assets/network/base.png'
import fraxtalSrc from '~/assets/network/fraxtal.png'

export interface Tag {
  title: string
  color: string
  tooltip?: string
}

export interface Asset {
  symbol: string
  src: string
  name: string
  chain: number
  chainlogo: string
  address?: string
}

export interface Protocol {
  name: string
  link: string
  logo: string
  chain: string
  chainlogo: string
  assets: string
  tvl: string
  boost: string
}

export const assets = [
  // Testnets
  // {
  //   symbol: 'ETH',
  //   src: ethSrc,
  //   name: 'Ethereum',
  //   chain: 11155111,
  //   chainlogo: ethereumSrc,
  // },
  // {
  //   symbol: 'stETH',
  //   src: stEthSrc,
  //   name: 'Lido Staked ETH',
  //   chain: 11155111,
  //   chainlogo: ethereumSrc,
  //   address: '0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af'
  // },
  // {
  //   symbol: 'WETH',
  //   src: wethSrc,
  //   name: 'Wrapped ETH',
  //   chain: 11155111,
  //   chainlogo: ethereumSrc,
  //   address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
  // },
  // {
  //   symbol: 'ETH',
  //   src: ethSrc,
  //   name: 'Ethereum',
  //   chain: 11155420,
  //   chainlogo: optimismSrc,
  // },
  // {
  //   symbol: 'WETH',
  //   src: wethSrc,
  //   name: 'Wrapped Ethereum',
  //   chain: 11155420,
  //   chainlogo: optimismSrc,
  //   address: '0x4200000000000000000000000000000000000006'
  // },
  // Mainnet
  {
    symbol: 'ETH',
    src: ethSrc,
    name: 'Ethereum',
    chain: 1,
    chainlogo: ethereumSrc,
  },
  {
    symbol: 'stETH',
    src: stEthSrc,
    name: 'Lido Staked ETH',
    chain: 1,
    chainlogo: ethereumSrc,
    address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  },
  {
    symbol: 'mETH',
    src: mEthSrc,
    name: 'mETH',
    chain: 1,
    chainlogo: ethereumSrc,
    address: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
  },
  {
    symbol: 'sfrxETH',
    src: sfrxEthSrc,
    name: 'Staked Frax Ether',
    chain: 1,
    chainlogo: ethereumSrc,
    address: '0xac3E018457B222d93114458476f3E3416Abbe38F',
  },
  {
    symbol: 'OETH',
    src: oethSrc,
    name: 'Origin Ether',
    chain: 1,
    chainlogo: ethereumSrc,
    address: '0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3',
  },
  {
    symbol: 'ETH',
    src: ethSrc,
    name: 'Ethereum',
    chain: 10,
    chainlogo: optimismSrc,
  },
  {
    symbol: 'WETH',
    src: wethSrc,
    name: 'Wrapped Ethereum',
    chain: 10,
    chainlogo: optimismSrc,
    address: '0x4200000000000000000000000000000000000006',
  },
  {
    symbol: 'ETH',
    src: ethSrc,
    name: 'Ethereum',
    chain: 42161,
    chainlogo: arbitrumSrc,
  },
  {
    symbol: 'WETH',
    src: wethSrc,
    name: 'Wrapped Ethereum',
    chain: 42161,
    chainlogo: arbitrumSrc,
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  {
    symbol: 'ETH',
    src: ethSrc,
    name: 'Ethereum',
    chain: 8453,
    chainlogo: baseSrc,
  },
  {
    symbol: 'WETH',
    src: wethSrc,
    name: 'Wrapped Ethereum',
    chain: 8453,
    chainlogo: baseSrc,
    address: '0x4200000000000000000000000000000000000006',
  },
  {
    symbol: 'frxETH',
    src: ethSrc,
    name: 'Frax Ether',
    chain: 252,
    chainlogo: fraxtalSrc,
  },
  {
    symbol: 'ETH',
    src: ethSrc,
    name: 'Ethereum',
    chain: 34443,
    chainlogo: modeSrc,
  },
  {
    symbol: 'WETH',
    src: wethSrc,
    name: 'Wrapped Ethereum',
    chain: 34443,
    chainlogo: modeSrc,
    address: '0x4200000000000000000000000000000000000006',
  },
] as Asset[]

export const protocols = [
  {
    name: 'Pendle (Coming Soon)',
    link: '#',
    logo: pendle,
    chain: 'Ethereum',
    chainlogo: ethereumSrc,
    assets: 'zgETH',
    tvl: '$ -.-',
    boost: '2x',
  },
  {
    name: 'Zircuit (Coming Soon)',
    link: '#',
    logo: zircuit,
    chain: 'Ethereum',
    chainlogo: ethereumSrc,
    assets: 'zgETH',
    tvl: '$ -.-',
    boost: '1x',
  },
  {
    name: 'Curve (Coming Soon)',
    link: '#',
    logo: curve,
    chain: 'Ethereum',
    chainlogo: ethereumSrc,
    assets: 'zgETH / WETH',
    tvl: '$ -.-',
    boost: '3x',
  },
  {
    name: 'Camelot (Coming Soon)',
    link: '#',
    logo: camelot,
    chain: 'Arbitrum',
    chainlogo: arbitrumSrc,
    assets: 'zgETH / WETH',
    tvl: '$ -.-',
    boost: '2x',
  },
  {
    name: 'Aerodrome (Coming Soon)',
    link: '#',
    logo: aerodrome,
    chain: 'Base',
    chainlogo: baseSrc,
    assets: 'zgETH / WETH',
    tvl: '$ -.-',
    boost: '3x',
  },
  {
    name: 'Velodrome (Coming Soon)',
    link: '#',
    logo: velodrome,
    chain: 'Optimism',
    chainlogo: optimismSrc,
    assets: 'zgETH / WETH',
    tvl: '$ -.-',
    boost: '3x',
  },
  {
    name: 'SushiSwap (Coming Soon)',
    link: '#',
    logo: sushiswap,
    chain: 'Ethereum',
    chainlogo: ethereumSrc,
    assets: 'zgETH / WETH',
    tvl: '$ -.-',
    boost: '3x',
  },
  {
    name: 'SushiSwap (Coming Soon)',
    link: '#',
    logo: sushiswap,
    chain: 'Arbitrum',
    chainlogo: arbitrumSrc,
    assets: 'zgETH / WETH',
    tvl: '$ -.-',
    boost: '3x',
  },
] as Protocol[]

// Ensure there is a contract address for each asset above
export const contracts = {
  zgETH: {
    // Testnet
    // 11155111: '0xA37382c02678290816d9D9e9A2e8eEC0985e1033',
    // 11155420: '0xa13fcA83aE6B995726F6D2cFC314675A081AC5C0'
    // Mainnet
    1: '0x17fdeB2fbB8089fea8a7BDb847E49ce67cF863df',
    10: '0x4B9D5F4e95f6Fe93B4607BFdB43CB6b32cE47aa0',
    42161: '0xA5E5A6724E99EaBd4CA236633AAb882B7658F287',
    8453: '0x4B9D5F4e95f6Fe93B4607BFdB43CB6b32cE47aa0',
    252: '0x6512B048d97D17FFdc70411983Befc4680F5E1B1',
    34443: '0xdbb048feF89375caC8f04a1536269Ffc7C22Af2C',
  },
  oftZgEth: {
    252: '0xF1fDe339814BaED9D7edb793d114eAbb214E6d8F',
  },
  lockbox: '0x742B5Cb1a6a10E568a79D70EF77b542663ED3e1a',
  xzgETH: '0x0e2504dB1ffb0C3f692128f3919CbCAa11c10e8f',
  lrtOracle: '0xAa6Fd6788fCA604AcFD3FE7e160Fbfcf4F0ef95C',
  lrtDepositPool: {
    // Testnet
    // 11155111: '0x54F461d0db815919fB50dd3044aE642d6f83bBC6',
    // 11155420: '0x6e156039F84a976ff1e02aDa32f55F13a6d06fEc'
    // Mainnet
    1: '0xBcE1eD62786703fc974774A43dFCfeB609AD3329',
    10: '0x052c3De4979154C687eAc3865c6A7cC784328EfE',
    42161: '0xae69f9AC9aC9302E2F97B313CaF1fB45a9bB18A6',
    8453: '0x052c3De4979154C687eAc3865c6A7cC784328EfE',
    252: '0x737Fa0898d3edE4f5920E041aF46F595DE617985',
    34443: '0xa44A68DA86603e041008f05d2B6b8BEDC5039c78',
  },
  lrtConfig: '0x347b65b75Ae5aB97D86032D353aa805c1625fddE',
} as const

export const lrtOraclePriceMethod = 'zgETHPrice'

export const hubChainId = 1

export const depositsEndDate = new Date()
depositsEndDate.setUTCFullYear(2024, 4, 9)
depositsEndDate.setUTCHours(19, 55, 0, 0)

export const CHAINS = {
  1: 'ethereum',
  42161: 'arbitrum',
  8453: 'base',
  10: 'optimism',
  252: 'fraxtal',
  34443: 'mode',
}
