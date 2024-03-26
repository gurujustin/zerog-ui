import pendle from '~/assets/pendle.png'
import zircuit from '~/assets/zircuit.svg'
import stEthSrc from '~/assets/stETH.svg'
import curve from '~/assets/curve.webp'
import camelot from '~/assets/camelot.svg'
import rethSrc from '~/assets/rETH.svg'
import ethSrc from '~/assets/ETH.svg'
import wethSrc from '~/assets/weth.png'
import ethereumSrc from '~/assets/network/ETH.svg'
import arbitrumSrc from '~/assets/network/arbitrum.png'
import optimismSrc from '~/assets/network/optimism.png'
import baseSrc from '~/assets/network/base.png'

export interface Tag {
  title: string
  color: string
  tooltip?: string
}

export interface Asset {
  symbol: string
  src: string
  name: string,
  chain: number,
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
  {
    symbol: 'ETH',
    src: ethSrc,
    name: 'Ethereum',
    chain: 11155111,
    chainlogo: ethereumSrc,
  },
  { 
    symbol: 'stETH', 
    src: stEthSrc, 
    name: 'Lido Staked ETH', 
    chain: 11155111,
    chainlogo: ethereumSrc,
    address: '0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af'
  },
  {
    symbol: 'WETH',
    src: wethSrc,
    name: 'Wrapped ETH',
    chain: 11155111,
    chainlogo: ethereumSrc,
    address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
  },
  {
    symbol: 'ETH',
    src: ethSrc,
    name: 'Ethereum',
    chain: 11155420,
    chainlogo: optimismSrc,
  },
  {
    symbol: 'WETH',
    src: wethSrc,
    name: 'Wrapped Ethereum',
    chain: 11155420,
    chainlogo: optimismSrc,
    address: '0x4200000000000000000000000000000000000006'
  },
  // {
  //   symbol: 'ETH',
  //   src: ethSrc,
  //   name: 'Ethereum',
  //   chain: 1,
  //   chainlogo: ethereumSrc,
  // },
  // { 
  //   symbol: 'stETH', 
  //   src: stEthSrc, 
  //   name: 'Lido Staked ETH', 
  //   chain: 1,
  //   chainlogo: ethereumSrc,
  //   address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'
  // },
  // {
  //   symbol: 'rETH',
  //   src: rethSrc,
  //   name: 'Rocket Pool ETH',
  //   chain: 1,
  //   chainlogo: ethereumSrc,
  //   address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  // },
  // {
  //   symbol: 'ETH',
  //   src: ethSrc,
  //   name: 'Ethereum',
  //   chain: 10,
  //   chainlogo: optimismSrc,
  // },
  // {
  //   symbol: 'WETH',
  //   src: wethSrc,
  //   name: 'Wrapped Ethereum',
  //   chain: 10,
  //   chainlogo: optimismSrc,
  //   address: '0x4200000000000000000000000000000000000006'
  // },
  // {
  //   symbol: 'ETH',
  //   src: ethSrc,
  //   name: 'Ethereum',
  //   chain: 42161,
  //   chainlogo: arbitrumSrc,
  // },
  // {
  //   symbol: 'WETH',
  //   src: wethSrc,
  //   name: 'Wrapped Ethereum',
  //   chain: 42161,
  //   chainlogo: arbitrumSrc,
  //   address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
  // },
  // {
  //   symbol: 'ETH',
  //   src: ethSrc,
  //   name: 'Ethereum',
  //   chain: 8453,
  //   chainlogo: baseSrc,
  // },
  // {
  //   symbol: 'WETH',
  //   src: wethSrc,
  //   name: 'Wrapped Ethereum',
  //   chain: 8453,
  //   chainlogo: baseSrc,
  //   address: '0x4200000000000000000000000000000000000006'
  // },
] as Asset[]

export const protocols = [
  {
    name: 'Pendle',
    link: 'https://app.pendle.finance/lrt/zgeth',
    logo: pendle,
    chain: 'Ethereum',
    chainlogo: ethereumSrc,
    assets: 'zgETH',
    tvl: '$332,543,521',
    boost: '2x'
  },
  {
    name: 'Zircuit',
    link: 'https://stake.zircuit.com/?ref=zerog',
    logo: zircuit,
    chain: 'Ethereum',
    chainlogo: ethereumSrc,
    assets: 'zgETH',
    tvl: '$203,543',
    boost: '1x'
  },
  {
    name: 'Curve',
    link: 'https://curve.fi/#/ethereum/pools/factory-stable-ng-79/deposit',
    logo: curve,
    chain: 'Ethereum',
    chainlogo: ethereumSrc,
    assets: 'zgETH/WETH',
    tvl: '$3,359,466',
    boost: '1x'
  },
  {
    name: 'Camelot',
    link: 'https://curve.fi/#/ethereum/pools/factory-stable-ng-79/deposit',
    logo: camelot,
    chain: 'Arbitrum',
    chainlogo: arbitrumSrc,
    assets: 'zgETH/WETH',
    tvl: '$690,307',
    boost: '2x'
  }
] as Protocol[]

// Ensure there is a contract address for each asset above
export const contracts = {
  zgETH: {
    11155111: '0xA37382c02678290816d9D9e9A2e8eEC0985e1033',
    11155420: '0xa13fcA83aE6B995726F6D2cFC314675A081AC5C0'
  },
  xzgETH: '0xF36dfaCfb3Ec65F1220a502a6e504143591ED1e6',
  lrtOracle: '0xb1B8449bbafd588Ffb8Fbc4Dd82Cb936d726737D',
  lrtDepositPool: {
    11155111: '0x54F461d0db815919fB50dd3044aE642d6f83bBC6',
    11155420: '0x6e156039F84a976ff1e02aDa32f55F13a6d06fEc'
  },
  lrtConfig: '0x590AD0d487E06F5854848aAfAB5C0E9F67b2e2d3',
} as const

export const lrtOraclePriceMethod = 'zgETHPrice'

export const hubChainId = 11155111

export const depositsEndDate = new Date()
depositsEndDate.setUTCFullYear(2024, 4, 9)
depositsEndDate.setUTCHours(19, 55, 0, 0)