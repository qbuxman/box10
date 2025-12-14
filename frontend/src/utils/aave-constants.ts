import PoolArtifact from "@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json"

// Adresses des contrats Aave v3
// Sepolia
export const USDC_ADDRESS_SEPOLIA = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"
export const POOL_ADDRESS_SEPOLIA = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"
export const POOL_DATA_PROVIDER_SEPOLIA =
  "0x3e9708d80f7B3e43118013075F7e95CE3AB31F31"

// Mainnet (pour fork local)
export const USDC_ADDRESS_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
export const POOL_ADDRESS_MAINNET = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"
export const POOL_DATA_PROVIDER_MAINNET =
  "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3"

// ABI du Pool Aave v3
export const POOL_ABI = PoolArtifact.abi

// ABI ERC20 approve et balanceOf
export const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
]
// ABI pour PoolDataProvider
export const POOL_DATA_PROVIDER_ABI = [
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getReserveConfigurationData",
    outputs: [
      { name: "decimals", type: "uint256" },
      { name: "ltv", type: "uint256" },
      { name: "liquidationThreshold", type: "uint256" },
      { name: "liquidationBonus", type: "uint256" },
      { name: "reserveFactor", type: "uint256" },
      { name: "usageAsCollateralEnabled", type: "bool" },
      { name: "borrowingEnabled", type: "bool" },
      { name: "stableBorrowRateEnabled", type: "bool" },
      { name: "isActive", type: "bool" },
      { name: "isFrozen", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getReserveCaps",
    outputs: [
      { name: "borrowCap", type: "uint256" },
      { name: "supplyCap", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getReserveData",
    outputs: [
      { name: "unbacked", type: "uint256" },
      { name: "accruedToTreasuryScaled", type: "uint256" },
      { name: "totalAToken", type: "uint256" },
      { name: "totalStableDebt", type: "uint256" },
      { name: "totalVariableDebt", type: "uint256" },
      { name: "liquidityRate", type: "uint256" },
      { name: "variableBorrowRate", type: "uint256" },
      { name: "stableBorrowRate", type: "uint256" },
      { name: "averageStableBorrowRate", type: "uint256" },
      { name: "liquidityIndex", type: "uint256" },
      { name: "variableBorrowIndex", type: "uint256" },
      { name: "lastUpdateTimestamp", type: "uint40" },
    ],
    stateMutability: "view",
    type: "function",
  },
]
