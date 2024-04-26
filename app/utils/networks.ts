import ethSrc from '~/assets/network/ETH.svg'
import arbSrc from '~/assets/network/arbitrum.png'
import opSrc from '~/assets/network/optimism.png'
import baseSrc from '~/assets/network/base.png'
import fraxtalSrc from '~/assets/network/fraxtal.png'

export const networks = [
  // Testnets
  // {
  //   "id": "sepolia",
  //   "chain_id": 11155111,
  //   "name": "Sepolia",
  //   "short_name": "SEP",
  //   "rpcs": [
  //     "https://ethereum-sepolia-rpc.publicnode.com",
  //   ],
  //   "private_rpcs": [
  //     "https://ethereum-sepolia-rpc.publicnode.com"
  //   ],
  //   "native_token": {
  //     "name": "Ethereum",
  //     "symbol": "ETH",
  //     "decimals": 18
  //   },
  //   "explorer": {
  //     "name": "Sepolia Etherscan",
  //     "url": "https://sepolia.etherscan.io",
  //     "icon": "~/assets/explorers/etherscan.png",
  //     "block_path": "/block/{block}",
  //     "address_path": "/address/{address}",
  //     "contract_path": "/token/{address}",
  //     "contract_0_path": "/address/{address}",
  //     "transaction_path": "/tx/{tx}"
  //   },
  //   "image": ethSrc,
  //   "color": "#636890",
  //   "group": "evm",
  //   "no_pool": true
  // },
  // {
  //   "id": "optimismSepolia",
  //   "chain_id": 11155420,
  //   "name": "Optimism",
  //   "short_name": "OP",
  //   "rpcs": [
  //     "https://sepolia.optimism.io",
  //   ],
  //   "private_rpcs": [
  //     "https://sepolia.optimism.io"
  //   ],
  //   "native_token": {
  //     "name": "Ethereum",
  //     "symbol": "oETH",
  //     "decimals": 18
  //   },
  //   "explorer": {
  //     "name": "OP Sepolia Etherscan",
  //     "url": "https://sepolia-optimism.etherscan.io",
  //     "icon": "~/assets/explorers/optimism.png",
  //     "block_path": "/block/{block}",
  //     "address_path": "/address/{address}",
  //     "contract_path": "/token/{address}",
  //     "contract_0_path": "/address/{address}",
  //     "transaction_path": "/tx/{tx}"
  //   },
  //   "image": opSrc,
  //   "color": "#dc2626",
  //   "group": "optimistic_rollups"
  // },
  // Mainnets
    {
      "id": "ethereum",
      "chain_id": 1,
      "domain_id": "6648936",
      "name": "Ethereum",
      "short_name": "ETH",
      "rpcs": [
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        "https://rpc.builder0x69.io"
      ],
      "private_rpcs": [
        "https://eth-mainnet.g.alchemy.com/v2/aWJkilx5wJU1uL2UGOfqQRo4pl_hYyUA"
      ],
      "native_token": {
        "name": "Ethereum",
        "symbol": "ETH",
        "decimals": 18
      },
      "explorer": {
        "name": "Etherscan",
        "url": "https://etherscan.io",
        "icon": "~/assets/explorers/etherscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
      },
      "image": ethSrc,
      "color": "#636890",
      "unwrapper_contract": "0x268682b7D9992aE7e2ca4A8bCc9D9655FB06056F",
      "group": "evm",
      "no_pool": true
    },
    {
      "id": "optimism",
      "chain_id": 10,
      "domain_id": "1869640809",
      "name": "Optimism",
      "short_name": "OP",
      "rpcs": [
        "https://optimism-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        "https://optimism.blockpi.network/v1/rpc/public"
      ],
      "private_rpcs": [
        "https://opt-mainnet.g.alchemy.com/v2/0oboZqHgeVJlfqVEl6-CoZUpESdns_4W"
      ],
      "native_token": {
        "name": "Ethereum",
        "symbol": "oETH",
        "decimals": 18
      },
      "explorer": {
        "name": "Etherscan",
        "url": "https://optimistic.etherscan.io",
        "icon": "~/assets/explorers/optimism.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
      },
      "image": opSrc,
      "color": "#dc2626",
      "unwrapper_contract": "0x7Fe09d217d646a6213e51b237670Bc326188cB93",
      "group": "optimistic_rollups"
    },
    {
      "id": "arbitrum",
      "chain_id": 42161,
      "domain_id": "1634886255",
      "name": "Arbitrum",
      "short_name": "ARB",
      "rpcs": [
        "https://arbitrum-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        "https://arbitrum-one.publicnode.com"
      ],
      "private_rpcs": [
        "https://arb-mainnet.g.alchemy.com/v2/TdexEsMvH_cEqRkAHKzDT6ssagS1_mc_"
      ],
      "native_token": {
        "name": "Ethereum",
        "symbol": "aETH",
        "decimals": 18
      },
      "explorer": {
        "name": "Arbiscan",
        "url": "https://arbiscan.io",
        "icon": "~/assets/explorers/arbiscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
      },
      "image": arbSrc,
      "color": "#28a0f0",
      "unwrapper_contract": "0x429b9eb01362b2799131EfCC44319689b662999D",
      "group": "optimistic_rollups"
    },
    {
      "id": "base",
      "chain_id": 8453,
      "domain_id": "1650553709",
      "name": "Base",
      "short_name": "BS",
      "rpcs": [
        "https://base.llamarpc.com",
        "https://base-rpc.publicnode.com",
        "https://base.blockpi.network/v1/rpc/public",
        "https://base-pokt.nodies.app"
      ],
      "native_token": {
        "name": "Ethereum",
        "symbol": "ETH",
        "decimals": 18
      },
      "explorer": {
        "name": "Basescan",
        "url": "https://basescan.org",
        "icon": "~/assets/explorers/basescan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
      },
      "image": baseSrc,
      "color": "#48a9a6",
      "unwrapper_contract": "0x01EdE4Fdf8CF7Ef9942a935305C3145f8dAa180A",
      "group": "evm"
    },
    {
      "id": "fraxtal",
      "chain_id": 252,
      "domain_id": "6648936",
      "name": "Fraxtal",
      "short_name": "Frax",
      "rpcs": [
        "https://rpc.frax.com",
      ],
      "private_rpcs": [
        "https://rpc.frax.com"
      ],
      "native_token": {
        "name": "Frax Ether",
        "symbol": "frxETH",
        "decimals": 18
      },
      "explorer": {
        "name": "Fraxscan",
        "url": "https://fraxscan.com",
        "icon": "~/assets/explorers/fraxscan.png",
        "block_path": "/block/{block}",
        "address_path": "/address/{address}",
        "contract_path": "/token/{address}",
        "contract_0_path": "/address/{address}",
        "transaction_path": "/tx/{tx}"
      },
      "image": fraxtalSrc,
      "color": "#636890",
      "unwrapper_contract": "0x268682b7D9992aE7e2ca4A8bCc9D9655FB06056F",
      "group": "evm",
      "no_pool": true
    },
  ]